// -- imports --
const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// -- config --
// dotenv
dotenv.config()

// express
const app = express()
const PORT = process.env.PORT

// middlewares
app.use(express.json())
app.use(cors())

// db connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// tokens en memoire : token -> id de l'utilisateur
const tokens = new Map()

// -- auth middleware --
// verifie le token "Bearer ..." et ajoute utilisateurId + token a req
function auth(req, res, next) {
    const header = req.headers.authorization

    // header manquant ou mal forme
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: "non authentifiee" })

    // token inconnu
    const token = header.slice(7)
    if (!tokens.has(token)) return res.status(401).json({ error: "non authentifiee" })

    req.utilisateurId = tokens.get(token)
    req.token = token

    next()
}

// -- helpers --
// true si la valeur est une date valide
function dateValide(valeur) {
    if (valeur === null || valeur === undefined || valeur === '') return false
    const date = new Date(valeur)
    return !isNaN(date.getTime())
}

// -- routes publiques --
// GET / : default
app.get('/', (req, res) => {
    try {
        res.send("hello world!")
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// GET /api/cours : liste des cours
app.get('/api/cours', async (req, res) => {
    try {
        // query
        const sql = "SELECT * FROM cours"
        const [cours] = await db.query(sql)

        // data
        res.json(cours)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// GET /api/travaux : travaux ouverts, peut etre limite a un cours (?cours=)
app.get('/api/travaux', async (req, res) => {
    try {
        // get the url query if any
        const coursId = req.query.cours

        // default sql
        let sql = "SELECT * FROM travaux WHERE ouvert = 1"
        const params = []

        // if url query not empty add in query
        if (coursId) {
            sql += " And cours_id = ?"
            params.push(coursId)
        }

        // query
        const [travaux] = await db.query(sql, params)

        // data
        res.json(travaux)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// GET /api/travaux/:id : un travail (ouvert ou ferme) et ses creneaux
app.get('/api/travaux/:id', async (req, res) => {
    try {
        // get the id from url
        const travailId = req.params.id

        // query travail
        let sqlTravaux = `SELECT * FROM travaux WHERE id = ?`
        const [travail] = await db.query(sqlTravaux, [travailId])

        // 404 check
        if (travail.length === 0) {
            return res.status(404).json({ error: "Travail not found" })
        }

        // query creneaux
        const sqlCreneaux = "SELECT * FROM creneaux WHERE travail_id = ?"
        const [creneaux] = await db.query(sqlCreneaux, [travailId])

        // data
        res.json({ ...travail[0], creneaux })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// GET /api/travaux/:id/disponibilites : pour chaque creneau, le nombre d'etudiants disponibles et leurs noms
app.get('/api/travaux/:id/disponibilites', async (req, res) => {
    try {
        // get the id from url
        const travailId = req.params.id

        // query
        const sql = `
            SELECT c.*,
                   COUNT(d.matricule) AS nb_disponibles,
                   GROUP_CONCAT(d.nom SEPARATOR ',') AS noms
            FROM creneaux c
            LEFT JOIN disponibilites d ON d.creneau_id = c.id
            WHERE c.travail_id = ?
            GROUP BY c.id
        `
        const [rows] = await db.query(sql, [travailId])

        // output: "noms" string -> array
        const dispos = rows.map(row => ({
            ...row,
            noms: row.noms ? row.noms.split(',') : []
        }))

        // data
        res.json(dispos)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// PUT /api/travaux/:id/disponibilites/:matricule : remplace la reponse de cet etudiant pour ce travail
app.put('/api/travaux/:id/disponibilites/:matricule', async (req, res) => {
    try {
        // get the id + matricule from url
        const travailId = req.params.id
        const matricule = req.params.matricule

        // get vals
        const { nom, creneaux } = req.body

        // query travail
        const sqlGet = "SELECT ouvert FROM travaux WHERE id = ?"
        const [rows] = await db.query(sqlGet, [travailId])

        // 404 and 409 checks
        if (rows.length === 0) return res.status(404).json({ error: "Travail introuvable" })
        if (rows[0].ouvert === 0) return res.status(409).json({ error: "Ce travail est fermé" })

        // check vals (400)
        if (matricule.trim() === '') {
            return res.status(400).json({ error: "Le matricule est obligatoire" })
        }
        if (typeof nom !== 'string' || nom.trim() === '') {
            return res.status(400).json({ error: "Le nom est obligatoire" })
        }
        if (!Array.isArray(creneaux)) {
            return res.status(400).json({ error: "Les créneaux doivent être une liste" })
        }

        // check creneaux belong to this travail (400)
        const sqlIds = "SELECT id FROM creneaux WHERE travail_id = ?"
        const [creneauxTravail] = await db.query(sqlIds, [travailId])
        const idsValides = creneauxTravail.map(creneau => creneau.id)

        if (!creneaux.every(id => idsValides.includes(id))) {
            return res.status(400).json({ error: "Créneau invalide pour ce travail" })
        }

        // delete old answer
        const deleteSql = "DELETE FROM disponibilites WHERE travail_id = ? AND matricule = ?"
        await db.query(deleteSql, [travailId, matricule])

        // insert new answer
        const insertSql = "INSERT INTO disponibilites (travail_id, creneau_id, matricule, nom) VALUES (?, ?, ?, ?)"
        for (const creneauId of creneaux) {
            await db.query(insertSql, [travailId, creneauId, matricule, nom])
        }

        // data
        res.json({ message: "Disponibilités enregistrées" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// -- routes authentification --
// POST /api/connexion : verifie identifiant + mot de passe et cree un token
app.post('/api/connexion', async (req, res) => {
    try {
        // get vals
        const { identifiant, motDePasse } = req.body

        // check vals (400)
        if (!identifiant || !motDePasse) return res.status(400).json({ error: "champs manquant" })

        // query user
        const sql = "SELECT * FROM utilisateurs WHERE identifiant = ?"
        const [rows] = await db.query(sql, [identifiant])

        // user not found (401)
        if (rows.length === 0) return res.status(401).json({ error: "identifiant invalide" })
        const user = rows[0]

        // wrong password (401)
        const checkPwd = await bcrypt.compare(motDePasse, user.mot_de_passe_hache)
        if (!checkPwd) return res.status(401).json({ error: "identifiant invalide" })

        // create token + link it to user
        const token = crypto.randomUUID()
        tokens.set(token, user.id)

        // data
        res.json({ token: token, nom: user.nom })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'server error' })
    }
})

// POST /api/deconnexion : supprime le token
app.post('/api/deconnexion', auth, (req, res) => {
    tokens.delete(req.token)
    res.json({ message: "Déconnecté" })
})

// -- routes admin (protegees) --
// checks dans l'ordre : 401 (auth) -> 404 -> 403 -> 400

// GET /api/admin/travaux : seulement les travaux des cours de l'utilisateur connecte
app.get('/api/admin/travaux', auth, async (req, res) => {
    try {
        // query
        const sql = `
            SELECT travaux.*, cours.titre AS cours_titre
            FROM travaux
            JOIN cours ON travaux.cours_id = cours.id
            WHERE cours.utilisateur_id = ?
        `
        const [rows] = await db.query(sql, [req.utilisateurId])

        // data
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'server error' })
    }
})

// PUT /api/travaux/:id : modifie un travail (le cours ne change pas)
app.put('/api/travaux/:id', auth, async (req, res) => {
    try {
        // query travail + owner
        const sqlGet = `
            SELECT travaux.id, cours.utilisateur_id
            FROM travaux
            JOIN cours ON travaux.cours_id = cours.id
            WHERE travaux.id = ?
        `
        const [rows] = await db.query(sqlGet, [req.params.id])

        // 404 and 403 checks
        if (rows.length === 0) return res.status(404).json({ error: "doesnt exist" })
        if (rows[0].utilisateur_id !== req.utilisateurId) return res.status(403).json({ error: "not your data" })

        // get vals
        const { titre, description, type, disponible, remise, ouvert } = req.body

        // check vals (400)
        if (typeof titre !== 'string' || titre.trim() === '') {
            return res.status(400).json({ error: "Le titre est obligatoire" })
        }
        if (titre.length > 150) {
            return res.status(400).json({ error: "Le titre doit avoir 150 caractères maximum" })
        }
        if (typeof description !== 'string' || description.trim() === '') {
            return res.status(400).json({ error: "La description est obligatoire" })
        }
        if (!['individuel', 'equipe'].includes(type)) {
            return res.status(400).json({ error: "Le type doit être 'individuel' ou 'equipe'" })
        }
        if (!dateValide(disponible)) {
            return res.status(400).json({ error: "La date de disponibilité est invalide" })
        }
        if (!dateValide(remise)) {
            return res.status(400).json({ error: "La date de remise est invalide" })
        }
        if (new Date(remise) <= new Date(disponible)) {
            return res.status(400).json({ error: "La remise doit être après la date de disponibilité" })
        }
        if (typeof ouvert !== 'boolean') {
            return res.status(400).json({ error: "Le champ ouvert doit être true ou false" })
        }

        // query update
        const sqlPut = `
            UPDATE travaux
            SET titre = ?, description = ?, type = ?, disponible = ?, remise = ?, ouvert = ?
            WHERE id = ?
        `
        await db.query(sqlPut, [titre, description, type, disponible, remise, ouvert, req.params.id])

        // data
        res.json({ message: "travail modifiee" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'server error' })
    }
})

// POST /api/travaux/:id/creneaux : ajoute un creneau a un travail
app.post('/api/travaux/:id/creneaux', auth, async (req, res) => {
    try {
        // get the id from url
        const travailId = req.params.id

        // query travail + owner
        const sqlGet = `
            SELECT travaux.id, cours.utilisateur_id
            FROM travaux
            JOIN cours ON travaux.cours_id = cours.id
            WHERE travaux.id = ?
        `
        const [rows] = await db.query(sqlGet, [travailId])

        // 404 and 403 checks
        if (rows.length === 0) return res.status(404).json({ error: "doesnt exist" })
        if (rows[0].utilisateur_id !== req.utilisateurId) return res.status(403).json({ error: "not your data" })

        // get vals
        const { debut, fin } = req.body

        // check vals (400)
        if (!dateValide(debut)) {
            return res.status(400).json({ error: "La date de début est invalide" })
        }
        if (!dateValide(fin)) {
            return res.status(400).json({ error: "La date de fin est invalide" })
        }
        if (new Date(fin) <= new Date(debut)) {
            return res.status(400).json({ error: "La fin doit être après le début" })
        }

        // query existing creneaux ids
        const sqlIds = "SELECT id FROM creneaux WHERE travail_id = ?"
        const [creneaux] = await db.query(sqlIds, [travailId])

        // new id = <travailId>-NN, NN = biggest number + 1
        const prefixe = `${travailId}-`
        let max = 0
        for (const creneau of creneaux) {
            if (creneau.id.startsWith(prefixe)) {
                const numero = parseInt(creneau.id.slice(prefixe.length))
                if (numero > max) max = numero
            }
        }
        const nouvelId = prefixe + String(max + 1).padStart(2, '0')

        // query insert
        const sqlPost = "INSERT INTO creneaux (id, travail_id, debut, fin) VALUES (?, ?, ?, ?)"
        await db.query(sqlPost, [nouvelId, travailId, debut, fin])

        // data (201 = created)
        res.status(201).json({ id: nouvelId, travail_id: travailId, debut, fin })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'server error' })
    }
})

// PUT /api/creneaux/:id : modifie les heures d'un creneau (il ne change pas de travail)
app.put('/api/creneaux/:id', auth, async (req, res) => {
    try {
        // get the id from url
        const creneauId = req.params.id

        // query creneau + owner (creneaux -> travaux -> cours)
        const sqlGet = `
            SELECT creneaux.id, creneaux.travail_id, cours.utilisateur_id
            FROM creneaux
            JOIN travaux ON creneaux.travail_id = travaux.id
            JOIN cours ON travaux.cours_id = cours.id
            WHERE creneaux.id = ?
        `
        const [rows] = await db.query(sqlGet, [creneauId])

        // 404 and 403 checks
        if (rows.length === 0) return res.status(404).json({ error: "doesnt exist" })
        if (rows[0].utilisateur_id !== req.utilisateurId) return res.status(403).json({ error: "not your data" })

        // get vals
        const { debut, fin } = req.body

        // check vals (400)
        if (!dateValide(debut)) {
            return res.status(400).json({ error: "La date de début est invalide" })
        }
        if (!dateValide(fin)) {
            return res.status(400).json({ error: "La date de fin est invalide" })
        }
        if (new Date(fin) <= new Date(debut)) {
            return res.status(400).json({ error: "La fin doit être après le début" })
        }

        // query update
        const sqlPut = "UPDATE creneaux SET debut = ?, fin = ? WHERE id = ?"
        await db.query(sqlPut, [debut, fin, creneauId])

        // data
        res.json({ id: creneauId, travail_id: rows[0].travail_id, debut, fin })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'server error' })
    }
})

// DELETE /api/creneaux/:id : supprime un creneau (ses disponibilites suivent avec ON DELETE CASCADE)
app.delete('/api/creneaux/:id', auth, async (req, res) => {
    try {
        // get the id from url
        const creneauId = req.params.id

        // query creneau + owner (creneaux -> travaux -> cours)
        const sqlGet = `
            SELECT creneaux.id, cours.utilisateur_id
            FROM creneaux
            JOIN travaux ON creneaux.travail_id = travaux.id
            JOIN cours ON travaux.cours_id = cours.id
            WHERE creneaux.id = ?
        `
        const [rows] = await db.query(sqlGet, [creneauId])

        // 404 and 403 checks
        if (rows.length === 0) return res.status(404).json({ error: "doesnt exist" })
        if (rows[0].utilisateur_id !== req.utilisateurId) return res.status(403).json({ error: "not your data" })

        // query delete
        const sqlDelete = "DELETE FROM creneaux WHERE id = ?"
        await db.query(sqlDelete, [creneauId])

        // data
        res.json({ message: "creneau supprime" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'server error' })
    }
})

// -- start server --
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})

// -- imports --
const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const tokens = new Map()

// dotenv
dotenv.config()

// -- express --
const app = express()
const PORT = process.env.PORT

// -- middlewares --
app.use(express.json())
app.use(cors())


// db connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// -- auth middleware
function auth(req, res, next) {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: "non authentifiee" })

    const token = header.slice(7)
    if (!tokens.has(token)) return res.status(401).json({ error: "non authentifiee" })

    req.utilisateurId = tokens.get(token)
    req.token = token

    next()
}

// -- routes --

//default
app.get('/', (req, res) => {
    try {
        res.send("hello world!")
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// get all cours
// Liste des cours.
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

// get all travaux
// Travaux ouverts. Peut être limité à un cours.
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

// get un travail
// Un travail (ouvert ou fermé) et ses créneaux.
app.get('/api/travaux/:id', async (req, res) => {
    try {
        // get the id from url
        const travailId = req.params.id

        // sql
        let sqlTravaux = `SELECT * FROM travaux WHERE id = ?`

        // query
        const [travail] = await db.query(sqlTravaux, [travailId])

        // si existe pas
        if (travail.length === 0) {
            return res.status(404).json({ error: "Travail not found" })
        }
        // sql
        const sqlCreneaux = "SELECT * FROM creneaux WHERE travail_id = ?"

        // query
        const [creneaux] = await db.query(sqlCreneaux, [travailId])

        // data
        res.json({ ...travail[0], creneaux })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// get user dispo
// Disponibilités agrégées : pour chaque créneau,
// le nombre d’étudiants disponibles et leurs noms.
app.get('/api/travaux/:id/disponibilites', async (req, res) => {
    try {
        // get the id from url
        const travailId = req.params.id

        // sql
        const sql =
            `
            SELECT c.*,
                   COUNT(d.matricule) AS nb_disponibles,
                   GROUP_CONCAT(d.nom SEPARATOR ',') AS noms
            FROM creneaux c
            LEFT JOIN disponibilites d ON d.creneau_id = c.id
            WHERE c.travail_id = ?
            GROUP BY c.id
            `

        // query
        const [rows] = await db.query(sql, [travailId])

        // output
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


// add user dispo
// Remplace la réponse de cet étudiant pour ce travail.
app.put('/api/travaux/:id/disponibilites', async (req, res) => {
    try {
        // get the id from url
        const travailId = req.params.id

        // new data
        const { matricule, nom, creneaux } = req.body

        // validation
        if (!matricule || !nom || !Array.isArray(creneaux)) {
            return res.status(400).json({ error: "missing info" })
        }

        // delete old answer
        // sql
        const deleteSql = "DELETE FROM disponibilites WHERE travail_id = ? AND matricule = ?"

        // query
        await db.query(deleteSql, [travailId, matricule])

        const insertSql = "INSERT INTO disponibilites (travail_id, creneau_id, matricule, nom) VALUES (?, ?, ?, ?)"
        for (const creneauId of creneaux) {
            await db.query(insertSql, [travailId, creneauId, matricule, nom])
        }

        // return data
        res.json({ message: "Disponibilités enregistrées" })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

//Cherche l’utilisateur par son identifiant (requête préparée), vérifie le mot de passe et crée un jeton.
app.post('/api/connexion', async (req, res) => {
    try {
        //get values
        const { identifiant, motDePasse } = req.body
        //check if values not empty
        if (!identifiant || !motDePasse) return res.status(400).json({ error: "champs manquant" })
        //prepare sql
        const sql = "SELECT * FROM utilisateurs WHERE identifiant = ?"
        //query
        const [rows] = await db.query(sql, [identifiant])
        //check if user found
        if (rows.length === 0) return res.status(401).json({ error: "identifiant invalide" })

        const user = rows[0]
        //compare pwd
        const checkPwd = await bcrypt.compare(motDePasse, user.mot_de_passe_hache)

        //check pwd
        if (!checkPwd) return res.status(401).json({ error: "identifiant invalide" })

        //create token
        const token = crypto.randomUUID()

        //link token to user
        tokens.set(token, user.id)

        //send data
        res.json({ token: token, nom: user.nom })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'server error' })
    }
})

// deconnexion
app.post('/api/deconnexion', auth, (req, res) => {
    tokens.delete(req.token)
    res.json({ message: "Déconnecté" })
})

// get admin travaux, admin can only see travaux he created
app.get('/api/admin/travaux', auth, async (req, res) => {
    try {
        //sql
        const sql = "SELECT travaux.*, cours.titre AS cours_titre FROM travaux JOIN cours ON travaux.cours_id = cours.id WHERE cours.utilisateur_id = ?"
        //query
        const [rows] = await db.query(sql, [req.utilisateurId])
        //data
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'server error' })
    }
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
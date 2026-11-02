const express = require('express')

const app = express()
const PORT = 3000

// get all cours
// Liste des cours.
app.get('/api/cours', (req, res) => {
    try {

    } catch (err) {

    }
    res.send('all cours')
})

// get all travaux
// Travaux ouverts. Peut être limité à un cours.
app.get('/api/travaux', (req, res) => {
    res.send('all travaux')
})

// get un travail
// Un travail (ouvert ou fermé) et ses créneaux.
app.get('/api/travaux/:id', (req, res) => {
    res.send('un travaux')
})

// get user dispo
// Disponibilités agrégées : pour chaque créneau,
// le nombre d’étudiants disponibles et leurs noms.
app.get('/api/travail/:id/disponibilite', (req, res) => {
    res.send('ajouter dispo')
})


// add user dispo
// Remplace la réponse de cet étudiant pour ce travail.
app.put('/api/travail/:id/disponibilite', (req, res) => {
    res.send('ajouter dispo')
})


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
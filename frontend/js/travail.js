import { createApp, ref } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js'
import { getDisponibilites, addDisponibilites, getTravail } from './api.js'
import { dateFormat } from './services/dateFormat.js'

createApp({
    setup() {
        // id valide, passe par PHP dans data-travail
        const travailId = document.querySelector('#app').dataset.travail
        const travail = ref({})
        const disponibilites = ref([])
        const message = ref('')
        const erreur = ref('')

        // visite precedente : matricule et nom gardes dans localStorage
        const matricule = ref(localStorage.getItem('matricule') ?? '')
        const nom = ref(localStorage.getItem('nom') ?? '')

        // creneaux deja choisis par ce matricule pour ce travail
        const creneauxGardes = localStorage.getItem(cleCreneaux())
        const creneaux = ref(creneauxGardes ? JSON.parse(creneauxGardes) : [])

        // une cle par travail et par matricule, ex. "creneaux-web1-tp1-1234567"
        function cleCreneaux() {
            return `creneaux-${travailId}-${localStorage.getItem('matricule')}`
        }

        getTravail(travailId).then(data => {
            travail.value = data
            // retirer les creneaux gardes qui n'existent plus (supprimes par le prof)
            const idsExistants = (data.creneaux ?? []).map(creneau => creneau.id)
            creneaux.value = creneaux.value.filter(id => idsExistants.includes(id))
        })
        getDisponibilites(travailId).then(data => disponibilites.value = data)

        //only show dispos of a travail id
        function matchDispos(id) {
            return disponibilites.value.filter(dispo => dispo.id === id)
        }

        async function enregistrer() {
            message.value = ''
            erreur.value = ''

            const res = await addDisponibilites(travailId, matricule.value, {
                nom: nom.value,
                creneaux: creneaux.value
            })

            if (res.ok) {
                message.value = 'Disponibilités enregistrées'

                // garder pour la prochaine visite
                localStorage.setItem('matricule', matricule.value)
                localStorage.setItem('nom', nom.value)
                localStorage.setItem(cleCreneaux(), JSON.stringify(creneaux.value))

                // recharger les noms sous chaque creneau, sans recharger la page
                disponibilites.value = await getDisponibilites(travailId)
            } else {
                erreur.value = res.data.error
            }
        }

        return {
            travail,
            disponibilites,
            matricule,
            nom,
            creneaux,
            message,
            erreur,
            matchDispos,
            enregistrer,
            dateFormat
        }
    },
}).mount('#app')
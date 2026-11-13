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
        // charge : la reponse de l'API est arrivee / introuvable : l'API n'a pas trouve le travail
        const charge = ref(false)
        const introuvable = ref(false)

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
            charge.value = true
            // getTravail retourne {} si l'API repond 404 -> pas d'id
            introuvable.value = !data.id

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
            charge,
            introuvable,
            matchDispos,
            enregistrer,
            dateFormat
        }
    },
}).mount('#app')
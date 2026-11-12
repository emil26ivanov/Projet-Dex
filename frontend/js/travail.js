import { createApp, ref } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js'
import { getDisponibilites, addDisponibilites, getTravail } from './api.js'
import { dateFormat } from './services/dateFormat.js'

createApp({
    setup() {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const travail = ref({})
        const disponibilites = ref([])
        const matricule = ref('')
        const nom = ref('')
        const creneaux = ref([])

        getTravail(urlParams.get('travail')).then(data => travail.value = data)
        getDisponibilites(urlParams.get('travail')).then(data => disponibilites.value = data)

        //only show dispos of a travail id
        function matchDispos(id) {
            return disponibilites.value.filter(dispo => dispo.id === id)
        }

        async function enregistrer() {
            const res = await addDisponibilites(urlParams.get('travail'), {
                matricule: matricule.value,
                nom: nom.value,
                creneaux: creneaux.value
            })
            if (res) {
                window.location.href = 'index.php'
            }
        }

        return {
            travail,
            disponibilites,
            matricule,
            nom,
            creneaux,
            matchDispos,
            enregistrer,
            dateFormat
        }
    },
}).mount('#app')
import { createApp, ref, computed } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js'
import { getCours, getTravaux } from './api.js'

createApp({
    setup() {

        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        // le cours dans l'URL (change seulement quand on clique sur Filtrer)
        const coursFiltre = urlParams.get('cours') ?? ''
        // le cours choisi dans le select
        const courId = ref(coursFiltre)
        const cours = ref([])
        const travaux = ref([])
        const coursAffiche = computed(() =>
            cours.value
                .filter(cour => coursFiltre === '' || cour.id == coursFiltre)
                .filter(cour => matchTravaux(cour.id).length > 0)
        )
        const travauxIsPopulated = computed(() => coursAffiche.value.length > 0)

        function matchTravaux(id) {
            return travaux.value.filter(travail => travail.cours_id === id)
        }

        // c + clean url if no filter chosen
        function submitPreventFN() {
            if (courId.value === '') window.location.href = 'index.php'
            else window.location.href = `index.php?cours=${courId.value}`
        }

        getCours().then(data => cours.value = data)
        getTravaux(coursFiltre).then(data => travaux.value = data)

        return {
            cours,
            travaux,
            travauxIsPopulated,
            courId,
            coursAffiche,
            matchTravaux,
            submitPreventFN
        }
    },
}).mount('#app')
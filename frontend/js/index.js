import { createApp, ref, computed } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js'
import { getCours, getTravaux } from './api.js'

createApp({
    setup() {

        const cours = ref([])
        const travaux = ref([])
        const travauxIsPopulated = computed(() => travaux.value.length > 0)

        function matchTravaux(courId) {
            return travaux.value.filter(travail => travail.cours_id === courId)
        }

        getCours().then(data => cours.value = data)
        getTravaux().then(data => travaux.value = data)

        return { cours, travaux, travauxIsPopulated, matchTravaux }
    },
}).mount('#app')
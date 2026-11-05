import { createApp, ref, computed } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js'
import { getCours } from './api.js'

createApp({
    setup() {

        const cours = ref([])
        const coursIsPopulated = computed(() => cours.value.length > 0)

        getCours().then(data => cours.value = data)

        return { cours, coursIsPopulated }
    },
}).mount('#app')
import { createApp, ref } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js'
import { getTravail } from './api.js'

createApp({
    setup() {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const travail = ref()

        getTravail(urlParams.get('travail')).then(data => travail.value = data)

        return {
            travail,
        }
    },
}).mount('#app')
import { createApp, ref, computed } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js'
import { connexion, deconnexion, getAdminTravaux } from './api.js'


createApp({
    setup() {
        const jeton = ref(sessionStorage.getItem('token'))
        const identifiant = ref('')
        const motDePasse = ref('')
        const err = ref('')
        const travaux = ref([])
        const travailSelectionne = ref(null)

        function selectionner(travail) {
            travailSelectionne.value = { ...travail }
        }

        function chargerTravaux() {
            getAdminTravaux().then(resultat => {
                if (resultat.ok) travaux.value = resultat.data
                else if (resultat.status === 401) deconnecter()
            })
        }

        function connecter() {
            connexion(identifiant.value, motDePasse.value).then(resultat => {
                if (resultat.ok) {
                    sessionStorage.setItem('token', resultat.data.token)
                    jeton.value = resultat.data.token
                    chargerTravaux()
                } else {
                    err.value = resultat.data.error
                }
            })
        }

        function deconnecter() {
            deconnexion().then(() => {
                sessionStorage.removeItem('token')
                jeton.value = null
            })
        }

        if (jeton.value) chargerTravaux()

        return {
            jeton,
            identifiant,
            motDePasse,
            err,
            travaux,
            travailSelectionne,
            connecter,
            deconnecter,
            chargerTravaux,
            selectionner
        }
    },
}).mount('#app')
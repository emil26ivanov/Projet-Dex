import { createApp, ref, computed } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js'
import { connexion, deconnexion, getAdminTravaux, updateTravail, getDisponibilites, addCreneau, updateCreneau, deleteCreneau } from './api.js'
import { versInputDate, versInputDateTime } from './services/dateFormat.js'


createApp({
    setup() {
        const jeton = ref(sessionStorage.getItem('token'))
        const identifiant = ref('')
        const motDePasse = ref('')
        const err = ref('')
        const travaux = ref([])
        const travailSelectionne = ref(null)
        const messageSucces = ref('')
        const messageErreur = ref('')
        const creneaux = ref([])
        const nouveauCreneau = ref({ debut: '', fin: '' })
        const messageCreneau = ref('')
        const erreurCreneau = ref('')

        function selectionner(travail) {
            // effacer les messages du travail precedent
            messageSucces.value = ''
            messageErreur.value = ''

            travailSelectionne.value = { ...travail }

            // formats attendus par les inputs (date, datetime-local, checkbox)
            travailSelectionne.value.disponible = versInputDate(travail.disponible)
            travailSelectionne.value.remise = versInputDateTime(travail.remise)
            travailSelectionne.value.ouvert = travail.ouvert === 1

            // creneaux du travail
            messageCreneau.value = ''
            erreurCreneau.value = ''
            nouveauCreneau.value = { debut: '', fin: '' }
            chargerCreneaux()
        }

        // getDisponibilites donne chaque creneau + son nombre de reponses (nb_disponibles)
        function chargerCreneaux() {
            getDisponibilites(travailSelectionne.value.id).then(data => {
                creneaux.value = data.map(creneau => ({
                    ...creneau,
                    debut: versInputDateTime(creneau.debut),
                    fin: versInputDateTime(creneau.fin)
                }))
            })
        }

        function ajouterCreneau() {
            messageCreneau.value = ''
            erreurCreneau.value = ''

            addCreneau(travailSelectionne.value.id, nouveauCreneau.value).then(resultat => {
                if (resultat.ok) {
                    messageCreneau.value = 'Créneau ajouté'
                    nouveauCreneau.value = { debut: '', fin: '' }
                    chargerCreneaux()
                } else if (resultat.status === 401) {
                    deconnecter()
                } else {
                    erreurCreneau.value = resultat.data.error
                }
            })
        }

        function modifierCreneau(creneau) {
            messageCreneau.value = ''
            erreurCreneau.value = ''

            updateCreneau(creneau.id, { debut: creneau.debut, fin: creneau.fin }).then(resultat => {
                if (resultat.ok) {
                    messageCreneau.value = 'Créneau modifié'
                } else if (resultat.status === 401) {
                    deconnecter()
                } else {
                    erreurCreneau.value = resultat.data.error
                }
            })
        }

        function supprimerCreneau(creneau) {
            messageCreneau.value = ''
            erreurCreneau.value = ''

            // confirmation avec le nombre de reponses qui seront supprimees
            const message = `Ce créneau a ${creneau.nb_disponibles} réponse(s). Elles seront supprimées. Continuer ?`
            if (!confirm(message)) return

            deleteCreneau(creneau.id).then(resultat => {
                if (resultat.ok) {
                    messageCreneau.value = 'Créneau supprimé'
                    chargerCreneaux()
                } else if (resultat.status === 401) {
                    deconnecter()
                } else {
                    erreurCreneau.value = resultat.data.error
                }
            })
        }

        function enregistrer() {
            messageSucces.value = ''
            messageErreur.value = ''

            updateTravail(travailSelectionne.value.id, travailSelectionne.value).then(resultat => {
                if (resultat.ok) {
                    messageSucces.value = 'Travail modifié'
                    chargerTravaux()
                } else if (resultat.status === 401) {
                    deconnecter()
                } else {
                    messageErreur.value = resultat.data.error
                }
            })
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
            messageSucces,
            messageErreur,
            creneaux,
            nouveauCreneau,
            messageCreneau,
            erreurCreneau,
            connecter,
            deconnecter,
            chargerTravaux,
            selectionner,
            enregistrer,
            ajouterCreneau,
            modifierCreneau,
            supprimerCreneau
        }
    },
}).mount('#app')
<?php

$pageTitle = 'Admin';
$pageCss = 'admin';
require_once __DIR__ . '/includes/header.php';
?>

<div id="app" v-cloak>
    <div v-if="!jeton" class="grid-container">
        <div class="login-container">
            <form class="login-form" @submit.prevent="connecter">
                <label class="label" for="id">
                    Identifiant : 
                </label>
                <input v-model="identifiant" type="text" class="input" id="id" placeholder="ex. admin01" required>
                <label class="label" for="pwd">
                    Mot de passe : 
                </label>
                <input v-model="motDePasse" type="password" class="input" id="pwd" placeholder="Mot de passe" required>
                <p v-if="err" class="error">{{ err }}</p>
                <button class="login-btn" type="submit">Login</button>
            </form>
        </div>
        <div class="background-image"></div>
    </div>
    <div v-else class="admin-panel">
        <div class="top-bar">
            <h1 class="page-title">Panneau administrateur</h1>
            <button @click="deconnecter" class="deconnexion">Deconnexion</button>
        </div>

        <div class="grid">
            <div class="left-bar">
                <h2 class="bar-title">Mes Travaux</h2>
                <ul class="liste-travaux">
                    <li class="liste-item" :class="{ 'liste-item-active': travail.id === travailSelectionne?.id }" v-for="travail in travaux" :key="travail.id" @click="selectionner(travail)">
                        {{ travail.titre }}
                    </li>
                </ul>
            </div>
            <div class="right-bar">
                <h2 class="bar-title">Modifier un travail</h2>
                <div v-if="travailSelectionne">
                    <form class="form-travail" @submit.prevent="enregistrer">
                        <label class="label" for="titre">Choisissez un titre :</label>
                        <input v-model="travailSelectionne.titre" type="text" class="input" id="titre">

                        <label class="label" for="description">Decrivez votre travail :</label>
                        <textarea v-model="travailSelectionne.description" class="input" id="description" rows="5"></textarea>

                        <p class="label">Choisissez un type :</p>
                        <div class="form-choix">
                            <input v-model="travailSelectionne.type" type="radio" id="individuel" value="individuel">
                            <label for="individuel">individuel</label>
                            <input v-model="travailSelectionne.type" type="radio" id="equipe" value="equipe">
                            <label for="equipe">equipe</label>
                        </div>

                        <label class="label" for="disponible">Date de disponibilite :</label>
                        <input v-model="travailSelectionne.disponible" type="date" class="input" id="disponible">

                        <label class="label" for="remise">Date de remise :</label>
                        <input v-model="travailSelectionne.remise" type="datetime-local" class="input" id="remise">

                        <div class="form-choix">
                            <input v-model="travailSelectionne.ouvert" type="checkbox" id="ouvert">
                            <label for="ouvert">Ouvert aux etudiants</label>
                        </div>

                        <p v-if="messageSucces" class="succes">{{ messageSucces }}</p>
                        <p v-if="messageErreur" class="error">{{ messageErreur }}</p>

                        <button class="save-btn" type="submit">Enregistrer</button>
                    </form>

                    <h2 class="bar-title">Créneaux</h2>

                    <p v-if="messageCreneau" class="succes">{{ messageCreneau }}</p>
                    <p v-if="erreurCreneau" class="error">{{ erreurCreneau }}</p>

                    <div class="creneau" v-for="creneau in creneaux" :key="creneau.id">
                        <p class="creneau-id">{{ creneau.id }}</p>
                        <input v-model="creneau.debut" type="datetime-local" class="input">
                        <input v-model="creneau.fin" type="datetime-local" class="input">
                        <p class="creneau-reponses">{{ creneau.nb_disponibles }} réponse(s)</p>
                        <button class="save-btn" type="button" @click="modifierCreneau(creneau)">Modifier</button>
                        <button class="deconnexion" type="button" @click="supprimerCreneau(creneau)">Supprimer</button>
                    </div>

                    <form class="creneau creneau-nouveau" @submit.prevent="ajouterCreneau">
                        <p class="creneau-id">Nouveau</p>
                        <input v-model="nouveauCreneau.debut" type="datetime-local" class="input">
                        <input v-model="nouveauCreneau.fin" type="datetime-local" class="input">
                        <button class="save-btn" type="submit">Ajouter</button>
                    </form>
                </div>
                <p v-else class="form-vide">Choisissez un travail</p>
            </div>
        </div>
    </div>
    
</div>

<script type="module" src="./js/admin.js"></script>

<?php
require_once __DIR__ . '/includes/footer.php';
?>

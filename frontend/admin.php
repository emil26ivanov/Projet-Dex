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
    <div v-else>
        <div class="top-bar">
            <h1>Bonjour</h1>
            <button @click="deconnecter" class="deconnexion">Deconnexion</button>
        </div>

        <div class="left-bar">
            <h2>Mes Travaux</h2>
            <ul class="liste-travaux">
                <li v-for="travail in travaux" :key="travail.id" @click="selectionner(travail)">
                    {{ travail.titre }}
                </li>
            </ul>
        </div>
        <div class="right-bar">
            <h2>Modifer un travail</h2>
            <p v-if="travailSelectionne">{{ travailSelectionne.titre }}</p>
            <p v-else>Choisissez un travail</p>
        </div>
    </div>
    
</div>

<script type="module" src="./js/admin.js"></script>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
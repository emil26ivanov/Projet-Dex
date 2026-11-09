<?php

$pageTitle = 'Travail';
$pageCss = 'travail';
require_once __DIR__ . '/includes/header.php';
?>
<div id="app">
    <h1 class="page-title">Details du travail</h1>
    <div class="travail-info-container">
        <h2 class="travail-titre">{{ travail.titre }}</h2>
        <p class="travail-description">{{ travail.description }}</p>
        <p>{{ travail.type }}</p>
        <p>{{ travail.remise }}</p>
    </div>
    <div class="travail-form-container">
        <form class="travail" 
        @submit.prevent="enregistrer">
            <label class="matricule-label" for="matricule">
                Matricule :
            </label>
            <input 
                v-model="matricule"
                class="matricule-input" 
                type="text" 
                id="matricule"
                required
                >
            <label class="nom-label" for="nom">
                Nom :
            </label>
            <input
                v-model="nom"
                class="nom-input" 
                type="text" 
                id="nom" required
                >
            <label 
                class="creneau-label"
                v-for="creneau in travail.creneaux"
                :key="creneau.id"
            >
                <input
                    v-model="creneaux"
                    type="checkbox"
                    :value="creneau.id"
                >
                <span>
                    {{ creneau.debut }} à {{ creneau.fin }}
                </span>
                <span v-for="dispo in matchDispos(creneau.id)" :key="dispo.id">
                    <span v-for="(n, i) in dispo.noms" :key="i">
                        {{ n }}
                    </span>
                </span>
                
            </label>
            
            <button class="form-submit-button" type="submit">
                Enregistrer mes disponibilités
            </button>
        </form>
    </div>
</div>

<script type="module" src="./js/travail.js"></script>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
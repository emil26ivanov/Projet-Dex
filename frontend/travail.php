<?php

$pageTitle = 'Travail';
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
        <form class="travail">
            <label class="matricule-label" for="matricule">
                Matricule :
            </label>
            <input class="matricule-input" type="text" id="matricule">
            <label class="nom-label" for="nom">
                Nom :
            </label>
            <input class="nom-input" type="text" id="nom">
            <label 
                v-for="creneau in travail.creneaux"
                :key="creneau.id"
            >
                <input
                    type="checkbox"
                    :value="creneau.id"
                >
                <span>
                    {{ creneau.debut }} à {{ creneau.fin }}
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
<?php

$pageTitle = 'Travail';
$pageCss = 'travail';
require_once __DIR__ . '/includes/header.php';
?>
<div id="app">
    <h1 class="page-title">Details du travail</h1>
    <div class="travail">
        <div class="travail-info-container">
            <h2 class="travail-titre">{{ travail.titre }}</h2>
            <p class="travail-info">{{ travail.description }}</p>
            <p class="travail-info">{{ travail.type }}</p>
            <p class="travail-info">{{ travail.remise }}</p>
        </div>
        <div class="travail-form-container">
            <form class="travail-form" 
            @submit.prevent="enregistrer">
                <label class="labels">
                    Matricule :
                    <input 
                    v-model="matricule"
                    class="inputs" 
                    type="text" 
                    required
                    placeholder="matricule"
                    >
                </label>
                <label class="labels">
                    Nom :
                    <input
                    v-model="nom"
                    class="inputs" 
                    type="text" 
                    required
                    placeholder="nom"
                    >
                </label>
                <label 
                    class="labels"
                    v-for="creneau in travail.creneaux"
                    :key="creneau.id"
                >
                    <input
                        v-model="creneaux"
                        type="checkbox"
                        :value="creneau.id"
                        class="checkbox"
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
</div>

<script type="module" src="./js/travail.js"></script>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
<?php

$pageTitle = 'Travail';
$pageCss = 'travail';
require_once __DIR__ . '/includes/header.php';
?>
<div id="app">
    <h1 class="page-title">Détails du travail</h1>
    <div class="travail">
        <div>
            <h2 class="travail-titre">{{ travail.titre }}</h2>
            <p class="travail-info">{{ travail.description }}</p>
            <p class="travail-info"><b>Type : </b>{{ travail.type }}</p>
            <p class="travail-info"><b>Remise : </b>{{ dateFormat(travail.remise) }}</p>
        </div>
        <div class="travail-form-container">
            <form class="travail-form" 
            @submit.prevent="enregistrer">
                <label class="labels" for="matricule">
                    Matricule :
                </label>
                <input 
                    v-model="matricule"
                    class="inputs" 
                    type="text" 
                    required
                    placeholder="ex. 2134567"
                    id="matricule"
                    >
                <label class="labels" for="matricule">
                    Nom :
                </label>
                <input
                    v-model="nom"
                    class="inputs" 
                    type="text" 
                    required
                    placeholder="ex. john"
                    id="nom"
                >
                    
                <div class="creneaux">
                    <label 
                        v-for="creneau in travail.creneaux"
                        :key="creneau.id"
                        class="creneau-label"
                    >
                        <input
                            v-model="creneaux"
                            type="checkbox"
                            :value="creneau.id"
                            class="checkbox"
                        >
                        <span>
                            {{ dateFormat(creneau.debut, true) }} - {{ dateFormat(creneau.fin, true) }}
                        </span>
                        <span
                            class="creneau-noms"
                            v-for="dispo in matchDispos(creneau.id)"
                            :key="dispo.id"
                        >
                            {{ dispo.noms.join(', ') }}
                        </span>
                    </label>
                </div>
                
            
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
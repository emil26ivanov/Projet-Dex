<?php

$pageTitle = 'Home';
$pageCss = 'index';
require_once __DIR__ . '/includes/header.php';
?>

<div id="app">
    <h1 class="page-title">Liste de travaux ouverts</h1>

    <form class="filter-container" @submit.prevent="urlHandler">
        <select class="filter-select" v-model="courId" id="cours">
            <option class="select-option" value="">Tous les cours</option>
            <option class="select-option" v-for="cour in cours" :key="cour.id" :value="cour.id">{{ cour.titre }}</option>
        </select>
        <button class="filter-button" type="submit">Filtrer</button>
    </form>

    <p class="empty" v-show="!travauxIsPopulated">Aucun travail ouvert pour le moment</p>            
    <div class="cards">
        <template  v-for="cour in coursAffiche" :key="cour.id">
            <div v-for="travail in matchTravaux(cour.id)" :key="travail.id" class="travail-container"> 
                <p class="cour-title">{{ cour.titre }}</p>
                <p class="travail-title">{{ travail.titre }}</p>
                <p class="travail-type"><b>Type: </b>{{ travail.type }}</p>
                <p class="travail-date"><b>Remise: </b>{{ dateFormat(travail.remise) }}</p>
                <a class="travail-link" :href="'travail.php?travail=' + travail.id">Voir travail</a>
            </div>
        </template>
    </div>
    
</div>

<script type="module" src="./js/index.js"></script>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
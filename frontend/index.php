<?php

$pageTitle = 'Home';
$pageCss = 'index';
require_once __DIR__ . '/includes/header.php';
?>

<div id="app">
    <h1 class="page-title">Liste de travaux ouverts</h1>

    <form class="filter-container" @submit.prevent="urlHandler">
        <label for="cours">filter par cours :</label>
        <select v-model="courId" id="cours">
            <option value="">Tous les cours</option>
            <option v-for="cour in cours" :key="cour.id" :value="cour.id">{{ cour.titre }}</option>
        </select>
        <button type="submit">Filtrer</button>
    </form>

    <p v-show="!travauxIsPopulated" class="no-cours">Aucun travail ouvert pour le moment</p>            
    
    <template v-for="cour in coursAffiche" :key="cour.id">
        <div class="cour-container">
            <h2 class="cours-title">{{ cour.titre }}</h2>
            <div v-for="travail in matchTravaux(cour.id)" :key="travail.id" class="travail-container">
                <h3 class="travail-title">{{ travail.titre }}</h4>
                <p class="travail-type">{{ travail.type }}</p>
                <p class="travail-date">{{ travail.remise }}</p>
                <a :href="'travail.php?travail=' + travail.id" class="voir-travail">Voir travail</a>
            </div>
        </div>
    </template>
    
</div>

<script type="module" src="./js/index.js"></script>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
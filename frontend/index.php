<?php

$pageTitle = 'Home';
require_once __DIR__ . '/includes/header.php';
?>

<div id="app">
    <h1 class="page-title">Liste de travaux ouverts</h1>

    <form method="get">
        <label for="cours">filter par cours :</label>
        <select name="cours" id="cours">
            <option value="">Tous les cours</option>
            <option v-for="cour in cours" :key="cours.id" value="cour.titre">{{ cour.titre }}</option>
        </select>
    </form>

    <p v-show="!coursIsPopulated" class="no-cours">Aucun travail ouvert pour le moment</p>            
    
    <div v-show="coursIsPopulated" v-for="cour in cours" :key="cour.id" class="cour-container">
        <h2 class="cours-title">{{ cour.titre }}</h2>
        <div class="travail-container">
                <h4 class="travail-title">travail</h4>
                <p class="travail-type">type</p>
                <p class="travail-date">date</p>
            <button class="voir-travail">Voir travail</button>
        </div>
    </div>
</div>

<script type="module" src="./js/index.js"></script>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
<?php

$pageTitle = '404';
$pageCss = '404';
require_once __DIR__ . '/includes/header.php';
?>

<div class="not-found">
    <p class="not-found-code">404</p>
    <h1 class="page-title">Page introuvable</h1>
    <p class="not-found-text">Ce travail n'existe pas ou l'adresse est invalide.</p>
    <a class="not-found-link" href="index.php">Retour aux travaux</a>
</div>

<?php
require_once __DIR__ . '/includes/footer.php';
?>

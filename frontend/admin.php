<?php

$pageTitle = 'Admin';
$pageCss = 'admin';
require_once __DIR__ . '/includes/header.php';
?>

<div id="app">
    <div class="grid-container">
        <div class="login-container">
            <form class="login-form">
                <label class="label" for="id">
                    Identifiant : 
                </label>
                <input type="text" class="input" id="id" placeholder="ex. admin01" required>
                <label class="label" for="pwd">
                    Mot de passe : 
                </label>
                <input type="password" class="input" id="pwd" placeholder="Mot de passe" required>
                <button class="login-btn">Login</button>
            </form>
        </div>
        <div class="background-image">
        </div>
    </div>
</div>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
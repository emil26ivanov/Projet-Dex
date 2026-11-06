<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? 'Dex') ?></title>
</head>
<body>
    <header>
        <nav class="navigation">
            <div class="logo-container">
                <p class="logo">Dex</p>
            </div>
            <div class="links-container">
                <a href="index.php" class="home-link">home</a>
                <a href="admin.php" class="admin-link">admin</a>
            </div>
        </nav>
    </header>

    <main>
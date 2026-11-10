<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? 'Dex') ?></title>
    <link rel="stylesheet" href="css/main.css">
    <?php if (!empty($pageCss)): ?>
    <link rel="stylesheet" href="css/<?= htmlspecialchars($pageCss) ?>.css">
    <?php endif; ?>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/footer.css">
</head>
<body>
    <header class="header">
        <p class="logo">Dex</p>
        <nav class="navigation">
            <a href="index.php" class="nav-link">home</a>
            <a href="admin.php" class="nav-link">admin</a>
        </nav>
    </header>

    <main>
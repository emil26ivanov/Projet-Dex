# Dex

Outil pour planifier les rencontres d'un travail scolaire. L'enseignant propose des créneaux, et les étudiants indiquent leurs disponibilités.

Projet réalisé par Emil Ivanov.

## Fonctionnalités

- **Étudiants** : voir les travaux ouverts, filtrer par cours, indiquer ses disponibilités
- **Enseignants** : se connecter, modifier un travail, ajouter, modifier et supprimer des créneaux

## Installation

### 1. Base de données

Importer `init.sql` (fourni avec l'énoncé) dans phpMyAdmin, ou :

```
mysql -u root < init.sql
```

### 2. API

```
cd api
npm install
```

Créer `api/.env` :

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=DexAppBD
```

Puis démarrer l'API :

```
node server.js
```

### 3. Site

Placer le dossier dans `htdocs` de XAMPP, démarrer Apache, puis ouvrir `http://localhost/projet-dex/frontend/`.

## Comptes de démonstration

| Identifiant | Mot de passe |
|---|---|
| `prof` | `dex2026` |
| `prof2` | `web2026` |

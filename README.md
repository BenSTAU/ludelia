# 🧙 Ludelia

Plateforme de réservation pour parties de jeu de rôle en festival

<div align="center">

![Status](https://img.shields.io/badge/STATUS-STABLE-4CAF50?style=for-the-badge)
![Licence](https://img.shields.io/badge/LICENCE-USAGE%20INTERNE-FF9800?style=for-the-badge)

**Version 1.0** • **Septembre 2025**  
*Projet réalisé dans le cadre de la certification Développeur Web Fullstack RNCP 37273*

🌐 **[Url du site](https://ludelia.onrender.com)** • 🎨 **[Design Figma](https://www.figma.com/design/H456GuRN8Wcd8ZBbwW6j6F/Projet-certification?node-id=0-1&p=f&t=jQj6pAPMN511y9Jb-0)** • 💻 **[Code source](https://github.com/BenSTAU/ludelia)**

</div>

---

## 🎯 Objectif du projet

**Ludelia** est une plateforme web qui centralise la gestion et la réservation de tables de jeu de rôle lors du festival **Pautos’Jeux**. Elle permet de fluidifier les inscriptions, la communication entre joueurs, maîtres de jeu et organisateurs, et de fournir un suivi en temps réel pour tous les participants.

---

## 👥 Parties prenantes

- **Administrateur** : supervise la plateforme, gère les rôles et disponibilités des créneaux.  
- **Maîtres de jeu (MJ)** : créent et gèrent leurs tables, suivent les inscriptions.  
- **Joueurs/Visiteurs** : consultent le planning, réservent des places, reçoivent des rappels.  
- **Développeur (moi)** : conçoit, développe, teste et maintient la plateforme.

---

## 🚀 Fonctionnalités principales

### 🔥 Incluses dans le MVP

**Côté visiteur :**  
- Création de compte (formulaire ou Google OAuth)  
- Consultation du planning des tables  
- Inscription / désinscription aux parties  
- Rappels automatiques par e-mail  

**Côté MJ :**  
- Création, modification et suppression de tables  
- Suivi des inscriptions et visualisation du planning  

**Fonctionnalités transversales :**  
- Authentification sécurisée avec JWT et mot de passe hashé  
- Stockage des données dans PostgreSQL  
- Interface responsive pour desktop et mobile  

### 🚫 Exclues du MVP

- Filtrage ou recherche avancée  
- Chat interne ou système de notation  
- Paiement en ligne  
- Gestion multi-événements  
- Accessibilité avancée ou lecteur d’écran dédié

---

## 🏗️ Architecture & technologies

**Frontend :** React.js, SCSS  
**Backend :** Node.js, Express.js  
**Base de données :** PostgreSQL  
**Sécurité :** JWT, bcrypt, requêtes préparées  
**Déploiement :** Render / Neon
**Gestion de projet :** GitHub, Linear  

**Structure de dossiers principale :**  
/src

├── /features

│ ├── /auth

│ │ ├── auth.controller.js

│ │ ├── auth.routes.js

│ │ ├── auth.model.js

│ ├── /users

│ │ ├── user.controller.js

│ │ ├── user.routes.js

│ │ ├── user.model.js

├── /middleware

├── /env.js

├── /app.js

**Schéma conceptuel simplifié :**  
- Utilisateur : id, nom, username, email, activation  
- Provider : id, nom, id externe, mot de passe  
- Role : id, désignation  
- Partie : id, event_id, titre, description, MJ_id, créneau, nb_places  
- Evenement : id, titre, date_heure, lieu  
- Inscription : id, user_id, date, statut  
- Invitation : inscription_id, nom, email, statut
- Statut : statut_id, designation
- Categorie : categorie_id, designation

---

## 🛡️ Sécurité et accessibilité

- Authentification sécurisée (JWT, bcrypt)  
- Gestion des rôles et droits différenciés  
- Requêtes préparées pour éviter les injections SQL  
- HTTPS en production  
- Respect des bases de l’accessibilité (contraste, navigation clavier, alt sur images)  

---

## 🛠️ Installation locale

**Prérequis :** Node.js 18+, PostgreSQL, compte Google pour OAuth  

# Cloner le projet
git clone https://github.com/BenSTAU/ludelia.git
cd ludelia

# Installer les dépendances
cd client 
npm install
cd ../api
npm intall

# Créer un fichier .env local
cp .env.example .env

# Lancer l'application
# Terminal 1 - backend
cd ludelia/api
npm start

# Terminal 2 - frontend
cd ludelia/client
npm run dev
L’application est accessible sur http://localhost:5173 ou sur ludelia.onrender.com en production


⚠️ Limitations actuelles
Pas de filtrage avancé, chat, paiement en ligne, multi-événements

MVP centré sur les fonctionnalités critiques pour la certification

📄 Licence
Usage interne et associatif uniquement. Pour toute réutilisation, contactez l’auteur.

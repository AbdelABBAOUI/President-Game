# 🃏 President Game

![Licence](https://img.shields.io/badge/Licence-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)

## 📖 Présentation

**President Game** est une implémentation moderne du célèbre jeu de cartes "Président" (également connu sous les noms de "Trou du cul", "Asshole" ou "Capitalism") avec une interface utilisateur élégante développée en Angular et un backend robuste utilisant Colyseus pour le multijoueur en temps réel.

## ✨ Caractéristiques

- 🎮 Parties multijoueurs en temps réel
- 🌐 Système de matchmaking
- 👤 Création de profils joueurs
- 📊 Classement et statistiques
- 💬 Chat en jeu
- 🎨 Interface utilisateur réactive et intuitive
- 🎭 Système de rôles (Président, Vice-président, Neutre, Vice-trou du cul, Trou du cul)
- 🛠️ Paramètres de jeu personnalisables
- 📱 Compatible mobile et desktop

## 🚀 Technologies utilisées

### Frontend
- **Angular 18** - Framework web moderne
- **TypeScript** - Typage statique pour JavaScript
- **RxJS** - Programmation réactive
- **Tailwind CSS** - Framework CSS utilitaire
- **Angular Material** - Composants UI respectant le Material Design

### Backend
- **Colyseus** - Framework de jeu multijoueur en temps réel
- **Node.js** - Environnement d'exécution JavaScript côté serveur
- **TypeScript** - Typage statique pour JavaScript
- **MongoDB** - Base de données NoSQL

### DevOps & Infrastructure
- **Docker** - Conteneurisation des applications
- **Kubernetes (K8s)** - Orchestration des conteneurs
- **ArgoCD** - Déploiement continu GitOps
- **CI/CD Pipelines** - Intégration et déploiement continus
- **Grafana** - Monitoring et visualisation des métriques
- **Prometheus** - Collecte de métriques (utilisé avec Grafana)

## 🛠️ Installation

### Prérequis
- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)
- MongoDB (v6 ou supérieur)
- Docker (20.10 ou supérieur)
- kubectl (pour déploiement sur Kubernetes)

### Installation du frontend (Angular)
```bash
# Cloner le dépôt
git clone https://github.com/votre-nom-utilisateur/President-Game.git

# Naviguer dans le dossier du frontend
cd President-Game/angular18-starter

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

### Installation du backend (Colyseus)
```bash
# Naviguer dans le dossier du backend
cd President-Game/colyseus-starter

# Installer les dépendances
npm install

# Configurer la base de données (voir fichier .env.example)
cp .env.example .env

# Démarrer le serveur
npm start
```

### Déploiement avec Docker & Kubernetes
```bash
# Construire les images Docker
docker build -t president-game-frontend ./angular18-starter
docker build -t president-game-backend ./colyseus-starter

# Déployer sur Kubernetes
kubectl apply -f k8s/

# Alternative: Utiliser ArgoCD pour le déploiement GitOps
argocd app create president-game --repo https://github.com/votre-nom-utilisateur/President-Game.git --path k8s --dest-server https://kubernetes.default.svc --dest-namespace president-game
```

## 🎮 Comment jouer

1. **Créez un compte** ou connectez-vous
2. **Rejoignez une partie** ou créez-en une nouvelle
3. **Invitez des amis** ou attendez que d'autres joueurs rejoignent
4. **Jouez selon les règles suivantes** :
   - Le but est de se débarrasser de toutes ses cartes en premier
   - Le jeu se déroule dans le sens des aiguilles d'une montre
   - Chaque joueur peut jouer une ou plusieurs cartes de même valeur
   - Les cartes jouées doivent être de valeur supérieure ou égale à celles du joueur précédent
   - Le 2 est la carte la plus forte
   - Le joueur qui finit premier devient le "Président" pour le prochain tour, etc.

## 🔧 Configuration

Vous pouvez personnaliser diverses options du jeu en modifiant les fichiers suivants :

- `angular18-starter/src/environments/environment.ts` - Configuration frontend
- `colyseus-starter/src/config.ts` - Configuration backend
- `k8s/` - Fichiers de configuration Kubernetes
- .gitlab-ci.yml` - Configuration des pipelines CI/CD

## 📊 Monitoring

Le projet utilise Grafana et Prometheus pour le monitoring des performances et de la santé des applications :

- **Grafana** - Tableaux de bord personnalisés pour visualiser les métriques
- **Prometheus** - Collection des métriques
- **Alerting** - Notifications en cas de problèmes détectés

Accédez au tableau de bord Grafana : `https://grafana.votre-domaine.com`

## 🔄 CI/CD & GitOps

Notre flux de travail DevOps inclut :

- **Intégration continue** - Tests automatisés et build à chaque commit
- **Déploiement continu** - Déploiement automatique sur les environnements de test
- **ArgoCD** - Approche GitOps pour la gestion des déploiements
- **Rollbacks automatiques** - En cas de détection de problèmes post-déploiement
- **Environnements isolés** - Dev, Staging et Production séparés

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commitez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request


## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter :

- Email : Abdelmjid.Abbaoui@etu.isima.fr


Fait avec ❤️ par ABBAOUI Abdelmjid

# SOS Connection - Frontend

Interface client premium pour le service de dépannage internet SOS Connection.

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Configuration

Créez un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

### Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

### Prévisualiser le build

```bash
npm run preview
```

## 🎨 Stack Technique

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Routing
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas
- **Axios** - Client HTTP
- **Lucide React** - Icônes modernes

## 📁 Structure du projet

```
src/
├── components/      # Composants réutilisables
├── pages/          # Pages de l'application
├── services/       # Services API
├── types/          # Définitions TypeScript
└── styles/         # Styles globaux
```

## 🎯 Fonctionnalités

- Landing page moderne et responsive
- Formulaire SOS avec validation
- Intégration Stripe Checkout
- Pages de confirmation (succès/annulation)
- Design premium avec animations
- Support mobile/tablet/desktop

## 🌐 Configuration Backend

Par défaut, l'application se connecte à `http://localhost:4242`.
Modifiez `VITE_API_URL` dans `.env` pour changer l'URL de l'API.

## 📱 Pages

- `/` - Landing page avec formulaire SOS
- `/success` - Confirmation après paiement réussi
- `/cancel` - Page d'annulation de paiement

## 🎨 Design System

### Couleurs

- Background: `#F4F7FB`
- Navy: `#0A1733`
- Navy Dark: `#0B1A3B`
- Electric Blue: `#2E5BFF`

### Typographie

- Titres: Space Grotesk
- Corps: Inter

## 📝 License

Propriétaire - SOS Connection © 2025


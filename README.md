# 🦜 PollyGlot - Perfect Translation Every Time

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/votre-username/pollyglot)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Responsive](https://img.shields.io/badge/responsive-✓-brightgreen.svg)]()
[![PWA Ready](https://img.shields.io/badge/PWA-ready-purple.svg)]()

Une application web moderne de traduction avec interface de messagerie et sauvegarde des conversations. Développée avec HTML5, CSS3 et JavaScript Vanilla.

## ✨ Fonctionnalités

### 🌐 Traduction Multi-langues
- **Français** 🇫🇷
- **Espagnol** 🇪🇸  
- **Japonais** 🇯🇵
- Interface extensible pour ajouter d'autres langues

### 💬 Interface de Messagerie
- **Conversations sauvegardées** : Historique complet de vos traductions
- **Interface intuitive** : Style WhatsApp/Telegram
- **Messages horodatés** : Date et heure pour chaque traduction
- **Navigation rapide** : Basculer entre les conversations d'un clic

### 📱 Design Responsive
- **Mobile First** : Optimisé pour smartphones
- **Tablet Ready** : Interface adaptée aux tablettes
- **Desktop** : Vue étendue avec sidebar
- **Support multi-orientations** : Portrait et paysage

### 💾 Persistance des Données
- **Sauvegarde automatique** : Conversations stockées localement
- **Export JSON** : Téléchargement de l'historique
- **Import/Export** : Backup et restauration des données

## 🚀 Démarrage Rapide

### Prérequis
- Navigateur web moderne (Chrome 80+, Firefox 75+, Safari 13+)
- Serveur web local (pour les appels API)
- Node.js et npm (pour le backend)

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/pollyglot.git
cd pollyglot
```

2. **Structure des fichiers**
```
pollyglot/
├── index.html          # Interface principale
├── index.css           # Styles (version originale)
├── index.js            # Logique JavaScript
├── assets/             # Images et ressources
│   ├── parrot.png
│   ├── worldmap.png
│   ├── fr-flag.png
│   ├── sp-flag.png
│   └── jpn-flag.png
├── server/             # Backend (optionnel)
│   └── app.js
└── README.md
```

3. **Lancer l'application**

**Option A : Version autonome (démo)**
```bash
# Ouvrir directement index.html dans le navigateur
open index.html
```

**Option B : Avec serveur local**
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js
npx serve .

# Avec PHP
php -S localhost:8000
```

4. **Configuration du backend (optionnel)**
```bash
cd server
npm install
npm start
```

## 🛠️ Configuration

### API de Traduction

Remplacez la fonction de simulation par votre vraie API :

```javascript
// Dans index.js, méthode handleTranslation()
async handleTranslation() {
    // Votre appel API
    const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text: textToTranslate,
            targetLang: targetLang,
        }),
    });
    const data = await res.json();
    return data.translation;
}
```

### Stockage Local

Activez la persistance des données :

```javascript
// Décommenter dans ConversationManager
saveConversations() {
    localStorage.setItem('pollyglot_conversations', JSON.stringify(this.conversations));
}

loadConversations() {
    const saved = localStorage.getItem('pollyglot_conversations');
    return saved ? JSON.parse(saved) : [];
}
```

### Ajouter des Langues

1. **Modifier le HTML** :
```html
<div class="radio-check">
    <input type="radio" name="lang" id="german" value="german" />
    <label for="german">Deutsch</label>
    <div class="flag-icon">🇩🇪</div>
</div>
```

2. **Mettre à jour le JavaScript** :
```javascript
getLangName(langCode) {
    const langNames = {
        french: 'Français',
        spanish: 'Español',
        japanese: '日本語',
        german: 'Deutsch'  // Nouvelle langue
    };
    return langNames[langCode] || langCode;
}
```

## 📖 Utilisation

### Interface Utilisateur

1. **Saisir le texte** dans la zone de texte
2. **Sélectionner la langue cible** (Français, Espagnol, Japonais)
3. **Cliquer "Traduire"** ou appuyer sur `Entrée`
4. **Voir le résultat** dans l'interface de messagerie

### Gestion des Conversations

- **➕ Nouveau** : Créer une nouvelle conversation
- **Clic sur conversation** : Charger une conversation existante
- **📥 Export** : Télécharger l'historique en JSON
- **🗑️ Effacer** : Supprimer tout l'historique

### Raccourcis Clavier

- `Entrée` : Envoyer la traduction
- `Shift + Entrée` : Nouvelle ligne dans le texte

## 🎨 Personnalisation

### Thèmes et Couleurs

Modifiez les variables CSS pour personnaliser l'apparence :

```css
:root {
    --primary-color: #4CAF50;
    --secondary-color: #6c5ce7;
    --success-color: #00b894;
    --warning-color: #fdcb6e;
    --error-color: #e17055;
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 480px) { /* Styles mobile */ }

/* Tablet */
@media (min-width: 768px) { /* Styles tablette */ }

/* Desktop */
@media (min-width: 1024px) { /* Styles desktop */ }

/* Large Desktop */
@media (min-width: 1200px) { /* Grands écrans */ }
```

## 🧪 Tests

### Tests Manuels

1. **Responsivité** : Tester sur différentes tailles d'écran
2. **Fonctionnalités** : Vérifier toutes les fonctions
3. **Persistance** : Vérifier la sauvegarde des données
4. **Performance** : Tester avec plusieurs conversations

### Tests Automatisés (à implémenter)

```bash
# Framework recommandé : Jest + Puppeteer
npm install --save-dev jest puppeteer
npm test
```

## 🚀 Déploiement

### Hébergement Statique

**Netlify**
```bash
# Build et deploy automatique
git push origin main
```

**Vercel**
```bash
npx vercel
```

**GitHub Pages**
```bash
# Activer GitHub Pages dans les settings du repo
```

### Serveur Web

**Nginx**
```nginx
server {
    listen 80;
    server_name pollyglot.exemple.com;
    
    location / {
        root /var/www/pollyglot;
        try_files $uri $uri/ /index.html;
    }
}
```

### PWA (Progressive Web App)

Ajoutez un `manifest.json` :

```json
{
  "name": "PollyGlot",
  "short_name": "PollyGlot",
  "description": "Perfect Translation Every Time",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#4CAF50",
  "theme_color": "#4CAF50",
  "icons": [
    {
      "src": "assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🤝 Contribution

### Comment Contribuer

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Guidelines

- Code JavaScript moderne (ES6+)
- CSS avec préfixes navigateurs
- Documentation des nouvelles fonctionnalités
- Tests pour les nouvelles features

### Structure de Commit

```
type(scope): description

feat(translation): add German language support
fix(ui): resolve mobile responsive issue
docs(readme): update installation guide
```

## 📄 API Reference

### ConversationManager Class

```javascript
// Créer une nouvelle conversation
startNewConversation()

// Charger une conversation
loadConversation(conversationId)

// Ajouter un message
addMessage(text, isUser, targetLang, translation)

// Exporter les données
exportConversations()

// Effacer l'historique
clearAllHistory()
```

### Structure des Données

```javascript
// Format de conversation
{
    id: String,           // ID unique
    title: String,        // Titre de la conversation
    messages: Array,      // Liste des messages
    createdAt: String,    // Date de création ISO
    updatedAt: String     // Dernière modification ISO
}

// Format de message
{
    id: String,           // ID unique du message
    text: String,         // Contenu du message
    isUser: Boolean,      // true = utilisateur, false = assistant
    targetLang: String,   // Langue cible
    translation: String,  // Traduction (si applicable)
    timestamp: String     // Horodatage ISO
}
```

## 🐛 Dépannage

### Problèmes Courants

**1. L'application ne se charge pas**
- Vérifiez la console navigateur (F12)
- Assurez-vous que tous les fichiers sont présents
- Testez avec un serveur local

**2. Les traductions ne fonctionnent pas**
- Vérifiez la configuration de l'API
- Regardez les erreurs réseau dans DevTools
- Testez la fonction de simulation

**3. Les conversations ne se sauvegardent pas**
- Activez localStorage (décommentez le code)
- Vérifiez les permissions du navigateur
- Testez en navigation privée

**4. Interface cassée sur mobile**
- Vérifiez la meta viewport
- Testez les media queries CSS
- Validez le HTML/CSS

### Logs et Debug

```javascript
// Activer les logs détaillés
const DEBUG = true;

if (DEBUG) {
    console.log('Conversation saved:', conversation);
}
```

## 📋 Roadmap

### Version 2.1.0
- [ ] Recherche dans l'historique
- [ ] Favoris et tags
- [ ] Mode sombre
- [ ] Notifications push

### Version 2.2.0
- [ ] Support audio (speech-to-text)
- [ ] Traduction d'images (OCR)
- [ ] Synchronisation cloud
- [ ] Partage de conversations

### Version 3.0.0
- [ ] Interface multi-utilisateurs
- [ ] API REST complète
- [ ] Application mobile native
- [ ] IA conversationnelle avancée

## 📞 Support

### Contacts

- **Bugs** : [Issues GitHub](https://github.com/votre-username/pollyglot/issues)
- **Discussions** : [GitHub Discussions](https://github.com/votre-username/pollyglot/discussions)
- **Email** : votre-email@exemple.com

### FAQ

**Q: Comment changer la langue de l'interface ?**
A: Modifiez les textes dans `index.html` et les labels JavaScript.

**Q: Puis-je utiliser une autre API de traduction ?**
A: Oui, modifiez la méthode `handleTranslation()` dans `index.js`.

**Q: L'app fonctionne-t-elle hors ligne ?**
A: Partiellement. Les conversations sont sauvées localement, mais la traduction nécessite une connexion.

## 📝 Changelog

### [2.0.0] - 2024-01-15
#### Added
- Interface de messagerie complète
- Système de conversations multiples
- Sauvegarde et export des données
- Design responsive avancé
- Support PWA

#### Changed
- Interface utilisateur complètement repensée
- Amélioration des performances
- Architecture modulaire

#### Fixed
- Bugs d'affichage mobile
- Problèmes de persistance des données

### [1.0.0] - 2024-01-01
#### Added
- Traduction de base (FR, ES, JP)
- Interface simple
- Responsive basique

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Font Awesome** pour les icônes
- **Google Fonts** pour la typographie Poppins
- **Unsplash** pour les images de fond
- **Community** pour les contributions et feedback

---

Développé avec ❤️ par [Votre Nom](https://github.com/votre-username)

**⭐ N'hésitez pas à star le projet si vous l'aimez !**
// Système de gestion des conversations - VERSION CORRIGÉE
class ConversationManager {
  constructor() {
    this.conversations = this.loadConversations();
    this.currentConversationId = null;
    this.init();
  }

  init() {
    this.renderHistoryList();
    this.setupEventListeners();

    // Créer une nouvelle conversation si aucune n'existe
    if (this.conversations.length === 0) {
      this.startNewConversation();
    } else {
      // Charger la dernière conversation
      this.loadConversation(this.conversations[0].id);
    }
  }

  setupEventListeners() {
    const translateButton = document.getElementById("translate-button");
    const textInput = document.getElementById("text-to-translate");

    if (translateButton) {
      translateButton.addEventListener("click", () => {
        this.handleTranslation();
      });
    }

    // Permettre l'envoi avec Entrée
    if (textInput) {
      textInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.handleTranslation();
        }
      });
    }
  }

  // Créer une nouvelle conversation
  startNewConversation() {
    const newConversation = {
      id: Date.now().toString(),
      title: `Conversation ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.conversations.unshift(newConversation);
    this.currentConversationId = newConversation.id;
    this.saveConversations();
    this.renderHistoryList();
    this.renderCurrentConversation();
  }

  // Charger une conversation existante
  loadConversation(conversationId) {
    this.currentConversationId = conversationId;
    this.renderCurrentConversation();
    this.renderHistoryList(); // Pour mettre à jour l'état actif
  }

  // Ajouter un message à la conversation courante
  addMessage(text, isUser = true, targetLang = null, translation = null) {
    const conversation = this.conversations.find(
      (c) => c.id === this.currentConversationId
    );
    if (!conversation) return;

    const message = {
      id: Date.now().toString(),
      text: text,
      isUser: isUser,
      targetLang: targetLang,
      translation: translation,
      timestamp: new Date().toISOString(),
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date().toISOString();

    // Mettre à jour le titre de la conversation avec le premier message
    if (conversation.messages.length === 1 && isUser) {
      conversation.title =
        text.length > 30 ? text.substring(0, 30) + "..." : text;
    }

    this.saveConversations();
    this.renderCurrentConversation();
    this.renderHistoryList();
  }

  // Gérer la traduction avec gestion d'erreurs améliorée
  async handleTranslation() {
    const textInput = document.getElementById("text-to-translate");
    const langRadio = document.querySelector('input[name="lang"]:checked');
    const translateButton = document.getElementById("translate-button");

    if (!textInput) {
      console.error("Élément text-to-translate introuvable");
      return;
    }

    const textToTranslate = textInput.value.trim();

    if (!textToTranslate) {
      this.showNotification("Veuillez saisir du texte à traduire !", "warning");
      return;
    }

    if (!langRadio) {
      this.showNotification(
        "Veuillez sélectionner une langue cible !",
        "warning"
      );
      return;
    }

    const targetLang = langRadio.value;

    // Ajouter le message utilisateur
    this.addMessage(textToTranslate, true, targetLang);

    // Désactiver le bouton pendant la traduction
    if (translateButton) {
      translateButton.textContent = "Traduction...";
      translateButton.disabled = true;
    }

    // Afficher l'indicateur de chargement
    this.showLoadingMessage();

    try {
      const translation = await this.chatWithOpenaiChat(
        textToTranslate,
        targetLang
      );

      // Supprimer l'indicateur de chargement
      this.hideLoadingMessage();

      // Ajouter la réponse de traduction
      this.addMessage(translation, false, targetLang);
      this.showNotification("Traduction réussie !", "success");
    } catch (error) {
      console.error("Erreur de traduction:", error);
      this.hideLoadingMessage();
      this.addMessage(`❌ Erreur: ${error.message}`, false);
      this.showNotification(`Erreur: ${error.message}`, "error");
    } finally {
      // Réinitialiser l'interface
      if (textInput) textInput.value = "";
      if (translateButton) {
        translateButton.textContent = "Traduire";
        translateButton.disabled = false;
        textInput.focus();
      }
    }
  }

  // Votre fonction API avec gestion d'erreurs
  async chatWithOpenaiChat(textToTranslate, targetLang) {
    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToTranslate,
          targetLang: targetLang,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erreur serveur: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.translation) {
        throw new Error("Réponse invalide du serveur");
      }

      return data.translation;
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Impossible de contacter le serveur. Vérifiez que votre API est démarrée sur localhost:3000"
        );
      }
      throw error;
    }
  }

  // Afficher la conversation courante - VERSION CORRIGÉE
  renderCurrentConversation() {
    const messagesContainer = document.getElementById("messages-container");

    if (!messagesContainer) {
      console.error("Élément messages-container introuvable");
      return;
    }

    const conversation = this.conversations.find(
      (c) => c.id === this.currentConversationId
    );

    // Vider le conteneur
    messagesContainer.innerHTML = "";

    if (!conversation || conversation.messages.length === 0) {
      // Créer et afficher l'état vide
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
        <div class="empty-state-icon">💭</div>
        <h3>Commencez une nouvelle conversation</h3>
        <p>Tapez votre texte ci-dessous et sélectionnez une langue pour traduire</p>
      `;
      messagesContainer.appendChild(emptyState);
      return;
    }

    // Afficher les messages
    conversation.messages.forEach((message) => {
      const messageEl = document.createElement("div");
      messageEl.className = `message ${message.isUser ? "user" : "assistant"}`;

      const time = new Date(message.timestamp).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      messageEl.innerHTML = `
        <div>${message.text}</div>
        ${
          message.targetLang && message.isUser
            ? `<div class="message-lang">Vers: ${this.getLangName(
                message.targetLang
              )}</div>`
            : ""
        }
        <div class="message-time">${time}</div>
      `;

      messagesContainer.appendChild(messageEl);
    });

    // Faire défiler vers le bas
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Afficher liste d'historique - avec vérifications
  renderHistoryList() {
    const historyList = document.getElementById("history-list");

    if (!historyList) {
      console.error("Élément history-list introuvable");
      return;
    }

    if (this.conversations.length === 0) {
      historyList.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #666;">
          <p>Aucune conversation</p>
        </div>
      `;
      return;
    }

    historyList.innerHTML = "";

    this.conversations.forEach((conversation) => {
      const historyItem = document.createElement("div");
      historyItem.className = `history-item ${
        conversation.id === this.currentConversationId ? "active" : ""
      }`;
      historyItem.onclick = () => this.loadConversation(conversation.id);

      const date = new Date(conversation.updatedAt).toLocaleDateString("fr-FR");
      const lastLang = conversation.messages.find(
        (m) => m.isUser && m.targetLang
      )?.targetLang;

      historyItem.innerHTML = `
        <div class="history-item-date">${date}</div>
        <div class="history-item-preview">${conversation.title}</div>
        ${
          lastLang
            ? `<div class="history-item-lang">${this.getLangName(
                lastLang
              )}</div>`
            : ""
        }
      `;

      historyList.appendChild(historyItem);
    });
  }

  // Afficher message de chargement
  showLoadingMessage() {
    const messagesContainer = document.getElementById("messages-container");
    if (!messagesContainer) return;

    // Supprimer le message de chargement existant
    this.hideLoadingMessage();

    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loading-message";
    loadingDiv.className = "message assistant";
    loadingDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="loading-spinner">
          <div style="display: flex; gap: 4px;">
            <div class="dot" style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%; animation: bounce 1.4s infinite;"></div>
            <div class="dot" style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%; animation: bounce 1.4s infinite 0.2s;"></div>
            <div class="dot" style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%; animation: bounce 1.4s infinite 0.4s;"></div>
          </div>
        </div>
        <span>Traduction en cours...</span>
      </div>
    `;

    // Ajouter les styles d'animation
    this.addLoadingStyles();

    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Supprimer message de chargement
  hideLoadingMessage() {
    const loadingMessage = document.getElementById("loading-message");
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }

  // Ajouter les styles d'animation
  addLoadingStyles() {
    if (document.getElementById("loading-animation")) return;

    const style = document.createElement("style");
    style.id = "loading-animation";
    style.textContent = `
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  // Système de notifications
  showNotification(message, type = "info") {
    // Supprimer notifications existantes
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();

    const notification = document.createElement("div");
    notification.className = "notification";

    const colors = {
      success: "#4CAF50",
      error: "#f44336",
      warning: "#ff9800",
      info: "#2196F3",
    };

    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };

    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      ">
        <span>${icons[type]}</span>
        <span>${message}</span>
        <button onclick="this.closest('.notification').remove()" 
                style="background: none; border: none; color: white; 
                       cursor: pointer; margin-left: 10px; font-size: 16px;">✖</button>
      </div>
    `;

    // Ajouter styles d'animation
    this.addNotificationStyles();

    document.body.appendChild(notification);

    // Auto-suppression après 5 secondes
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Ajouter styles de notification
  addNotificationStyles() {
    if (document.getElementById("notification-animation")) return;

    const style = document.createElement("style");
    style.id = "notification-animation";
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // Obtenir le nom de la langue
  getLangName(langCode) {
    const langNames = {
      french: "Français",
      spanish: "Español",
      japanese: "日本語",
    };
    return langNames[langCode] || langCode;
  }

  // Sauvegarder les conversations
  saveConversations() {
    try {
      localStorage.setItem(
        "pollyglot_conversations",
        JSON.stringify(this.conversations)
      );
    } catch (error) {
      console.warn("Impossible de sauvegarder dans localStorage:", error);
    }
  }

  // Charger les conversations
  loadConversations() {
    try {
      const saved = localStorage.getItem("pollyglot_conversations");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Impossible de charger depuis localStorage:", error);
      return [];
    }
  }

  // Exporter les conversations
  exportConversations() {
    try {
      const dataStr = JSON.stringify(this.conversations, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pollyglot_conversations_${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      this.showNotification("Erreur lors de l'export", "error");
    }
  }

  // Effacer tout l'historique
  clearAllHistory() {
    if (
      confirm("Êtes-vous sûr de vouloir effacer toutes les conversations ?")
    ) {
      this.conversations = [];
      this.currentConversationId = null;
      this.saveConversations();
      this.startNewConversation();
      this.showNotification("Historique effacé", "info");
    }
  }
}

// Fonctions globales pour les boutons
let conversationManager;

function startNewConversation() {
  if (conversationManager) {
    conversationManager.startNewConversation();
  }
}

function exportConversations() {
  if (conversationManager) {
    conversationManager.exportConversations();
  }
}

function clearAllHistory() {
  if (conversationManager) {
    conversationManager.clearAllHistory();
  }
}

// Initialiser l'application avec vérifications
document.addEventListener("DOMContentLoaded", () => {
  // Vérifier que les éléments nécessaires existent
  const requiredElements = [
    "messages-container",
    "translate-button",
    "text-to-translate",
    "history-list",
  ];

  const missingElements = requiredElements.filter(
    (id) => !document.getElementById(id)
  );

  if (missingElements.length > 0) {
    console.error("Éléments HTML manquants:", missingElements);
    alert(`Erreur: Éléments HTML manquants: ${missingElements.join(", ")}`);
    return;
  }

  // Initialiser le gestionnaire de conversations
  try {
    conversationManager = new ConversationManager();
    console.log("ConversationManager initialisé avec succès");
    document.getElementById("btn-new").addEventListener("click", () => {
      conversationManager.startNewConversation();
    });

    document.getElementById("btn-export").addEventListener("click", () => {
      conversationManager.exportConversations();
    });

    document.getElementById("btn-clear").addEventListener("click", () => {
      conversationManager.clearAllHistory();
    });
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    alert("Erreur lors de l'initialisation de l'application");
  }
});

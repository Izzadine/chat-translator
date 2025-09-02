const translateButton = document.getElementById("translate-button");
const langContainer = document.getElementById("lang-container");
const originalText = document.getElementById("original-text");
const yourTranslation = document.getElementById("your-translation");
const mainSection = document.getElementById("main-section");
const placeholderText = document.getElementById('text-to-translate')

async function chatWithOpenaiChat() {
  const textToTranslate = document.getElementById("text-to-translate").value;
  const lang = document.querySelector('input[name="lang"]:checked').value;
  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: textToTranslate,
      targetLang: lang,
    }),
  });
  const data = await res.json();
  renderTextTranslated(data.translation);
  console.log(data.translation);
}

function renderTextTranslated(text) {
  originalText.textContent = "Original text 👇";
  yourTranslation.textContent = "Your translation 👇";
  langContainer.innerHTML = `
      <textarea class="textarea" placeholder="${text}"></textarea>
    `;
 placeholderText.value=document.getElementById("text-to-translate")
  langContainer.style.display = "block";
  langContainer.style.margin = "0 auto";
  translateButton.remove();
  mainSection.innerHTML += `
    <button type="button" id="reset">Start over</button>
    `;
  const resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", reset);
}

function reset() {
  originalText.textContent = "Text to translate  👇";
  yourTranslation.textContent = "Select language  👇";
  langContainer.innerHTML = `        
          <div class="radio-check">
            <input type="radio" name="lang" id="french" value="french" />
            <label for="french">French</label>
            <img src="assets/fr-flag.png" />
          </div>
          <div class="radio-check">
            <input type="radio" name="lang" id="spanish" value="spanish" />
            <label for="spanish">Spanish</label>
            <img src="assets/sp-flag.png" />
          </div>
          <div class="radio-check">
            <input type="radio" name="lang" id="japanese" value="japanese" />
            <label for="japanese">Japanese</label>
            <img src="assets/jpn-flag.png" />
          </div>

        <button type="button" id="translate-button">Translate</button>
      `;
}

translateButton.addEventListener("click", chatWithOpenaiChat);

// chatWithOpenaiChat()

// console.log("It work well")

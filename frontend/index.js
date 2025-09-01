
const translateButton = document.getElementById("translate-button")

async function chatWithOpenaiChat() {
    
    const textToTranslate =document.getElementById('text-to-translate').value
    const res= await fetch('http://localhost:3000/api/chat', {
    method:'POST',
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(
        {
            text:textToTranslate,
            targetLang:"french", 
        }),
   });
    const data = await res.json();
    console.log(data.translation);
}

translateButton.addEventListener('click', chatWithOpenaiChat)



chatWithOpenaiChat()

console.log("It work well")
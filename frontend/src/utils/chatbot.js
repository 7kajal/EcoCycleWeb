document.getElementById("chatbot").addEventListener("click", toggleChat);
document.getElementById("chatInput").addEventListener("click", sendMessage);

function toggleChat() {
  const chatWindow = document.getElementById("chat-window");
  chatWindow.classList.toggle("hidden");
}

// To toggle chatbot if user clicks anywhere on the screen except on chatbot
document.addEventListener("click", function (event) {
  const chatWindow = document.getElementById("chat-window");
  const chatbotButton = document.getElementById("chatbot");

  if (!chatWindow.contains(event.target) && !chatbotButton.contains(event.target)) {
    chatWindow.classList.add("hidden"); // Hide chat window
  }
});

async function sendMessage() {
  console.log("working");
  const input = document.getElementById("chat-input");
  const content = document.getElementById("chat-content");
  const message = input.value.trim();
  if (!message) return;

  content.innerHTML += `<div class='p-1 mr-8 bg-gray-200 rounded-md my-1'>${message}</div>`;
  input.value = "";

  // Call chat api
  const response = await fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userPrompt: message }),
  });
  const result = await response.json();
  console.log(result);
  content.innerHTML += `<div class='p-1  ml-8 bg-blue-200 rounded-md my-1'>${result.botResponse}</div>`;
  content.scrollTop = content.scrollHeight;
}

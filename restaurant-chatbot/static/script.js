const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("send-button");

const chatPanel = document.getElementById("chat-panel");
const chatToggle = document.getElementById("chat-toggle");
const chatClose = document.getElementById("chat-close");

chatToggle.addEventListener("click", () => {
    chatPanel.hidden = !chatPanel.hidden;

    if (!chatPanel.hidden) {
        input.focus();
    }
});

chatClose.addEventListener("click", () => {
    chatPanel.hidden = true;
});

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = `message ${sender}-message`;
    div.textContent = text;

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

async function sendMessage(text) {
    text = text.trim();

    if (!text || sendButton.disabled) return;

    addMessage(text, "user");
    input.value = "";
    sendButton.disabled = true;

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        if (!response.ok) {
            throw new Error("Server request failed");
        }

        const data = await response.json();
        addMessage(data.reply || "Please try again.", "bot");
    } catch (error) {
        console.error(error);
        addMessage(
            "Sorry, we're temporarily unable to respond. Please try again.",
            "bot"
        );
    } finally {
        sendButton.disabled = false;
        input.focus();
    }
}

form.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(input.value);
});

document.querySelectorAll(".quick-questions button").forEach(button => {
    button.addEventListener("click", () => {
        sendMessage(button.dataset.message);
    });
});
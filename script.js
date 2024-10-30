async function searchGame() {
  const gameName = document.getElementById("game-input").value.trim();
  if (!gameName) return;

  // Tambahkan pesan pengguna ke UI
  addChatBubble(gameName, "user");

  try {
    const response = await fetch(
      `/search-game?name=${encodeURIComponent(gameName)}`
    );
    console.log("Status respons:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data diterima dari server:", data);

    if (data.message) {
      addChatBubble(data.message, "ai");
    } else if (data.downloadLink && data.installLink && data.gameplayLink) {
      addChatBubble(
        `Berikut link download game-nya: <a href="${data.downloadLink}" target="_blank">${data.downloadLink}</a><br>` +
          `Cara menginstallnya: <a href="${data.installLink}" target="_blank">${data.installLink}</a><br>` +
          `Gameplay atau cara memainkannya: <a href="${data.gameplayLink}" target="_blank">${data.gameplayLink}</a>`,
        "ai"
      );
    } else {
      addChatBubble(
        "Maaf, terjadi kesalahan di server. Coba lagi nanti.",
        "ai"
      );
    }
  } catch (error) {
    console.error("Error saat mengakses server:", error);
    addChatBubble("Maaf, terjadi kesalahan di server. Coba lagi nanti.", "ai");
  }

  document.getElementById("game-input").value = "";
}

// Fungsi untuk menambahkan bubble chat ke UI
function addChatBubble(message, sender) {
  const chatOutput = document.getElementById("chat-output");
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble", sender);
  bubble.innerHTML = message;

  chatOutput.appendChild(bubble);
  chatOutput.scrollTop = chatOutput.scrollHeight; // Autoscroll ke pesan terakhir
}

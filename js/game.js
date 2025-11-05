document.addEventListener("DOMContentLoaded", () => {
  const imgPath = "../img/animais/";
  const animais = [
    "leão.png",
    "cavalo.png",
    "zebra.png",
    "macaco.png",
    "girafa.png",
    "elefante.png",
    "tigre.png",
    "urso.png",
    "cachorro.png",
    "gato.png"
  ];

  const animalImg = document.getElementById("animal-img");
  const wordContainer = document.getElementById("word-container");
  const keyButtons = Array.from(document.querySelectorAll(".key"));
  const deleteBtn = document.querySelector(".key-delete");

  function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  let animalName = "";
  let animalNameNorm = "";
  let slots = [];
  let revealedByHint = [];

  function getMessageElement() {
    let msg = document.querySelector(".game-message");
    if (!msg) {
      msg = document.createElement("div");
      msg.classList.add("game-message");
      document.querySelector(".game-container").appendChild(msg);
    }
    return msg;
  }

  function loadNewAnimal() {
    const msg = document.querySelector(".game-message");
    if (msg) {
      msg.textContent = "";
      msg.className = "game-message";
    }

    const randomAnimalFile = animais[Math.floor(Math.random() * animais.length)];
    animalName = randomAnimalFile.split(".")[0];
    animalNameNorm = normalize(animalName);
    animalImg.src = imgPath + randomAnimalFile;

    slots = new Array(animalName.length).fill("_");
    revealedByHint = new Array(animalName.length).fill(false);
    applyInitialHints();
    renderSlots();
  }

  function applyInitialHints() {
    const n = animalName.length;
    for (let i = 0; i < n; i++) {
      if (i % 3 === 0) {
        slots[i] = animalName[i].toUpperCase();
        revealedByHint[i] = true;
      }
    }
  }

  function renderSlots() {
    wordContainer.innerHTML = "";
    slots.forEach((ch) => {
      const div = document.createElement("div");
      div.classList.add("letter-slot");
      div.textContent = ch === "_" ? "" : ch;
      wordContainer.appendChild(div);
    });
  }

  function animateAllLetters(className) {
    const letters = wordContainer.querySelectorAll(".letter-slot");
    letters.forEach((slot) => {
      if (slot.textContent.trim() !== "") {
        slot.classList.add(className);
        setTimeout(() => slot.classList.remove(className), 600);
      }
    });
  }

  function showMessage(text, type) {
    const msg = getMessageElement();

    msg.className = "game-message";
    msg.textContent = text;

    void msg.offsetWidth;

    msg.classList.add("show");
    if (type === "success") msg.classList.add("success");
    else msg.classList.add("error");

    const visibleMs = 1500;
    const fadeMs = 600;

    setTimeout(() => {
      msg.classList.add("fade-out");
      setTimeout(() => {
        msg.textContent = "";
        msg.className = "game-message";
      }, fadeMs);
    }, visibleMs);
  }

  function handleKeyClick(buttonEl, letra) {
    const nextIndex = slots.findIndex((ch, idx) => ch === "_" && !revealedByHint[idx]);
    if (nextIndex === -1) return; 

    slots[nextIndex] = letra.toUpperCase();
    renderSlots();

    if (!slots.includes("_")) {
      const tentativa = slots.join("").toLowerCase();
      const correta = animalName.toLowerCase();

      if (normalize(tentativa) === normalize(correta)) {
        animateAllLetters("correct-letter");
        showMessage("🎉 Muito bem!", "success");
        setTimeout(() => loadNewAnimal(), 1200);
      } else {
        animateAllLetters("wrong-letter");
        showMessage("❌ Tente novamente!", "error");
        setTimeout(() => handleDelete(), 1000);
      }
    }
  }

  function handleDelete() {
    for (let i = 0; i < slots.length; i++) {
      if (!revealedByHint[i]) {
        slots[i] = "_";
      }
    }
    renderSlots();
  }

  function enableKeyboard() {
    keyButtons.forEach((btn) => {
      const letra = btn.textContent.trim();
      if (btn.classList.contains("key-delete")) return;
      btn.addEventListener("click", () => handleKeyClick(btn, letra));
    });
    if (deleteBtn) deleteBtn.addEventListener("click", handleDelete);
  }

  enableKeyboard();
  loadNewAnimal();
});
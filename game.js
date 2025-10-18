const playArea = document.getElementById("play-area");
const input = document.getElementById("input");
const levelDisplay = document.getElementById("level");
const livesDisplay = document.getElementById("lives");

let level = 1;
let lives = 3;
let words = ["cat", "dog", "space", "math", "star", "game"];
let activeWords = [];
let spawnInterval = 2000; // ms
let fallSpeed = 1; // px per frame

function spawnWord() {
  let text;
  if (Math.random() < 0.5) {
    // random word
    text = words[Math.floor(Math.random() * words.length)];
  } else {
    // simple math problem
    let a = Math.floor(Math.random() * 10);
    let b = Math.floor(Math.random() * 10);
    text = `${a}+${b}=${a+b}`;
  }

  const wordEl = document.createElement("div");
  wordEl.classList.add("word");
  wordEl.textContent = text;
  wordEl.style.left = Math.random() * 500 + "px";
  wordEl.style.top = "0px";
  playArea.appendChild(wordEl);

  activeWords.push({ el: wordEl, text });
}

function gameLoop() {
  activeWords.forEach((word, index) => {
    let top = parseInt(word.el.style.top);
    word.el.style.top = top + fallSpeed + "px";

    if (top > 380) {
      // word reached bottom
      playArea.removeChild(word.el);
      activeWords.splice(index, 1);
      loseLife();
    }
  });

  requestAnimationFrame(gameLoop);
}

function loseLife() {
  lives--;
  livesDisplay.textContent = "Lives: " + lives;
  if (lives <= 0) {
    alert("Game Over! Refresh to restart.");
    location.reload();
  }
}

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    let typed = input.value.trim();
    let foundIndex = activeWords.findIndex(w => w.text === typed);
    if (foundIndex >= 0) {
      playArea.removeChild(activeWords[foundIndex].el);
      activeWords.splice(foundIndex, 1);
      input.value = "";

      // Level up every 5 kills
      if (Math.random() < 0.2) {
        level++;
        levelDisplay.textContent = "Level: " + level;
        fallSpeed += 0.5;
        if (spawnInterval > 500) spawnInterval -= 200;
      }
    } else {
      input.value = "";
    }
  }
});

setInterval(spawnWord, spawnInterval);
gameLoop();

const playArea = document.getElementById("play-area");
const input = document.getElementById("input");
const levelDisplay = document.getElementById("level");
const livesDisplay = document.getElementById("lives");

let level = 1;
let lives = 3;
let words = ["cat", "dog", "space", "math", "star", "game"];
let activeWords = [];

// 🎯 Start slower
let spawnInterval = 4000; // new word every 4 seconds
let fallSpeed = 0.5;      // half a pixel per frame

let spawnTimer; // we'll reset this when level changes

function spawnWord() {
  let text;
  if (Math.random() < 0.5) {
    text = words[Math.floor(Math.random() * words.length)];
  } else {
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

function levelUp() {
  level++;
  levelDisplay.textContent = "Level: " + level;

  // 🚀 Speed up gradually
  fallSpeed += 0.2; 
  if (spawnInterval > 1000) spawnInterval -= 300;

  // reset spawn timer with new interval
  clearInterval(spawnTimer);
  spawnTimer = setInterval(spawnWord, spawnInterval);
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
        levelUp();
      }
    } else {
      input.value = "";
    }
  }
});

// start spawning words
spawnTimer = setInterval(spawnWord, spawnInterval);
gameLoop();

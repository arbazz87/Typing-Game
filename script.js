const easyWords = ["cat", "bug", "sun", "run", "top", "car", "dog"];
const mediumWords = ["html", "code", "async", "event", "array"];
const hardWords = ["function", "debugging", "javascript", "developer"];

const gameArea = document.getElementById("gameArea");
const input = document.getElementById("wordInput");
const scoreDisplay = document.getElementById("score");
const missedDisplay = document.getElementById("missed");
const startBtn = document.getElementById("startBtn");

let score = 0;
let missed = 0;
let fallingWords = [];
let moveInterval;
let spawnInterval;
let timerInterval;
let fallSpeed = 1.5;
let maxWords = 5;
let gameTime = 60; // seconds
let currentTime = gameTime;

function getRandomWord() {
  if (score < 5) return easyWords[Math.floor(Math.random() * easyWords.length)];
  if (score < 15) return mediumWords[Math.floor(Math.random() * mediumWords.length)];
  return hardWords[Math.floor(Math.random() * hardWords.length)];
}

function createWord() {
  if (fallingWords.length >= maxWords) return;

  const word = document.createElement("div");
  word.classList.add("word");
  word.innerText = getRandomWord();
  word.style.left = Math.random() * (gameArea.offsetWidth - 100) + "px";
  word.style.top = "0px";
  gameArea.appendChild(word);
  fallingWords.push(word);
}

function moveWords() {
  fallingWords.forEach((word, index) => {
    let top = parseInt(word.style.top);
    if (top + fallSpeed >= gameArea.offsetHeight - 30) {
      missed++;
      missedDisplay.innerText = missed;
      gameArea.removeChild(word);
      fallingWords.splice(index, 1);
    } else {
      word.style.top = top + fallSpeed + "px";
    }
  });
}

function checkWordMatch() {
  const typed = input.value.trim();
  const matchIndex = fallingWords.findIndex(w => w.innerText === typed);
  if (matchIndex !== -1) {
    score++;
    scoreDisplay.innerText = score;
    gameArea.removeChild(fallingWords[matchIndex]);
    fallingWords.splice(matchIndex, 1);
    input.value = "";

    // Speed up every 5 correct words
    if (score % 5 === 0) {
      fallSpeed += 0.5;
    }
  }
}

function updateTimer() {
  currentTime--;
  startBtn.innerText = `⏱ ${currentTime}s`;

  if (currentTime <= 0) {
    endGame();
  }
}

function startGame() {
  score = 0;
  missed = 0;
  fallSpeed = 1.5;
  currentTime = gameTime;
  scoreDisplay.innerText = score;
  missedDisplay.innerText = missed;
  input.value = "";
  input.disabled = false;
  input.focus();
  startBtn.disabled = true;
  gameArea.innerHTML = "";
  fallingWords = [];

  moveInterval = setInterval(moveWords, 50);
  spawnInterval = setInterval(createWord, 1800);
  timerInterval = setInterval(updateTimer, 1000);
  updateTimer(); // to display initial time
}

function endGame() {
  clearInterval(moveInterval);
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  input.disabled = true;
  startBtn.disabled = false;
  startBtn.innerText = "Start Game";
  alert(`⏰ Time's up! Your final score is ${score}`);
}

input.addEventListener("input", checkWordMatch);
startBtn.addEventListener("click", startGame);

document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const movesDisplay = document.getElementById("moves");
  const timerDisplay = document.getElementById("timer");
  const restartBtn = document.getElementById("restart");
  const gameOverScreen = document.getElementById("game-over");
  const finalMoves = document.getElementById("final-moves");
  const finalTime = document.getElementById("final-time");
  const playAgainBtn = document.getElementById("play-again");

  let cards = [];
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let moves = 0;
  let timer = 0;
  let timerInterval;
  let matchedPairs = 0;

  const icons = [
    "fa-heart",
    "fa-star",
    "fa-cloud",
    "fa-bolt",
    "fa-car",
    "fa-key",
    "fa-home",
    "fa-tree",
  ];

  function initGame() {
    moves = 0;
    timer = 0;
    matchedPairs = 0;
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    gameBoard.innerHTML = "";

    movesDisplay.textContent = moves;
    updateTimerDisplay();

    clearInterval(timerInterval);

    gameOverScreen.style.display = "none";

    createCards();

    startTimer();
  }

  function createCards() {
    const cardIcons = [...icons, ...icons];

    cardIcons.sort(() => Math.random() - 0.5);

    cards = cardIcons.map((icon) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
                <div class="card-face card-back"></div>
                <div class="card-face card-front">
                    <i class="fas ${icon}"></i>
                </div>
            `;

      card.addEventListener("click", flipCard);
      return card;
    });

    cards.forEach((card) => gameBoard.appendChild(card));
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains("matched")) return;

    this.classList.add("flipped");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;

    checkForMatch();
  }

  function checkForMatch() {
    const firstIcon = firstCard.querySelector("i").className;
    const secondIcon = secondCard.querySelector("i").className;

    if (firstIcon === secondIcon) {
      disableCards();
      matchedPairs++;

      if (matchedPairs === icons.length) {
        endGame();
      }
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timer++;
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timer % 60).toString().padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }

  function endGame() {
    clearInterval(timerInterval);

    gameOverScreen.style.display = "flex";
    finalMoves.textContent = moves;
    finalTime.textContent = timerDisplay.textContent;
  }

  restartBtn.addEventListener("click", initGame);
  playAgainBtn.addEventListener("click", initGame);

  initGame();
});

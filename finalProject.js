let words = [];          // JSON word list array
let chosenWord = "";     // Selected word
let chosenHint = "";     // Selected hint
let displayWord = [];    // Array for the selected word
let usedLetters = [];    // Array for used letters
let wrongGuesses = 0;    // Num of wrong guesses
let maxGuesses = 6;      // 6 allowed mistakes

// HTML elements
const hintEl = document.getElementById("hint");
const wordDisplayEl = document.getElementById("wordDisplay");
const hangmanImg = document.getElementById("hangmanImg");
const usedListEl = document.getElementById("usedList");
const resultEl = document.getElementById("result");
const playAgainBtn = document.getElementById("playAgainBtn");
const letterButtonsBox = document.getElementById("letterButtons");
const attemptsLeftEl = document.getElementById("attempts-left");

// Creating an object to track game statistics
const gameStats = {
    wins: 0,
    losses: 0,
    totalGames: 0,

    resetStats() {
        this.wins = 0;
        this.losses = 0;
        this.totalGames = 0;
    }
};

 
// Load JSON File
fetch("data/words.json")
    .then(response => response.json())
    .then(data => {
        words = data;
        startGame();
    });


// Display A-Z Letter Buttons
function createLetterButtons() {
    letterButtonsBox.innerHTML = "";

    for (let i = 65; i <= 90; i++) {
        let letter = String.fromCharCode(i); // A-Z

        let btn = document.createElement("button");
        btn.innerText = letter;
        btn.id = "btn-" + letter;

        btn.addEventListener("click", function () {
            handleLetterClick(letter.toLowerCase());
        });

        letterButtonsBox.appendChild(btn);
    }
}

// Initialize Game
function startGame() {
    const randomIndex = Math.floor(Math.random() * words.length);
    chosenWord = words[randomIndex].word.toLowerCase();
    chosenHint = words[randomIndex].hint;

    displayWord = [];
    usedLetters = [];
    wrongGuesses = 0;

    hintEl.innerText = chosenHint;
    usedListEl.innerText = "";
    resultEl.innerHTML = "";
    playAgainBtn.classList.add("hidden");

    if (attemptsLeftEl) {
        attemptsLeftEl.innerText = `Wrong guesses: ${wrongGuesses} / ${maxGuesses}`;
    }

    for (let i = 0; i < chosenWord.length; i++) {
        displayWord.push("_");
    }

    wordDisplayEl.innerText = displayWord.join(" ");
    hangmanImg.src = "images/hangman-0.jpg";

    createLetterButtons();
}


// Check Letter clicked
function handleLetterClick(letter) {

    if (usedLetters.includes(letter)) {
        return;
    }
    usedLetters.push(letter);
    usedListEl.innerText = usedLetters.join(", ");

    let correct = false;
    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === letter) {
            displayWord[i] = letter;
            correct = true;
        }
    }
    wordDisplayEl.innerText = displayWord.join(" ");

    if (!correct) {
        wrongGuesses++;
        hangmanImg.src = `images/hangman-${wrongGuesses}.jpg`;
        attemptsLeftEl.innerText = `Wrong guesses: ${wrongGuesses} / ${maxGuesses}`;
    }

    const btn = document.getElementById("btn-" + letter.toUpperCase());
    if (btn) {
        btn.disabled = true;
        btn.classList.add("used")
    }
    checkGameOver();
}

// Check Win/Lose
function checkGameOver() {

    if (displayWord.join("") === chosenWord) {
        gameStats.wins++;
        gameStats.totalGames++;

        resultEl.innerHTML = `<h2 class="fade win">CONGRATS, You Win! 🎉</h2>`;
        endGame();
    }

    if (wrongGuesses === maxGuesses) {
        gameStats.losses++;
        gameStats.totalGames++;

        resultEl.innerHTML = `<h2 class="fade lose">You Lost! The word was: ${chosenWord}</h2>`;
        endGame();
    }
}


// End Game
function endGame() {
    // Disable all buttons
    const allButtons = letterButtonsBox.querySelectorAll("button");
    allButtons.forEach(btn => {
    btn.disabled = true;
    btn.classList.add("used");
});

playAgainBtn.classList.remove("hidden");
    // Simple animation
    resultEl.style.opacity = 0;
    setTimeout(() => {
        resultEl.style.transition = "opacity 1.2s";
        resultEl.style.opacity = 1;
    }, 100);

    document.getElementById("stats").innerText =
    `Wins: ${gameStats.wins} | Losses: ${gameStats.losses} | Games Played: ${gameStats.totalGames}`;
}

// Play Again Button
playAgainBtn.addEventListener("click", function() {
    startGame();
});
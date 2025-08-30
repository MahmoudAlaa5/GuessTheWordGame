let gameName = "Guess The Word";
document.title = gameName;

document.querySelector('h1').innerHTML = gameName;
document.querySelector('footer').innerHTML = `${gameName} Game is Created By Mahmoud Alaa ❤️`;

// Setting Game Options

let numberOfTries = 5;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;
let hintsUsed = 0;

// manage words
let wordToGuess = "";
let words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero","School"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

// message

let message = document.querySelector(`.message`);

function generateInput() {
    // Create Mian Try Div
    const inputsContainer = document.querySelector(`.inputs`);
    for (let i = 1; i <= numberOfTries ;i++) {
        const tryDiv = document.createElement(`div`);
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        tryDiv.classList.add('style');

        if (i != 1) tryDiv.classList.add('disabled-inputs');
        // Create Inputs
        for (let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement(`input`);
            input.type = 'text';
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", '1');
            tryDiv.appendChild(input);
        }

        inputsContainer.appendChild(tryDiv);
    }

    inputsContainer.children[0].children[1].focus();

    // Disable All Inputs Except The First One
    const inputsInDisabledDiv = document.querySelectorAll(`.disabled-inputs input`);
    inputsInDisabledDiv.forEach((input) => input.disabled = true);

    const inputs = document.querySelectorAll(`input`);
    // convert to UpperCase
    inputs.forEach((input, index) => {
        input.addEventListener('input', function () {
            this.value = this.value.toUpperCase();
            
            // next letter focusing by index 
            const nextLetter = inputs[index + 1];
            if (nextLetter && this.value !== '') {
                nextLetter.focus();
            }
        })

        input.addEventListener('keydown', function(e) {
            // console.log(e);
            const currentIndex = Array.from(inputs).indexOf(e.target);
            
            if (e.key === "Backspace" && this.value === '') {
                
                if (currentIndex > 0) {
                    inputs[currentIndex - 1].focus();
                }
            }
            
            if (e.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            else if (e.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0) inputs[prevInput].focus();
            }
        })

    })
}


// handle the game logic

const guessButton = document.querySelector(`.check`);
guessButton.addEventListener('click', handleguesses);

// hint button logic
const hintButton = document.querySelector(`.hint`);
hintButton.addEventListener('click', handleHints);

console.log(wordToGuess);

function handleguesses(e) {
    e.preventDefault();
    
    // Clear previous message
    message.classList.remove('show', 'success', 'error');
    
    // Check if all letters are filled
    let allLettersFilled = true;
    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        if (inputField.value === '') {
            allLettersFilled = false;
            break;
        }
    }
    
    if (!allLettersFilled) {
        message.innerHTML = `Please fill all ${numberOfLetters} letters first!`;
        message.classList.add('show', 'error');
        return;
    }
    
    let successGuess = true;
    for (let i = 1; i <= numberOfLetters;i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        
        
        // Only color letters that have been entered
        if (letter !== '') {
            // Game Logic
            if (letter === actualLetter) {
                inputField.classList.add('in-place');
            }
            else if (wordToGuess.includes(letter)) {
                inputField.classList.add('not-in-place');
                successGuess = false;
            }
            else {
                inputField.classList.add('no');
                successGuess = false;
            }
        }
    }


    // check if user win or lose
    if (successGuess) {
        message.innerHTML = `You Win The Word Is <span class="guess-word">${wordToGuess}</span>`;
        message.classList.add(`show`, `success`);
        // add disabled class to the try after winning
        let allTries = document.querySelectorAll(`.inputs > div`);
        allTries.forEach((tryDiv) => tryDiv.classList.add(`disabled-inputs`));
        guessButton.classList.add(`disabled-button`);
    } else {
        // Move to next try if not the last try
        if (currentTry < numberOfTries) {
            // Disable current try inputs
            const currentTryDiv = document.querySelector(`.try-${currentTry}`);
            currentTryDiv.classList.add('disabled-inputs');
            
            // Enable next try inputs
            const nextTryDiv = document.querySelector(`.try-${currentTry + 1}`);
            if (nextTryDiv) {
                nextTryDiv.classList.remove('disabled-inputs');
                const nextTryInputs = nextTryDiv.querySelectorAll('input');
                nextTryInputs.forEach(input => input.disabled = false);
                // Focus on first input of next try
                nextTryInputs[0].focus();
            }
            
            currentTry++;
            hintsUsed = 0; // Reset hints for new try
            message.innerHTML = `OOPS! Try Again (Try ${currentTry}/${numberOfTries})`;
        } else {
            // This was the last try, game over
            message.innerHTML = `Game Over! The word was <span class="guess-word">${wordToGuess}</span>`;
            guessButton.classList.add(`disabled-button`);
            
            // Disable all inputs in the last try
            const lastTryDiv = document.querySelector(`.try-${currentTry}`);
            if (lastTryDiv) {
                lastTryDiv.classList.add('disabled-inputs');
                const lastTryInputs = lastTryDiv.querySelectorAll('input');
                lastTryInputs.forEach(input => input.disabled = true);
            }
        }
        message.classList.add('show', 'error');
    }

    
}



// Add reset game functionality
function resetGame() {
    // Clear all inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('in-place', 'not-in-place', 'no');
    });
    
    // Reset game state
    currentTry = 1;
    hintsUsed = 0; // Reset hints counter
    wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
    
    // Reset all tries to initial state
    const allTries = document.querySelectorAll('.inputs > div');
    allTries.forEach((tryDiv, index) => {
        tryDiv.classList.remove('disabled-inputs');
        const tryInputs = tryDiv.querySelectorAll('input');
        tryInputs.forEach(input => {
            input.disabled = index !== 0; // Only first try enabled
        });
    });
    
    // Reset button state
    guessButton.classList.remove('disabled-button');
    
    // Clear message
    message.classList.remove('show', 'success', 'error');
    
    // Focus on first input
    document.querySelector('#guess-1-letter-1').focus();
}

// Add reset button event listener
document.addEventListener('DOMContentLoaded', function() {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'New Game';
    resetButton.classList.add('hint', 'reset-button'); // Reuse hint button styling and add reset class
    resetButton.style.marginLeft = '10px';
    resetButton.addEventListener('click', resetGame);
    
    // Add reset button to control buttons
    const controlBtns = document.querySelector('.control-btns');
    controlBtns.appendChild(resetButton);
    
    // Add hint button event listener
    const hintButton = document.querySelector('.hint');
    hintButton.addEventListener('click', handleHints);
});



function handleHints(e) {
    e.preventDefault();
    
    // Check if hints are available for this try
    if (hintsUsed >= numberOfHints) {
        message.innerHTML = `No more hints available for this try!`;
        message.classList.add('show', 'error');
        setTimeout(() => {
            message.classList.remove('show', 'error');
        }, 2000);
        return;
    }
    
    // Find a random position that's empty and reveal the correct letter there
    let emptyPositions = [];
    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        if (inputField.value === '') {
            emptyPositions.push(i);
        }
    }

    // if all letters are filled
    if (emptyPositions.length === 0) {
        message.innerHTML = `All letters are already filled!`;
        message.classList.add('show', 'error');
        setTimeout(() => {
            message.classList.remove('show', 'error');
        }, 2000);
        return;
    }
    
    // Pick a random empty position
    const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    const inputField = document.querySelector(`#guess-${currentTry}-letter-${randomPosition}`);
    const actualLetter = wordToGuess[randomPosition - 1];
    
    // Reveal the correct letter in its true position
    inputField.value = actualLetter.toUpperCase();
    hintsUsed++;
    
    // Focus on the next empty input
    const nextEmptyInput = findNextEmptyInput(randomPosition);
    if (nextEmptyInput) {
        nextEmptyInput.focus();
    }
    
    // Show hint message
    message.innerHTML = `Hint used! Letter "${actualLetter.toUpperCase()}" revealed in position ${randomPosition}. (${hintsUsed}/${numberOfHints} hints used)`;
    message.classList.add('show', 'info');
    setTimeout(() => {
        message.classList.remove('show', 'info');
    }, 3000);
}

// Helper function to find the next empty input
function findNextEmptyInput(currentPosition) {
    for (let i = currentPosition + 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        if (inputField.value === '') {
            return inputField;
        }
    }
    // If no empty input after current position, look from the beginning
    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        if (inputField.value === '') {
            return inputField;
        }
    }
    return null;
}


window.onload = function () {
    generateInput();
}


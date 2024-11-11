const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const gameBoard = document.getElementById('gameBoard');
const gameModeSelection = document.getElementById('gameModeSelection');
const roleSelection = document.getElementById('roleSelection');
const onePlayerButton = document.getElementById('onePlayerButton');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const choosePlayer1Button = document.getElementById('choosePlayer1');
const choosePlayer2Button = document.getElementById('choosePlayer2');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let userPlayer = 'X'; // Default to Player 1 (X)
let computerPlayer = 'O'; // Default to Player 2 (O)
let isSinglePlayer = true; // Track if the game is single-player or two-player mode

// Winning combinations
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Check for winner
function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes('') ? null : 'Tie';
}

// Display the winner or tie
function showMessage(result) {
    if (result === 'Tie') {
        message.textContent = "It's a Tie!";
    } else {
        if (userPlayer === 'X') {
            // User is Player 1
            if (result === 'X') {
                message.textContent = "Congratulation! Player 1 Wins";
            } else {
                message.textContent = isSinglePlayer ? "Congratulation! Player 2 Wins" : "Congratulation! Player 2 Wins (Opponent)";
            }
        } else {
            // User is Player 2
            if (result === 'O') {
                message.textContent = "Player 2 Wins!";
            } else {
                message.textContent = isSinglePlayer ? "Congratulation! Player 1 Wins" : "Congratulation! Player 1 Wins (Opponent)";
            }
        }
    }
    isGameActive = false;
}

// Handle player's move
function handleMove(cell, index) {
    if (isGameActive && !board[index]) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        const winner = checkWinner();
        if (winner) {
            showMessage(winner);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            // If it's computer's turn in single player mode
            if (isSinglePlayer && currentPlayer === computerPlayer) {
                setTimeout(computerMove, 500);  // Delay computer's move for a smoother experience
            }
        }
    }
}

// Computer's move (random move)
function computerMove() {
    let availableCells = board
        .map((val, index) => (val === '' ? index : null))
        .filter(val => val !== null);

    if (availableCells.length > 0) {
        let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        const cell = document.getElementById(randomIndex);
        board[randomIndex] = computerPlayer;
        cell.textContent = computerPlayer;
        cell.classList.add(computerPlayer.toLowerCase());

        const winner = checkWinner();
        if (winner) {
            showMessage(winner);
        } else {
            currentPlayer = userPlayer; // Switch back to user after computer's turn
        }
    }
}

// Reset game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    currentPlayer = 'X';
    isGameActive = true;
    message.textContent = '';

    // Show game mode selection again
    gameBoard.style.display = 'none';
    resetButton.style.display = 'none';
    gameModeSelection.style.display = 'block';
    roleSelection.style.display = 'none';
}

// Event listeners for cells and reset button
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleMove(cell, index));
});

resetButton.addEventListener('click', resetGame);

// Game mode selection events
onePlayerButton.addEventListener('click', () => {
    isSinglePlayer = true;
    gameModeSelection.style.display = 'none';
    roleSelection.style.display = 'block';
});

twoPlayerButton.addEventListener('click', () => {
    isSinglePlayer = false;
    gameModeSelection.style.display = 'none';
    roleSelection.style.display = 'block';
});

// Role selection events
choosePlayer1Button.addEventListener('click', () => {
    userPlayer = 'X'; // User chooses Player 1
    computerPlayer = 'O'; // Computer is Player 2 (for single-player mode)
    startGame();
});

choosePlayer2Button.addEventListener('click', () => {
    userPlayer = 'O'; // User chooses Player 2
    computerPlayer = 'X'; // Computer is Player 1 (for single-player mode)
    startGame();

    if (isSinglePlayer) {
        setTimeout(computerMove, 500); // Computer starts if user is Player 2
    }
});

// Start game and hide selection screen
function startGame() {
    roleSelection.style.display = 'none';
    gameBoard.style.display = 'grid';
    resetButton.style.display = 'block';
}

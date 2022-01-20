const playerMethods = (state) => ({
    setName: (newName) => {
        return state.name = newName
    },
    setMark: (newMark) => {
        return state.mark = newMark
    },
    setCurrentPlayer: (boolean) => {
        return state.currentPlayer = boolean
    },
    setWinner: (boolean) => {
        return state.winner = boolean
    },
    getName: () => {
        return state.name
    },
    getMark: () => {
        return state.mark
    },
    isCurrentPlayer: () => {
        return state.currentPlayer
    },
    toggleTurn: () => {
        return state.turn = (!state.turn)
    },
    isWinner: () => {
        return state.winner
    }
});

const Player = (name,mark) => {
    state = {
        name,
        mark,
        currentPlayer: null,
        winner: null,
    }

    return Object.assign({}, playerMethods(state))
}

let origBoard;
let playerOne = Player('Player 1','X');
let playerTwo = Player('Player 2','O');
let gameSquare = Array.from(document.getElementsByClassName('game-square'));
let gameText = document.getElementById('footer');

let winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGame();

function startGame() {
    origBoard = Array.from(Array(9).keys());
    gameText.textContent = 'Game start';
    for (let i = 0; i < gameSquare.length; i++) {
        gameSquare[i].textContent = '';
        gameSquare[i].addEventListener('click', endTurn);
    };
};

function endTurn(e) {
    if (origBoard[e.target.id] !== playerOne.getMark() && origBoard[e.target.id] !== playerTwo.getMark()) {
        turn(e.target.id, playerOne);
        if (!checkDraw()) {turn(bestSpot(), playerTwo)};
    };
};

function turn(gameSquareId, player) {
    origBoard[gameSquareId] = player.getMark();
    document.getElementById(gameSquareId).textContent = player.getMark();
    let gameWon = checkWinner(origBoard, player);
    if (gameWon) {gameOver(gameWon)};
};

function checkWinner(board, player) {
    let plays = board.reduce((a, e, i) => (e === player.getMark()) ? a.concat(i) : a, []);
    let gameWon = null;
    winConditions.forEach(checkWinLogic);

    function checkWinLogic(winCon) {
        let squareOne = board[winCon[0]];
        let squareTwo = board[winCon[1]];
        let squareThree = board[winCon[2]];
        let markOne = playerOne.getMark();
        let markTwo = playerTwo.getMark();

        let playerOneWin = squareOne === markOne && squareTwo === markOne && squareThree === markOne;
        let playerTwoWin = squareOne === markTwo && squareTwo === markTwo && squareThree === markTwo;

        if (playerOneWin) {
            let index = winConditions.indexOf(winCon)
            gameWon = {index, player: playerOne};
        } else if (playerTwoWin) {
            let index = winConditions.indexOf(winCon)
            gameWon = {index, player: playerTwo};
        }
    }

    return gameWon
}

function gameOver(gameWon) {
    let winSquares =  winConditions[gameWon.index]
    for (let i = 0; i < winSquares.length; i++) {
        document.getElementById(winSquares[i]).classList.add('board-highlight');
    }
    for (let i = 0; i < gameSquare.length; i++) {
        gameSquare[i].removeEventListener('click',endTurn);
    }
    declareWinner(gameWon.player.getName())
}

function bestSpot() {
    return findEmptySquares()[0]
}

// player mark must not
function findEmptySquares() {
  return  origBoard.filter(square => square !== playerOne.getMark() && square !== playerTwo.getMark())
}

function checkDraw() {
    if (findEmptySquares().length == 0) {
        for (let i = 0; i < gameSquare.length; i++) {
            gameSquare[i].removeEventListener('click',endTurn);
            gameSquare[i].classList.add('board-highlight');
        }  
        declareWinner('This_game_is_a_draw.123');
        return true;
    }
    return false;
}
    
function declareWinner(player) {
    if (player == 'This_game_is_a_draw.123') {
        gameText.textContent = 'Draw';
    } else {
        gameText.textContent = `${player} has won the game!`;
    };
}   












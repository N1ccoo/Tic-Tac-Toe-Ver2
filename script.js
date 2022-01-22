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
        // if (!checkDraw()) {turn(bestSpot(), playerTwo)};
        if (!checkWinner(origBoard, playerOne) && !checkDraw()) turn(bestSpot(), playerTwo);
    };
};

function turn(gameSquareId, player) {
    origBoard[gameSquareId] = player.getMark();
    document.getElementById(gameSquareId).textContent = player.getMark();
    let gameWon = checkWinner(origBoard, player);
    if (gameWon) {gameOver(gameWon)};
};

function checkWinner(board, player) {
    // refactor this code

    let plays = board.reduce((a, e, i) =>
		(e === player.getMark()) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winConditions.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
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
    return minimax(origBoard, playerTwo).index;

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

function minimax(newBoard, player) {
    let emptySquares = findEmptySquares();

    if (checkWinner(newBoard, playerOne)) {
        return {score: -10};
    } else if (checkWinner(newBoard, playerTwo)) {
        return {score: 10};
    } else if (emptySquares.length === 0) {
        return {score: 0};
    }

    let moves = [];
    for (let i = 0; i < emptySquares.length; i++) {
        let move = {};
        move.index = newBoard[emptySquares[i]];
        newBoard[emptySquares[i]] = player.getMark();
   
        if (player == playerTwo) {
            let result = minimax(newBoard, playerOne);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, playerTwo);
            move.score = result.score;
        }

        newBoard[emptySquares[i]] = move.index;

        moves.push(move);
    }

    let bestMove;

    if (player === playerTwo) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
				bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];

}











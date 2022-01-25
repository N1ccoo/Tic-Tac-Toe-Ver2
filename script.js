const gameSettings = (() => {

    let settingsBtn = document.getElementById('settings-button');
    let formArea = document.getElementById('popup-form');
    let settingsFormInput = document.getElementById('settings-form');
    let playerOneNameInput = document.getElementById('player-one-name');
    let playerTwoNameInput = document.getElementById('player-two-name');
    let playerOneMarkInput = document.getElementById('player-one-mark');
    let playerTwoMarkInput = document.getElementById('player-two-mark');
    let playerTurnInput = document.getElementById('player-turn-button');

    settingsFormInput.addEventListener('submit',serPlayerInfo);



    settingsBtn.addEventListener('click', openForm);

    function closeForm(e) {
        let path = e.composedPath();

        const withinBoundaries = path.includes(settingsBtn) || path.includes(formArea)

        if (!(withinBoundaries)) {
            formArea.classList.add('close')
            formArea.classList.remove('open')
        };
    };

    function openForm() {
        formArea.classList.remove('close');
        formArea.classList.add('open');
        document.addEventListener('click', closeForm);
    };

    function serPlayerInfo(e) {
        e.preventDefault();
        playerOne.setName(playerOneNameInput.value);
        playerOne.setMark(playerOneMarkInput.value);
        playerTwo.setName(playerTwoNameInput.value);
        playerTwo.setMark(playerTwoMarkInput.value);
        setPlayerTurns(playerTurnInput.value);
        playerOneNameInput.value = '';
        playerTwoNameInput.value = '';
        playerOneMarkInput.value = '';
        playerTwoMarkInput.value = '';
    };

    function setPlayerTurns(choice) {
        if (choice === 'playerOneFirst') {
            playerOne.setTurn(true);
            playerTwo.setTurn(false);
            return 'player one first'
        } else if (choice === 'playerTwoFirst') {
            playerOne.setTurn(false);
            playerTwo.setTurn(true);
            return 'player two first'
        };
    };

    function swapFirstTurn() {
        if (playerTurnInput.value === 'playerOneFirst') {
            playerTurnInput.setAttribute('value', 'playerTwoFirst')
            playerTurnInput.textContent = 'Player 2 First'
        } else if (playerTurnInput.value === 'playerTwoFirst') {
            playerTurnInput.setAttribute('value', 'playerOneFirst')
            playerTurnInput.textContent = 'Player 1 First'
        }

    }

})();

const playerMethods = (state) => ({
    setName: (newName) => {
        return state.name = newName
    },
    setMark: (newMark) => {
        return state.mark = newMark
    },
    setTurn: (turn) => {
        return state.firstTurn = turn
    },
    getName: () => {
        return state.name
    },
    getMark: () => {
        return state.mark
    },
    isFirst: () => {
        return state.firstTurn
    }
});

const Player = (name,mark,firstTurn) => {
    state = {
        name,
        mark,
        firstTurn,
    };

    return Object.assign({}, playerMethods(state));
};

let origBoard;
let playerOne = Player('Player 1', 'X', true);
let playerTwo = Player('Player 2', 'O', false);
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

let computerGameButton = document.getElementById('computer-mode');
computerGameButton.addEventListener('click',startComputerGame)

function startComputerGame() {
    origBoard = Array.from(Array(9).keys());
    gameText.textContent = 'Computer Game'; 
    resetGame() 
    if(playerTwo.isFirst()) {turn(0, playerTwo)};
};

function endTurn(e) {
    if (origBoard[e.target.id] !== playerOne.getMark() && origBoard[e.target.id] !== playerTwo.getMark()) {
        turn(e.target.id, playerOne);
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
    
    let plays = board.reduce(getPlayedSpots, []);
	let gameWon = null;

    for (let i = 0; i < winConditions.length; i++) {
      if (winConditions[i].every(elem => plays.indexOf(elem) > -1)) {
          gameWon = {index: i, player};
      };
    };

	return gameWon;

    function getPlayedSpots(accumulator, currentValue, index) {
        if (currentValue === player.getMark()) {
            accumulator.push(index);
        }
        return accumulator;
    };
};

function bestSpot() {
    gameSquare[minimax(origBoard, playerTwo).index].classList.add('board-highlight');
    return minimax(origBoard, playerTwo).index;
};

function findEmptySquares() {
  return  origBoard.filter(square => square !== playerOne.getMark() && square !== playerTwo.getMark())
};

function checkDraw() {
    if (findEmptySquares().length == 0) {
        for (let i = 0; i < gameSquare.length; i++) {
            gameSquare[i].removeEventListener('click',endTurn);
            gameSquare[i].classList.add('board-highlight-draw');
        }  
        declareWinner('This_game_is_a_draw.123');
        return true;
    }
    return false;
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
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
				bestMove = i;
            }
        }
    } else {
        let bestScore = +Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
};

// END GAME

function declareWinner(player) {
    if (player == 'This_game_is_a_draw.123') {
        gameText.textContent = 'Draw';
    } else {
        gameText.textContent = `${player} has won the game!`;
    };
};  

function gameOver(gameWon) {
    let winSquares =  winConditions[gameWon.index]
    for (let i = 0; i < winSquares.length; i++) {
        document.getElementById(winSquares[i]).classList.add('board-highlight-win');
    }
    for (let i = 0; i < gameSquare.length; i++) {
        gameSquare[i].removeEventListener('click',endTurn);
    }
    declareWinner(gameWon.player.getName());
}

function resetGame() {
    for (let i = 0; i < gameSquare.length; i++) {
        gameSquare[i].textContent = '';
        gameSquare[i].addEventListener('click', endTurn);
        gameSquare[i].classList.remove('board-highlight');
        gameSquare[i].classList.remove('board-highlight-win');
        gameSquare[i].classList.remove('board-highlight-draw');
    };
}



const gameStyle = (() => {

    let gameSquare = Array.from(document.getElementsByClassName('game-square'));
    let navButtons = Array.from(document.getElementsByClassName('nav-button'));

    navButtons.forEach(item => {
        item.addEventListener('mouseenter',navButtonHover);
        item.addEventListener('mouseleave',removeNavButtonHover);
    });

    gameSquare.forEach(item => {
        item.addEventListener('mouseenter',gameSquareHover);
        item.addEventListener('mouseleave',removegameSquareHover);
        item.addEventListener('click', gameSquareClick);
    });

    function gameSquareHover(e) {
        e.target.classList.add('board-hover');
    };

    function removegameSquareHover(e) {
        e.target.classList.remove('board-hover');
    };
 
    function gameSquareClick(e) {
        e.target.classList.add('board-highlight');
    };

    function navButtonHover(e) {
        e.target.classList.add('button-hover');
    };

    function removeNavButtonHover(e) {
        e.target.classList.remove('button-hover');
    };

})()









;
(() => {

    const gameSettings = (() => {

        let settingsBtn = document.getElementById('settings-button');
        let formArea = document.getElementById('popup-form');
        let settingsFormInput = document.getElementById('settings-form');
        let playerOneNameInput = document.getElementById('player-one-name');
        let playerTwoNameInput = document.getElementById('player-two-name');
        let playerOneMarkInput = document.getElementById('player-one-mark');
        let playerTwoMarkInput = document.getElementById('player-two-mark');
        let playerTurnInput = document.getElementById('player-turn-button');

        settingsFormInput.addEventListener('submit', setPlayerInfo);
        playerTurnInput.addEventListener('click', swapFirstTurn);
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

        function uniqueInput() {
            if (playerOne.getMark() === playerTwo.getMark()) {
                playerOne.setMark('X');
                playerTwo.setMark('O');
            }
            if (playerOne.getName() === playerTwo.getName()) {
                playerTwo.setName(playerTwo.getName() + '2');
            };
        }

        function setPlayerInfo(e) {
            e.preventDefault();
            playerOne.setName(playerOneNameInput.value);
            playerOne.setMark(playerOneMarkInput.value);
            playerTwo.setName(playerTwoNameInput.value);
            playerTwo.setMark(playerTwoMarkInput.value);
            setPlayerFirstTurn(playerTurnInput.value);
            playerOneNameInput.value = '';
            playerTwoNameInput.value = '';
            playerOneMarkInput.value = '';
            playerTwoMarkInput.value = '';
            uniqueInput();
        };

        function setPlayerFirstTurn(choice) {
            if (choice === 'playerOneFirst') {
                playerOne.setFirstTurn(true);
                playerTwo.setFirstTurn(false);
                return 'player one first'
            } else if (choice === 'playerTwoFirst') {
                playerOne.setFirstTurn(false);
                playerTwo.setFirstTurn(true);
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

        return Object.assign({}, {
            setPlayerFirstTurn,
            playerTurnInput,
            settingsFormInput
        }, )
    })();

    const playerMethods = (state) => ({
        setName: (newName) => {
            return state.name = newName
        },
        setMark: (newMark) => {
            return state.mark = newMark
        },
        setFirstTurn: (turn) => {
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
        },
        setTurn: (boolean) => {
            return state.turn = boolean
        },
        getTurn: () => {
            return state.turn
        }
    });

    const Player = (name, mark, firstTurn) => {
        state = {
            name,
            mark,
            firstTurn,
            turn: null,
        };

        return Object.assign({}, playerMethods(state));
    };


    
    let gameType;
    let origBoard;
    let playerOne = Player('Player 1', 'X', true);
    let playerTwo = Player('Player 2', 'O', false);
    let gameSquare = Array.from(document.getElementsByClassName('game-square'));
    let gameText = document.getElementById('footer');
    gameSettings.settingsFormInput.addEventListener('submit', resetAll);
    gameSettings.playerTurnInput.addEventListener('click',resetAll);
    
    function resetAll() {
        if (gameType === 'Computer') {
           Game.startComputerGame();
        } else if (gameType === 'Two Player') {
            Game.startTwoPlayerGame();
        };
    };

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

    const Game = (() => {

        let twoPlayerGameButton = document.getElementById('two-player-mode');
        let computerGameButton = document.getElementById('computer-mode');
        computerGameButton.addEventListener('click', startComputerGame);
        twoPlayerGameButton.addEventListener('click', startTwoPlayerGame);

        //Computer Game

        function startComputerGame() {
            origBoard = Array.from(Array(9).keys());
            gameText.textContent = 'Computer Game';
            gameType = 'Computer';
            resetGame();
            addEndTurn();
            if (playerTwo.isFirst() && gameType === 'Computer') {
                turn(0, playerTwo);
                gameSquare[0].classList.add('board-highlight');
            };
        };

        function endTurn(e) {
            if (origBoard[e.target.id] !== playerOne.getMark() && origBoard[e.target.id] !== playerTwo.getMark()) {
                if (gameType === 'Computer') {
                     turn(e.target.id, playerOne);
                    if (!checkWinner(origBoard, playerOne) && !checkDraw()) turn(bestSpot(), playerTwo);
                } else if (gameType === 'Two Player') {
                    if (playerOne.getTurn()) {
                        turn(e.target.id, playerOne);
                        playerSetTurn(playerTwo);
                    } else if (playerTwo.getTurn()) {
                        turn(e.target.id, playerTwo);
                        playerSetTurn(playerOne);
                    };
                };
            };
        };

        function turn(gameSquareId, player) {
            origBoard[gameSquareId] = player.getMark();
            document.getElementById(gameSquareId).textContent = player.getMark();
            
    
            let gameWon = checkWinner(origBoard, player);
            if (gameWon) {
                gameOver(gameWon)
            };

            if (gameWon == null) {
                checkDraw();
            }
            
        };

        function checkWinner(board, player) {

            let plays = board.reduce(getPlayedSpots, []);
            let gameWon = null;

            for (let i = 0; i < winConditions.length; i++) {
                if (winConditions[i].every(elem => plays.indexOf(elem) > -1)) {
                    gameWon = {
                        index: i,
                        player
                    };
                };
            };

            return gameWon;

            function getPlayedSpots(accumulator, currentValue, index) {
                if (currentValue === player.getMark()) {
                    accumulator.push(index);
                };
                return accumulator;
            };
        };

        function bestSpot() {
            gameSquare[minimax(origBoard, playerTwo).index].classList.add('board-highlight');
            return minimax(origBoard, playerTwo).index;
        };

        function findEmptySquares() {
            return origBoard.filter(square => square !== playerOne.getMark() && square !== playerTwo.getMark())
        };

        function checkDraw() {
            if (findEmptySquares().length == 0) {
                for (let i = 0; i < gameSquare.length; i++) {
                    gameSquare[i].removeEventListener('click', endTurn);
                    gameSquare[i].classList.add('board-highlight-draw');
                }
                declareWinner('This_game_is_a_draw.123');
                return true
            };
            return false
        }

        function minimax(newBoard, player) {
            let emptySquares = findEmptySquares();

            if (checkWinner(newBoard, playerOne)) {
                return {
                    score: -10
                };
            } else if (checkWinner(newBoard, playerTwo)) {
                return {
                    score: 10
                };
            } else if (emptySquares.length === 0) {
                return {
                    score: 0
                };
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
                    if (moves[i].score > bestScore) {
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

        // END GAME (computer)

        function declareWinner(player) {
            turnCount = 9 - findEmptySquares().length; 


            if (player == 'This_game_is_a_draw.123') {
                gameText.textContent = 'Draw';
            } else {
                gameText.textContent = `${player} has won the game in ${turnCount} turns!`;
            };
        };

        function gameOver(gameWon) {
            let winSquares = winConditions[gameWon.index]
            for (let i = 0; i < winSquares.length; i++) {
                document.getElementById(winSquares[i]).classList.add('board-highlight-win');
            }
            for (let i = 0; i < gameSquare.length; i++) {
                gameSquare[i].removeEventListener('click', endTurn);
            }
            declareWinner(gameWon.player.getName());
        }

        function resetGame() {
            gameSettings.setPlayerFirstTurn(gameSettings.playerTurnInput.value);
            for (let i = 0; i < gameSquare.length; i++) {
                gameSquare[i].textContent = '';
                gameSquare[i].removeEventListener('click', endTurn);
                gameSquare[i].classList.remove('board-highlight');
                gameSquare[i].classList.remove('board-highlight-win');
                gameSquare[i].classList.remove('board-highlight-draw');
            };
        }

        function addEndTurn() {
            for (let i = 0; i < gameSquare.length; i++) {
                gameSquare[i].addEventListener('click',endTurn);
            }
        }


        //Two player Game

        function startTwoPlayerGame() {
            origBoard = Array.from(Array(9).keys());
            resetGame();
            addEndTurn();
            gameType = 'Two Player';
            gameText.textContent = '2 Player Game';
            
            if (playerOne.isFirst()) {
                playerSetTurn(playerOne);
            } else if (playerTwo.isFirst()) {
                playerSetTurn(playerTwo);
            };            
        };

        function playerSetTurn(player) {
            if(player == playerOne) {
                playerOne.setTurn(true);
                playerTwo.setTurn(false);
            } else if (player == playerTwo) {
                playerOne.setTurn(false);
                playerTwo.setTurn(true);
            };
        };
            
        
        return Object.assign({},{startComputerGame}, {startTwoPlayerGame})

    })();

    const gameStyle = (() => {

        let gameSquare = Array.from(document.getElementsByClassName('game-square'));
        let navButtons = Array.from(document.getElementsByClassName('nav-button'));

        navButtons.forEach(item => {
            item.addEventListener('mouseenter', navButtonHover);
            item.addEventListener('mouseleave', removeNavButtonHover);
        });

        gameSquare.forEach(item => {
            item.addEventListener('mouseenter', gameSquareHover);
            item.addEventListener('mouseleave', removegameSquareHover);
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

    })();

})();
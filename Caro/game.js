let gameCaro, number, win;

const startGame = document.querySelector('.start-game')

//Start the game
startGame.addEventListener('click', () => {
    clear(); //Clear the maxtrix to play the game
    number = +document.querySelector('.row-col').value; //Number of row-col
    win = +document.querySelector('.win').value; //Number of victory
    if (number > 0 && win > 0) gameCaro = new Caro(number, win);
    else alert('Number > 0')
})

class Caro {
    constructor(number, win) {
        this.isPlay = true;
        this.number = number;
        this.win = win;
        this.board = renderChessBoard(this.number); //Matrix
        this.player = 'X';
        this.numTurn = 0; //Number of turn
        this.squares = document.querySelectorAll('td');
        this.squares.forEach(square => square.addEventListener('click', () => this.updateChessBoard(square)));
    }

    updateChessBoard(square) {
        if (this.isPlay === false || square.textContent !== '') return; //The game is finish || Can not click on square which has clicked already

        let pos = square.dataset.pos.split('-'); // Get row and col
        this.board[pos[0]][pos[1]] = this.player; //Update board
        square.textContent = this.player; //Update grid interface
        this.numTurn++;
        this.player = this.player === 'X' ? 'O' : 'X';  //Update the player

        let isWin = this.checkWin(pos);

        if (isWin !== '') { //Has a winner
            document.querySelector('p').innerHTML = isWin + ' wins!';
            this.isPlay = false;
        } else if (this.numTurn === this.number * this.number) { //Check tie if fill all the squares but no one wins
            document.querySelector('p').innerHTML = 'Tie!';
            this.isPlay = false;
        }
        if (this.isPlay == false) {
            //Add a button to play again
            let btnResetGame = document.createElement('button');
            btnResetGame.textContent = 'Reset'
            btnResetGame.classList.add('reset-game')
            document.body.appendChild(btnResetGame)
            btnResetGame.addEventListener('click', () => {
                clear();
                gameCaro = new Caro(this.number, this.win);
            })
        }
    }

    checkWin(pos) {
        let x = Number(pos[0]); //which row 
        let y = Number(pos[1]); //which col 
        let player = this.board[x][y];

        //Check victory in row
        let count = 1;
        let i = y - 1;
        let j = y + 1;

        while (true) {
            if (this.board[x][i] === player) {
                count++; i--;
            } else if (this.board[x][j] === player) {
                count++; j++;
            } else {
                if (count >= this.win) return player;
                break;
            }
        }

        //Check victory in col
        count = 1;
        i = x - 1;
        j = x + 1;

        while (true) {
            if (this.board[i] && this.board[i][y] === player) {
                count++; i--;
            } else if (this.board[j] && this.board[j][y] === player) {
                count++; j++;
            } else {
                if (count >= this.win) return player;
                break;
            }
        }

        //Check victory in line {\}
        count = 1;
        i = x - 1;
        j = y - 1;
        let m = x + 1;
        let n = y + 1;

        while (true) {
            if (this.board[i] && this.board[i][j] === player) {
                count++; i--; j--;
            } else if (this.board[m] && this.board[m][n] === player) {
                count++; m++; n++;
            } else {
                if (count >= this.win) return player;
                break;
            }
        }

        //Check victory in line {/}
        count = 1;
        i = x - 1;
        j = y + 1;
        m = x + 1;
        n = y - 1;

        while (true) {
            if (this.board[i] && this.board[i][j] === player) {
                count++; i--; j++;
            } else if (this.board[m] && this.board[m][n] === player) {
                count++; m++; n--;
            } else {
                if (count >= this.win) return player;
                break;
            }
        }
        return '';
    }
}

//Render chess board && return a matrix
function renderChessBoard(number) { // number of row-col
    let table = document.createElement('table');
    let row, xhtml;
    let board = [], k;

    for (let i = 0; i < number; i++) {
        row = document.createElement('tr');
        k = [];
        xhtml = '';
        for (let j = 0; j < number; j++) {
            xhtml += `<td data-pos='${i + '-' + j}'></td>`;
            k.push('');
        }
        row.innerHTML = xhtml;
        table.appendChild(row);
        board.push(k);
    }
    document.body.appendChild(table);
    document.body.appendChild(document.createElement('p')) //Element to display the result of game
    return board;
}

//Clear interface when start the game again
function clear() {
    let table = document.querySelector('table'); //Grid caro
    let p = document.querySelector('p'); //Display result
    let resetGameBtn = document.querySelector('.reset-game'); //Restart game

    table && document.body.removeChild(table);
    p && document.body.removeChild(p);
    resetGameBtn && document.body.removeChild(resetGameBtn);
}
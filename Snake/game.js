const WIDTH = 400; //Each square is 20
const HEIGHT = 400;
const BACKGROUND_COLOR = '#cdc9c9';
const CELL_SIZE = 20; // Size of snake, distance of every moving
const DX = 20; //Snake move right first
const DY = 0; //Snake move bottom
const TIME_MOVE = 1000; //Snake will move after TIME_MOVE miliseconds

class Snake {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        //Draw canvas
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(0, 0, WIDTH, HEIGHT);
        this.dx = DX;
        this.dy = DY;
        this.dead = false;

        //Event press Up, Right, Down, Left
        document.addEventListener("keydown", (e) => {
            if (e.keyCode === 40 && this.dy >= 0) { //Snake can go down except it is running to top
                this.dy = CELL_SIZE;
                this.dx = 0;
            } else if (e.keyCode === 39 && this.dx >= 0) { //Snake can go right except it is running to left
                this.dx = CELL_SIZE;
                this.dy = 0;
            } else if (e.keyCode === 38 && this.dy <= 0) { //Snake can go up except it is running to down
                this.dy = - CELL_SIZE;
                this.dx = 0;
            } else if (e.keyCode === 37 && this.dx <= 0) { //Snake can go left except it is running to right
                this.dx = - CELL_SIZE;
                this.dy = 0;
            } else if (e.keyCode === 32) { //Press space reset the game
                this.snake = [{ x: WIDTH / 2, y: HEIGHT / 2 }];
                this.dead = false;
                this.dx = CELL_SIZE;
                this.dy = 0;
                document.querySelector('.game-status').textContent = '';
            }
        });

        //Init the snake position
        this.snake = [{ x: WIDTH / 2, y: HEIGHT / 2 }];

        //Init the target position for the first time
        this.hasTarget = true;
        this.targetX = this.random();
        this.targetY = this.random();

        document.body.appendChild(this.canvas)
        this.startGame();
    }

    startGame() {
        setInterval(() => {
            this.dead === false && this.updateGame(); this.drawGame();
        }, TIME_MOVE)
    }

    updateGame() {
        //Update snake
        let n = this.snake.length - 1;
        for (let i = n; i >= 1; i--) {
            this.snake[i].x = this.snake[i - 1].x;
            this.snake[i].y = this.snake[i - 1].y;
        }
        this.snake[0].x += this.dx;
        this.snake[0].y += this.dy;

        //Check snake hit the wall
        if (this.snake[0].x > WIDTH - CELL_SIZE) this.snake[0].x = 0;
        if (this.snake[0].y > HEIGHT - CELL_SIZE) this.snake[0].y = 0;


        if (this.snake[0].x < 0) this.snake[0].x = WIDTH;
        if (this.snake[0].y < 0) this.snake[0].y = HEIGHT;

        //check snake eat target
        if (this.snake[0].x === this.targetX && this.snake[0].y === this.targetY) {
            //Increase snake length
            this.snake.unshift({
                x: this.targetX + this.dx,
                y: this.targetY + this.dy
            })
            this.hasTarget = false;
        }

        //Update the target
        if (this.hasTarget === false) {
            while (this.checkTargetIsInSnakeBody(this.targetX, this.targetY) === false) { //Target must not be in the snake body
                this.targetX = this.random();
                this.targetY = this.random();
            }
        }

        //Check snake die when hit its body
        this.checkDie();
    }

    checkTargetIsInSnakeBody(x, y) {
        for (let cell of this.snake) {
            if (cell.x === x && cell.y === y) return false;
        }
        return true;
    }

    //Check snake die
    checkDie() {
        let x = this.snake[0].x;
        let y = this.snake[0].y
        let n = this.snake.length;
        for (let i = 1; i < n; i++) {
            if (this.snake[i].x === x && this.snake[i].y === y) {
                this.dead = true;
                document.querySelector('.game-status').textContent = 'Lose! Press space to play again';
                break;
            }
        }
    }

    //Clear the canvas
    clear() {
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(0, 0, WIDTH, HEIGHT);
    }

    drawGame() {
        this.clear();

        //Draw the snake
        let n = this.snake.length;
        for (let i = 0; i < n; i++) {
            if (i === 0) this.context.fillStyle = 'black'; //Head of snake is black
            else this.context.fillStyle = 'white';
            this.context.beginPath();
            this.context.fillRect(this.snake[i].x, this.snake[i].y, CELL_SIZE - 1, CELL_SIZE - 1);
        }

        //Draw the target
        this.context.fillStyle = 'red';
        this.context.beginPath();
        this.context.fillRect(this.targetX, this.targetY, CELL_SIZE - 1, CELL_SIZE - 1);
    }

    //Random a number from 0 to 380 and number % 20 = 0
    random() {
        return Math.round(Math.random() * (WIDTH - CELL_SIZE) / CELL_SIZE) * CELL_SIZE;
    }
}

//Start the game
let game = new Snake();
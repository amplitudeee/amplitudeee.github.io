// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const para = document.querySelector("p");
let count = 0;

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random color

function randomRGB() 
{
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape 
{
    constructor(x, y, velX, velY) 
    {
    // initialize properties
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
    }

    move() 
    {
        this.x += this.velX;
        this.y += this.velY;
    }
}

class Ball extends Shape 
{
    // Call the shape constructor using super()
    constructor(x, y, velX, velY, color, size) 
    {
        // call parent constructor
        super(x, y, velX, velY);

        // ball specific properties
        this.color = color;
        this.size = size;
        this.exists = true;
        count++;
        para.textContent = `Ball Count: ${count}`;
    }

    draw() 
    {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    }

    update() 
    {
        if (this.x + this.size >= width) {
            this.velX = -this.velX;
        }

        if (this.x - this.size <= 0) {
            this.velX = -this.velX;
        }

        if (this.y + this.size >= height) {
            this.velY = -this.velY;
        }

        if (this.y - this.size <= 0) {
            this.velY = -this.velY;
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() 
    {
        for (const ball of balls) 
            {
            if (!(this === ball) && ball.exists) 
            {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.size + ball.size) 
                {
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }
}

class evilCircle extends Shape 
{
    // be passed just the x, y arguements
    constructor(x, y) 
    {
        // pass the x, y arguments up to the Shape superclass along with values 
        // for velX and velY hardcoded to 20. You should do this with 
        // code like super(x, y, 20, 20);
        super(x, y, 20, 20);
        
        //set color to white and size to 10.
        this.color = "white";
        this.size = 10;
        window.addEventListener("keydown", (event) => 
        {
            switch (event.key) 
            {
                case "a":
                this.x -= this.velX;
                break;
                case "d":
                this.x += this.velX;
                break;
                case "w":
                this.y -= this.velY;
                break;
                case "s":
                this.y += this.velY;
                break;
            }
        });
    }

    draw() {
    // draw the circle
    ctx.beginPath();
    // set line width to 3
    ctx.lineWidth = 3;
    // set stroke style to this.color
    ctx.strokeStyle = this.color;
    // define the circles properties and draw it
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    // stroke the circle
    ctx.stroke();
    }

    checkBounds() 
    {
        if (this.x + this.size >= width) {
            this.x = this.x - this.velX;
        }

        if (this.x - this.size <= 0) {
            this.x = this.x + this.velX;
        }

        if (this.y + this.size >= height) {
            this.y = this.y - this.velY;
        }

        if (this.y - this.size <= 0) {
            this.y = this.y + this.velY;
        }
    }

    collisionDetect()
    {
        for (const ball of balls) 
        {
            // avoid checking collision with itself
            if (ball.exists) 
            {
                // calculate distance between this.evilCircle and the ball
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                // check for collision
                if (distance < this.size + ball.size) 
                {
                    // ball is removed from the canvas
                    ball.exists = false;
                    count--;
                    para.textContent = "Ball Count: " + count
                }
            }
        }
    }
}

const balls = [];

while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size,
    );

    balls.push(ball);
}

const evil = new evilCircle(500, 500); // starting position 

function loop() {
    // Next, set the canvas fill style to "rgb(0, 0, 0, 0.25)" and fill a rectangle starting at (0,0) with the width and height of the canvas.
    ctx.fillStyle = "rgb(0 0 0 / 100%)";
    ctx.fillRect(0, 0, width, height);

    // Next, loop through all the balls in the balls array, calling the draw(), update(), and collisionDetect() methods on each one.
    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
            evil.draw();
            evil.checkBounds();
            evil.collisionDetect();
        }
    }
    requestAnimationFrame(loop);
}

loop();


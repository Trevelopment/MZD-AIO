// jQuery Tetris plug-in
// by Alexander Gyoshev (http://blog.gyoshev.net/)
// licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License. (http://creativecommons.org/licenses/by-sa/3.0/)

// Modified for use with Mazda Infotainment System

function breakoutboard(_canvas, _scorechange ) {

    this.canvas = _canvas;
    this.scorechange = _scorechange;
    this.game_loop;

    this.ctx;
    this.x;
    this.y;
    this.paddleX;


    this.ballRadius = 5;
    this.dx = 2;
    this.dy = -2;
    this.paddleHeight = 3;
    this.paddleWidth = 60;
    
    this.brickRowCount = 6;
    this.brickColumnCount = 3;
    this.brickWidth = 35;
    this.brickHeight = 10;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 20;
    this.score = 0;
    this.lives = 3;
    this.bricks = [];

    this.buildbrick = function() {
        for(c=0; c<this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for(r=0; r<this.brickRowCount; r++) {
                this.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    this.collisionDetection  = function() {
        for(c=0; c<this.brickColumnCount; c++) {
            for(r=0; r<this.brickRowCount; r++) {
                var b = this.bricks[c][r];
                if(b.status == 1) {
                    if(this.x > b.x && this.x < b.x+this.brickWidth && this.y > b.y && this.y < b.y+this.brickHeight) {
                        this.dy = -this.dy;
                        b.status = 0;
                        this.score++;
                        this.scorechange(this.score, this.lives);
                        if(this.score == this.brickRowCount*this.brickColumnCount) {
                            //alert("YOU WIN, CONGRATS!");
                            //document.location.reload();
                            this.score = 0;
                            this.lives = 3;
                            this.scorechange(this.score,this.lives);

                            this.paddleX = (this.canvas.width-this.paddleWidth)/2;
                            this.drawPaddle();
                            this.buildbrick();
                        }
                    }
                }
            }
        }
    }

    this.drawBall = function() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI*2);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }
    this.drawPaddle = function() {
        this.ctx.beginPath();
        this.ctx.rect(this.paddleX, this.canvas.height-this.paddleHeight, this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }
    this.drawBricks = function() {
        for(c=0; c<this.brickColumnCount; c++) {
            for(r=0; r<this.brickRowCount; r++) {
                if(this.bricks[c][r].status == 1) {
                    var brickX = (r*(this.brickWidth+this.brickPadding))+this.brickOffsetLeft;
                    var brickY = (c*(this.brickHeight+this.brickPadding))+this.brickOffsetTop;
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;
                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    this.ctx.fillStyle = "#0095DD";
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }

    
    this.drawScore = function () {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Score: "+this.score, 8, 20);
    }
    this.drawLives = function() {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Lives: "+this.lives, this.canvas.width-65, 20);
    }

    
    this.draw = function() {
        if (this.initdata()) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawBricks();
            this.drawBall();
            this.drawPaddle();
            //this.drawScore();
            //this.drawLives();
            this.collisionDetection();
            if(this.x + this.dx > this.canvas.width-this.ballRadius || this.x + this.dx < this.ballRadius) {
                this.dx = -this.dx;
            }
            if(this.y + this.dy < this.ballRadius) {
                this.dy = -this.dy;
            }
            else if(this.y + this.dy > this.canvas.height-this.ballRadius-this.paddleHeight) {
                if(this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
                    this.dy = -this.dy;
                }
                else {
                    this.lives--;
                    this.scorechange(this.score,this.lives);
                    if(!this.lives) {
                        //alert("GAME OVER");
                        this.score = 0;
                        this.lives = 3;
                        this.scorechange(this.score,this.lives);

                        this.paddleX = (this.canvas.width-this.paddleWidth)/2;
                        this.drawPaddle();
                        this.buildbrick();
         
                    }
                    else {
                        this.x = this.canvas.width/2;
                        this.y = this.canvas.height-30;
                        this.dx = 3;
                        this.dy = -3;
                        this.paddleX = (this.canvas.width-this.paddleWidth)/2;
                    }
                }
            }
            this.x += this.dx;
            this.y += this.dy;
        }
            
    }


    this.initdata = function () {
        if (this.ctx === undefined) {
            this.ctx = this.canvas.getContext("2d");
            this.x = this.canvas.width/2;
            this.y = this.canvas.height-30;
            this.paddleX = (this.canvas.width-this.paddleWidth)/2;
            this.drawPaddle();
            this.buildbrick();
       }
       return this.ctx !== undefined;
    }

    this.paint = function () {
        if ( this.initdata() ) {
            this.draw();
        }
    }

    this.pause = function() 
    {
        if( this.game_loop !== undefined) clearInterval(this.game_loop);
        this.game_loop = undefined  
    }

    this.start = function() 
    {
        if (this.game_loop === undefined) {
            this.game_loop = setInterval(function(){
                this.paint();
            }.bind(this), 30);
        }
    }

    this.handle = function(eventId)
    {
        if (eventId == "ccw" ) {
            this.paddleX -= 7;
        }
        else if (eventId == "cw"  ) {
            this.paddleX += 7;
        }
    }

};
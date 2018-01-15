// jQuery Tetris plug-in
// by Alexander Gyoshev (http://blog.gyoshev.net/)
// licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License. (http://creativecommons.org/licenses/by-sa/3.0/)

// Modified for use with Mazda Infotainment System

function snakeboard(_canvas, _scorechange ) {

   //Canvas stuff
    
    this.canvas = _canvas;
    this.scorechange = _scorechange;
    this.ctx;
    this.w;
    this.h;
    
    //Lets save the cell width in a variable for easy control
    this.cw = 10;

    this.d = "right";
    this.food;
    this.score = 0;
    this.game_loop;
    
    //Lets create the snake now
    this.snake_array; //an array of cells to make up the snake
    

    
    this.create_snake = function ()
    {
        var length = 5; //Length of the snake
        this.snake_array = []; //Empty array to start with
        for(var i = length-1; i>=0; i--)
        {
            //This will create a horizontal snake starting from the top left
            this.snake_array.push({x: i, y:0});
        }
    }
    
    //Lets create the food now
    this.create_food = function()
    {
        this.food = {
            x: Math.round(Math.random()*(this.w-this.cw)/this.cw), 
            y: Math.round(Math.random()*(this.h-this.cw)/this.cw), 
        };
    }

    this.check_collision = function(x, y, array)
    {
        //This function will check if the provided x/y coordinates exist
        //in an array of cells or not
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
             return true;
        }
        return false;
    }
    
    
    //Lets paint the snake now
    this.paint = function()
    {

        //To avoid the snake trail we need to paint the BG on every frame
        //Lets paint the canvas now
        if (this.ctx === undefined) {
            this.ctx = this.canvas.getContext("2d");
            this.w = this.canvas.width;
            this.h = this.canvas.height;
            this.cw = 10;
            this.create_snake();
            this.create_food();
        }
        if (this.ctx !== undefined) {


            this.ctx.clearRect(0, 0, this.w, this.h);
             
            //The movement code for the snake to come here.
            //The logic is simple
            //Pop out the tail cell and place it infront of the head cell
            var nx = this.snake_array[0].x;
            var ny = this.snake_array[0].y;
            //These were the position of the head cell.
            //We will increment it to get the new head position
            //Lets add proper direction based movement now
            if(this.d == "right") nx++;
            else if(this.d == "left") nx--;
            else if(this.d == "up") ny--;
            else if(this.d == "down") ny++;
            
            //Lets add the game over clauses now
            //This will restart the game if the snake hits the wall
            //Lets add the code for body collision
            //Now if the head of the snake bumps into its body, the game will restart
            if(nx == -1 || nx == this.w/this.cw || ny == -1 || ny == this.h/this.cw || this.check_collision(nx, ny, this.snake_array))
            {
                //restart game
                this.d = "right"
                this.score = 0;
                this.create_snake();
                this.create_food();
                return;
            }
            
            //Lets write the code to make the snake eat the food
            //The logic is simple
            //If the new head position matches with that of the food,
            //Create a new head instead of moving the tail
            if(nx == this.food.x && ny == this.food.y)
            {
                var tail = {x: nx, y: ny};
                this.score++;
                this.scorechange(this.score);
                //Create new food
                this.create_food();
            }
            else
            {
                var tail = this.snake_array.pop(); //pops out the last cell
                tail.x = nx; tail.y = ny;
            }
            //The snake can now eat the food.
            
            this.snake_array.unshift(tail); //puts back the tail as the first cell
            
            for(var i = 0; i < this.snake_array.length; i++)
            {
                var c = this.snake_array[i];
                //Lets paint 10px wide cells
                this.paint_cell(c.x, c.y);
            }
            
            //Lets paint the food
            this.paint_cell(this.food.x, this.food.y);
        }
    }
    
    //Lets first create a generic function to paint cells
    this.paint_cell = function(x, y)
    {
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(x*this.cw, y*this.cw, this.cw, this.cw);
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(x*this.cw, y*this.cw, this.cw, this.cw);
    }

    this.pause = function() 
    {

        if( this.game_loop !== undefined) clearInterval(this.game_loop);
        this.game_loop = undefined
       
    }

    this.start = function() 
    {
        //Lets move the snake now using a timer which will trigger the paint function
        //every 60ms
        if (this.game_loop === undefined) {
            this.game_loop = setInterval(function(){
                this.paint();
            }.bind(this), 120);
        }
    }

    this.handle = function(eventId)
    {
        //We will add another clause to prevent reverse gear
        if(eventId == "leftStart" && this.d != "right") this.d = "left";
        else if(eventId == "upStart" && this.d != "down") this.d = "up";
        else if(eventId == "rightStart" && this.d != "left") this.d = "right";
        else if(eventId == "downStart" && this.d != "up") this.d = "down";
        else if (eventId == "cw" ) {
            switch (this.d) {
                case "left":
                    this.d = "up";
                    break;
                case "up":
                    this.d = "right";
                    break;
                case "right":
                    this.d = "down";
                    break;
                case "down":
                    this.d = "left";
                    break;
            }
        }
        else if (eventId == "ccw" ) {
            switch (this.d) {
                case "left":
                    this.d = "down";
                    break;
                case "up":
                    this.d = "left";
                    break;
                case "right":
                    this.d = "up";
                    break;
                case "down":
                    this.d = "right";
                    break;
            }
        }

    }
};
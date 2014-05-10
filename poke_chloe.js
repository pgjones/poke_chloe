var X_TILES =  40;
var Y_TILES = 25;
var TILE_WIDTH = 30;
var TILE_HEIGHT = 30;
var CANVAS_WIDTH = X_TILES * TILE_WIDTH;
var CANVAS_HEIGHT = Y_TILES * TILE_HEIGHT + 20;
var Y_OFFSET = 20;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "' tabindex='1'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

function Chloe() {
    this.color = "#00A";
    this.x = 0; // Tile positions
    this.y = 2; // Tile positions
    this.text = "";
    this._awake = false;
    this._dead = false;
    this.image = new Image();
    this.image.src = "images/chap.png";
    this.sleep_time = 0.0;
    this.start = function(pos) {
        this.x = pos[0];
        this.y = pos[1];
        this.text = "";
        this._awake = false;
        this._dead = false;
        this.sleep_time = 0.0;
    }
    this.draw = function() {
        canvas.drawImage(this.image, this.x * TILE_WIDTH, Y_OFFSET + this.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        canvas.fillStyle = "#000";
        canvas.font="20px Verdana";
        canvas.fillText(this.text, this.x * TILE_WIDTH, (this.y - 0.4) * TILE_HEIGHT);
        if(!this.awake() && !this._dead) {
            canvas.fillStyle = "#000";
            canvas.font="20px Verdana";
            var offset = Math.random() * TILE_HEIGHT / 2.0;
            sleep = "Zz";
            for(i = 0; i < this.sleep_time && i < 10; i++ )
                sleep += "z";
            canvas.fillText(sleep, this.x * TILE_WIDTH, (this.y - 0.6) * TILE_HEIGHT + offset);
            this.sleep_time += 0.1;
        }
        if(this.awake() && Math.random() > 0.99)
            this._awake = !this._awake;
        if(this.sleep_time > 10.0 && Math.random() > 0.99) {
            this._awake = !this._awake;
            this.sleep_time = 0.0;
        }
    }
    this.poke = function() {
        this._dead = true;
        if(Math.random() > 0.8)
            this.text = "Kidney stones :(";
        //else if(Math.random() > 0.9)
        //    this.text = "Stroke :(";
        else
            this.text = "OI!";
    }
    this.navigable = function(pos) {
        if(this.x == pos[0] && this.y == pos[1])
            return false;
        else
            return true;
    }
    this.awake = function() {
        return this._awake;
    }
}

function Player(player) {
    this.color = "#0A0";
    this.x = 0;
    this.y = 0;
    this._score = 0;
    this.image = new Image();
    this.image.src = "images/chap" + player + ".png";
    this.orientation = 0;
    this.start = function(pos) {
        this.x = pos[0];
        this.y = pos[1];
    }
    this.draw = function() {
        canvas.save();
        canvas.translate(this.x * TILE_WIDTH, Y_OFFSET + this.y * TILE_HEIGHT); 
        canvas.translate(TILE_WIDTH / 2.0, TILE_HEIGHT / 2.0); 
        canvas.rotate(this.orientation * 90.0 * Math.PI / 180.0); 
        canvas.translate(-TILE_WIDTH / 2.0, -TILE_HEIGHT / 2.0); 
        canvas.drawImage(this.image, 0, 0, TILE_WIDTH, TILE_HEIGHT);
        canvas.restore();
    }
    this.move = function(x, y) {
        if(x < 0) this.orientation = 1;
        if(x > 0) this.orientation = 3;
        if(y < 0) this.orientation = 2;
        if(y > 0) this.orientation = 0;

        this.x += x;
        if(this.x < 0 || this.x >= X_TILES )
            this.x -= x;
        this.y += y;
        if(this.y < 0 || this.y >= Y_TILES )
            this.y -= y;
    }
    this.position = function() {
        return [this.x, this.y];
    }
    this.navigable = function(pos) {
        if(this.x == pos[0] && this.y == pos[1])
            return false;
        else
            return true;
    }
    this.win = function() {
        this._score++;
    }
    this.lose = function() {
        this._score--;
    }
    this.score = function() {
        return this._score;
    }
}


function Map() {
    this.grid = new Array(X_TILES * Y_TILES);
    this.images = [new Image(), new Image()];
    this.images[0].src = "images/desk.png";
    this.images[1].src = "images/desk2.png";
    for(var column = 0; column < X_TILES; column++ ) {
        for(var row = 0; row < Y_TILES; row++) {
            var index = row * X_TILES + column;
            if(row % 2 == 0 && (column < 8 || (column > 11 && column < 29) || column > 32)) {
                if(Math.floor(Math.random()*3) == 0)
                    this.grid[index] = 0;
                else
                    this.grid[index] = 1;
            }
            else
                this.grid[index] = -1;
        }
    }
    this.draw = function() {
        for(var tile = 0; tile < X_TILES * Y_TILES; tile++) {
            var x = tile % X_TILES;
            var y = Math.floor(tile / X_TILES);
            if(this.grid[tile] >= 0) {
                canvas.drawImage(this.images[this.grid[tile]], x * TILE_WIDTH, Y_OFFSET + y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            }
        }
    }
    this.navigable = function(pos) {
        var x = pos[0];
        var y = pos[1];
        var tile = y * X_TILES + x;
        if(this.grid[tile] >= 0)
            return false;
        else
            return true;
    }
    this.generate = function(player) {
        if(player > 0) {
            pos = [Math.floor(Math.random() * 8), Math.floor(Math.random() * Y_TILES)];
            while(!this.navigable(pos))
                pos = [Math.floor(Math.random() * 8), Math.floor(Math.random() * Y_TILES)];
            if(player == 2)
                pos[0] += 32;
            return pos;
        }
        else {
            pos = [12 + Math.floor(Math.random() * 17), Math.floor(Math.random() * Y_TILES)];
            while(!this.navigable(pos))
                pos = [12 + Math.floor(Math.random() * 17), Math.floor(Math.random() * Y_TILES)];
            return pos;
        }
    }
}

function Game() {
    this.chloe = new Chloe();
    this.map = new Map();
    this.players = [new Player(1), new Player(2)];
    this.keys = [[0,0], [0,0]]
    this.start = function() {
        this.chloe.start(this.map.generate(0));
        this.players[0].start(this.map.generate(1));
        this.players[1].start(this.map.generate(2));
    }
    this.loop = function() {
        canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.move(0);
        this.move(1);
        this.map.draw();
        for(player in this.players) {
            this.players[player].draw();
        }
        this.chloe.draw();
        canvas.fillStyle = "#f00";
        canvas.font="20px Verdana";
        canvas.fillText("Player 1 scores " + this.players[0].score(), 20, 20);
        canvas.fillStyle = "#00f";
        canvas.fillText("Player 2 scores " + this.players[1].score(), 1000, 20);
    }
    this.set_key = function(player, x, y) {
        if(x != null)
            this.keys[player][0] = x;
        if(y != null)
            this.keys[player][1] = y;
    }
    this.move = function(player) {
        x = this.keys[player][0];
        y = this.keys[player][1];
        if(x == 0 && y == 0)
            return;
        if(this.chloe.awake()) {
            this.players[player].lose();
            this.start();
        }
        this.players[player].move(x, y);
        if(!this.map.navigable(this.players[player].position()))
            this.players[player].move(-x,-y);
        else if(!this.chloe.navigable(this.players[player].position()))
            this.players[player].move(-x,-y);
        
    }
    this.poke = function(player) {
        pos = this.players[player].position();
        pos[0] += 1;
        if(!this.chloe.navigable(pos)) {
            this.chloe.poke();
            this.players[player].win();
            setTimeout(function() {game.start();}, 1000);
        }
        pos[0] -= 2;
        if(!this.chloe.navigable(pos)) {
            this.chloe.poke();
            this.players[player].win();
            setTimeout(function() {game.start();}, 1000);
        }
    }
}

var game = new Game();
game.start();
var FPS = 25;
setInterval(function() {game.loop()}, 1000/FPS);
$(document).keydown(function(event) {
        switch(event.which) {
        case 37: //left
            game.set_key(1, -1, null);
            break;
        case 38: //Up
            game.set_key(1, null, -1);
            break;
        case 39: //Right
            game.set_key(1, 1, null);
            break;
        case 40: //Down
            game.set_key(1, null, 1);
            break;
        case 13: //Ent
            game.poke(1);
            break;
        case 65: //A
            game.set_key(0, -1, null);
            break;
        case 87: //W
            game.set_key(0, null, -1);
            break;
        case 68: //D
            game.set_key(0, 1, null);
            break;
        case 83: //S
            game.set_key(0, null, 1);
            break;
        case 32: //space
            game.poke(0);
            break;
        }
        event.preventDefault();
    })
$(document).keyup(function(event) {
        switch(event.which) {
        case 37: //left
            game.set_key(1, 0, null);
            break;
        case 38: //Up
            game.set_key(1, null, 0);
            break;
        case 39: //Right
            game.set_key(1, 0, null);
            break;
        case 40: //Down
            game.set_key(1, null, 0);
            break;
        case 65: //A
            game.set_key(0, 0, null);
            break;
        case 87: //W
            game.set_key(0, null, 0);
            break;
        case 68: //D
            game.set_key(0, 0, null);
            break;
        case 83: //S
            game.set_key(0, null, 0);
            break;
        }
        event.preventDefault();
    })
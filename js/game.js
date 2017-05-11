/*************************************
    Gravity game?
    Author: Justin Chang
    Date: 3 May 2017
 *************************************/

const PROXIMITY = 100; // distance the rocket needs to be away from planet
const BUFFER_ZONE = 0; // distance the rocket can stray from the bounds
const UNIT_J = new Vector(0, -1);
const THRUST = .03;
const PLANET_MASS = 1300; // 800-1500
const FUEL_INTERVAL = 5; // every fifth planet
const FUEL_USE = 0.05;
const TURNING_SPEED = 0.05;

var rocket;
var miniRocket;
var graphics;
var planets, stars;
var curPlanetIndex = 2; // 0 - planet0, 1 - planet1, 2 - new
var score = 0;
var bgGroup; // group of squares for background asteroids
var circles; // graphics object for drawing proximity circles around planets
var gameOver = false;

// create the game
var game = new Phaser.Game(800, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

function preload() {
    game.forceSingleUpdate = true;
    // load assets
    game.load.image('rocketon', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAtCAYAAAC53tuhAAAAfUlEQVRYhe3VsQ2AMBADwJ+BxViIIiWrpWOjpwKliCUeeAVhW3ITKTl3MQtmWyfvNfpOOBwwwtJHcMO11m4F304pxY9G4fauYMGCyWGEoQoW/E04iqEKFjwWfgsLj+CAszE4gg9G4fudhsFtfDY/uzQF548wbvjKiBTsV/AO3DCi7ESmZbwAAAAASUVORK5CYII=');
    game.load.image('rocketoff', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAtCAYAAAC53tuhAAAAaklEQVRYhe3VsQ3AIBBDUWZg4iuz2nVsBFWkFLhwFASR/SWX4V2XUsjaVfts7Dt0GjDClh+hDWfmdIZfFxH9Hgs/vzVs2LA4jDA0w4bPhFkMzbDhvfBXGH2EBrwag0fowSi9v9M22LnfNgB+8SHvtb/YqAAAAABJRU5ErkJggg==');
    game.load.image('planetred', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAjElEQVRYhe3YQQ6AIAxEUW7APbimK0+tW00w1lTKrw7JrPs2BDqlOM5S62aJZ4YLtLZmShgYC3wKsoJxsNego2FuKBoYCetBcwNn4kxILDD6UliQJ6iAnwaSYD2ogAIKKKCAdCD+qRPwF0D8lz8NcDYy/158RGKrjxTAKCi2JxzetOIq4DTAO/BVPDN2ps8heDyuIcwAAAAASUVORK5CYII=');
    game.load.image('planetgreen', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABGUlEQVRYhe3ZwQqDMAwAUP+h8bBkHxoQBEEE0ZsI+9vs4HTWbdiunYvQQo7Wp6apxiwLGMS5uETIObzGhUHmwMoI9eAUWBlZH/sTHJZGqIZndCDXm1tQB9axWJq4SCxAqHEH7YIbECwi3ElkEGQQao3QGBE4TnPO83+HW+fYEA+3IAc7R/1xHjkWjO08kMjTVR2FW5C94+NWDcTisSB+kHNOOdmaz6sbSyPUQNTV6o0cHyVoWycvPBXQf8FeoPVmx0nAUODRdW8XuK6LxPlfysousgchziUBEzABEzABtQPVb3WneFlIwFCg+lf+U3w0LUhW/Nl5CmCWKW99WEitzaMFyYrbbxZUawPTQmpuAc9DdRP93TjiN8QdogrOqV9CmaQAAAAASUVORK5CYII=');
    game.load.image('planetfuel', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABdElEQVRYhe3ZwWrDMAwAUH9Cwcqh8j5UEAgUSqAktxLYB+w/tUNqL3GbWXbsYNYZdGvS11hWbFWpHcNQw5LY8x1R40zANvCi2YwgCrxoXl5bBIedZnOFnxiAPz5lYQZYXYudzovEFtj0clAQ3ANjm+FJIgEjAZubZjNlBE7zPe3903DLHLvnwznkfZ2j8biIHNuNHSKQSPOvOgrnkKNwuqsGYvtYEAVyTpSTN729urHTbHrIulp/C6WUC4ecHiXIr5NnmgvoUU9riVsCHfTqvXGkwK/TSRwxT64YMPTZFNxLoLTupQJDU/oEXNZFQ424rMRMsY1YnEOOwIYaLg70kVUCLVKKywL0p24rpDlbBTAG+V7AHAX8vYHS6f2bwNRXXUng0xEgZbNQMgez7Gb+geRt/SVb/tLAzS2/QwYOTSWBwUOTQ9L2sTMGEg3McS6uAqhU5a2PFbLW5pFDUsXttxW01gbmCllzC9iOqpvor8YRf0N8Ay0wenXPjGwuAAAAAElFTkSuQmCC');
    game.load.image('star', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAABIklEQVR4nO3bMQ7EIBBDUe5/51W2ZaWtwsDH8C2597wyEa1tkOfTnjeld2N5C3Y16Cy0ozFXox2DSYNFQ9JIsYg0TDQkjRGLSANEQ9JHRyPSx0Yj0kdGI9LHRSPSR0Uj0sdEI9JH0BWQBKTH71LxCER68G4VbxUiPXL3CjgTkB6XUgEF3BCQHpVWAQXcCJAek1oBBRQwuuJVINID0iuggAJGV0ABBYyugAIKGF0BBRQwun6RGcUTUEABU+ufuSo8AQXkAUUcxBNQQB5QxEE8AQsARRzEE7EAT8ACQBEH8UQswBPQV+s83q2IpXi3IU7BuwVxKt7piEvwTkVcincaIoJ3AiTt9hMaIxqvDw0TC9eHRorG60ODxcL9i2iFEa04yWBfDcjIzwFeD38AAAAASUVORK5CYII=');
    game.load.image('minimaprocket', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAHklEQVQ4jWN4xfD/PzUxw6iBowaOGjhq4KiBI9VAAB5mir1R0bMcAAAAAElFTkSuQmCC');
    // set time mode for FPS counter
    game.time.advancedTiming = true;
}

function create() {
    // initialize game settings
    game.world.setBounds(0, 0, 2000, 2000);
    game.stage.disableVisibilityChange = true;

    // create asteroids
    var sqr, size;
    for (var i = 0; i < 500; i++) {
        size = game.rnd.integerInRange(5, 16);
        sqr = game.add.graphics(game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.height), bgGroup);
        sqr.beginFill(0x444444);
        sqr.drawRect(size * -0.5, size * -0.5, size, size); // center the square on its position
        sqr.endFill();
    }

    // create graphics object for drawing proximity circles
    circles = game.add.graphics(0, 0);

    // create minimap window
    graphics = game.add.graphics(0, 0);
    graphics.beginFill(0x757575);
    graphics.drawRect(0, 0, 150, 150);
    graphics.endFill();
    graphics.fixedToCamera = true;

    // add rocket
    rocket = new Rocket(game, 500, 500, new Vector(0, 0), Math.PI * 3 / 4);

    // add rocket minimap sprite
    miniRocket = game.add.sprite(rocket.getX() * 150 / game.world.width, rocket.getY() * 150 / game.world.height, 'rocketoff');
    miniRocket.anchor.set(0.5, 0.5);
    miniRocket.scale.setTo(0.20);
    miniRocket.fixedToCamera = true;


    // create planets and sun
    planets = [];
    planets.push(new Planet(game, 250, 750, getRandomInt(800, 1500)));
    planets.push(new Planet(game, 750, 250, getRandomInt(800, 1500)));
    planets.push(new Planet(game, 250, game.world.height-750, getRandomInt(800, 1500)));
    planets.push(new Planet(game, 750, game.world.height-250, getRandomInt(800, 1500)));
    planets.push(new Planet(game, game.world.width-250, 750, getRandomInt(800, 1500)));
    planets.push(new Planet(game, game.world.width-750, 250, getRandomInt(800, 1500)));
    planets.push(new Planet(game, game.world.width-250, game.world.height-750, getRandomInt(800, 1500)));
    planets.push(new Planet(game, game.world.width-750, game.world.height-250, getRandomInt(800, 1500)));
    stars = [];
    star = new Planet(game, 1000, 1000, 2700);
    star.makeStar();
    stars.push(star);

    // draw circles around planets
    /*
    circles.lineStyle(1, 0xFF00FF);
    circles.drawCircle(planets[0].x, planets[0].y, 100);
    circles.drawCircle(planets[1].x, planets[1].y, 100);
    circles.lineStyle(0, 0xFF00FF);
    */

    // add key input to the game
    this.keys = game.input.keyboard.createCursorKeys();
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

    // create text for score in bottom left
    var scoreStyle = { font: "20px Arial", fill: "#ff0044", align: "left" };
    this.score = game.add.text(25, game.height - 25, "Score: " + score, scoreStyle);
    this.score.fixedToCamera = true;

    // create text for game over text in the center
    var gameOverStyle = { font: "50px Arial", fill: "#ff0044", align: "center" };
    this.gameOver = game.add.text(game.width * 0.5, game.height * 0.5, "", gameOverStyle);
    this.gameOver.anchor.set(0.5);
    this.gameOver.fixedToCamera = true;

    // create the fuel bar (using HealthBar.js plugin)
    var barConfig = {
        x: game.width * .5,
        y: game.height - 20,
        width: 300,
        height: 25,
        animationDuration: 1,
        isFixedToCamera: true
    }
    this.fuelBar = new HealthBar(this.game, barConfig);
    var fuelStyle = { font: "15px Arial", fill: "#ff0044", align: "left" };
    this.fuelLabel = game.add.text(game.width * .5 - 140, game.height - 25, "Fuel: 100%", fuelStyle);
    this.fuelLevel = 100;
    this.fuelLabel.fixedToCamera = true;

    // create camera
    game.camera.follow(rocket.getSprite());
}

function update() {
    var accelerations = new Array();

    for(var i = 0; i < planets.length; i++) {
        // calculate acceleration due to gravity
        dx = rocket.getX() - planets[i].getX();
        dy = rocket.getY() - planets[i].getY();
        r = Math.abs(Math.hypot(dx, dy));
        theta = Math.atan(dy / dx);
        mag = calculateGravity(planets[i].getMass(), r);
        if(rocket.getX() < planets[i].getX()) {
            accelerations.push(new Vector(mag * Math.cos(theta), mag * Math.sin(theta)));
        } else {
            accelerations.push(new Vector(-1 * mag * Math.cos(theta), -1 * mag * Math.sin(theta)));
        }

        // check if within proximity of planet

        // check if rocket has hit planet
        if(planets[i].isOverlapping(rocket.getX(), rocket.getY())) {
            rocket.setVelocity(new Vector(0, 0));
            for(var i = 0; i < planets.length; i++) {
                planets[i].endGameState();
            }
            this.gameOver.setText("GAME OVER!\nPlanets: " + score);
            gameOver = true;
        }
    }

    for(var i = 0; i < stars.length; i++) {
        // calculate acceleration due to gravity
        dx = rocket.getX() - stars[i].getX();
        dy = rocket.getY() - stars[i].getY();
        r = Math.abs(Math.hypot(dx, dy));
        theta = Math.atan(dy / dx);
        mag = calculateGravity(stars[i].getMass(), r);
        if(rocket.getX() < stars[i].getX()) {
            accelerations.push(new Vector(mag * Math.cos(theta), mag * Math.sin(theta)));
        } else {
            accelerations.push(new Vector(-1 * mag * Math.cos(theta), -1 * mag * Math.sin(theta)));
        }

        // check if rocket has hit star
        if(stars[i].isOverlapping(rocket.getX(), rocket.getY())) {
            rocket.setVelocity(new Vector(0, 0));
            for(var i = 0; i < planets.length; i++) {
                planets[i].endGameState();
            }
            this.gameOver.setText("GAME OVER!\nPlanets: " + score);
            gameOver = true;
        }
    }

    // add thrust in forward direction of velocity
    if(this.fuelLevel > 0 && gameOver == false && this.fuelLevel > 0 && (this.keys.up.isDown || this.upKey.isDown)) {
        var unitVector = [-1 * Math.cos(-1 * rocket.getDirection() - Math.PI / 2), Math.sin(-1 * rocket.getDirection() - Math.PI / 2)];
        rocket.setVelocity(rocket.getVelocity().add(new Vector(THRUST * unitVector[0], THRUST * unitVector[1])));
        this.fuelLevel -= FUEL_USE;
        rocket.loadTexture('rocketon');
    } else {
        rocket.loadTexture('rocketoff');
    }

    // turn rocket (uses 1/3rd the fuel of forward thrust)
    if(this.fuelLevel > 0 && gameOver == false) {
        if(this.keys.left.isDown || this.leftKey.isDown) {
            rocket.setDirection(rocket.getDirection() - 0.05);
            this.fuelLevel -= FUEL_USE / 3;
        }
        if(this.keys.right.isDown || this.rightKey.isDown) {
            rocket.setDirection(rocket.getDirection() + 0.05);
            this.fuelLevel -= FUEL_USE / 3;
        }
    }

    // add accelerations to velocity vector
    for(i = 0; i < accelerations.length; i++) {
        rocket.setVelocity(rocket.getVelocity().add(accelerations[i]));
    }
    // increment position of rocket
    rocket.setX(rocket.getX() + rocket.getVelocity().getComponents()[0]);
    rocket.setY(rocket.getY() + rocket.getVelocity().getComponents()[1]);

    // check if within proximity of planet
    /*
    if(calculateDistance(planets[0]) && (curPlanetIndex === 2 || curPlanetIndex != 0)) {
        // check if fuel planet
        if(score % FUEL_INTERVAL == 0) {
            if(this.fuelLevel <= 50) {
                this.fuelLevel += 50;
            } else {
                this.fuelLevel = 100;
            }
        }

        curPlanetIndex = 0;
        planets[0].changeColorRed();
        // find good x and y (OPTIMIZE THIS)
        var nx = getRandomInt(100, game.world.width - 100);
        var ny = getRandomInt(100, game.world.height - 100);
        while(Math.abs(nx - planets[0].getX()) + Math.abs(ny - planets[0].getY()) < 400) {
            nx = getRandomInt(100, game.world.width - 100);
            ny = getRandomInt(100, game.world.height - 100);
        }
        var mass = getRandomInt(800, 1500);
        planets[1].setX(nx);
        planets[1].setY(ny);
        planets[1].setMass(mass);
        if(score % FUEL_INTERVAL == 4 && score != 0) {
            planets[1].makeFuelPlanet();
        } else {
            planets[1].changeColorGreen();
        }
        score++;
        this.score.setText("Score: " + score);
        // remake proximity circles
        circles.destroy();
        circles = game.add.graphics(0, 0);
        circles.lineStyle(1, 0xFF00FF);
        circles.drawCircle(planets[1].x, planets[1].y, 100);
        circles.lineStyle(0, 0xFF00FF);
    }
    if(calculateDistance(planets[1]) && (curPlanetIndex === 2 || curPlanetIndex != 1)) {
        // check if fuel planet
        if(score % FUEL_INTERVAL == 0) {
            if(this.fuelLevel <= 50) {
                this.fuelLevel += 50;
            } else {
                this.fuelLevel = 100;
            }
        }

        curPlanetIndex = 1;
        planets[1].changeColorRed();
        // find good x and y
        var nx = getRandomInt(100, game.world.width - 100);
        var ny = getRandomInt(100, game.world.height - 100);
        while(Math.abs(nx - planets[1].getX()) + Math.abs(ny - planets[1].getY()) < 400) {
            nx = getRandomInt(100, game.world.width - 100);
            ny = getRandomInt(100, game.world.height - 100);
        }
        var mass = getRandomInt(800, 1500);
        planets[0].setX(nx);
        planets[0].setY(ny);
        planets[0].setMass(mass);
        if(score % FUEL_INTERVAL == 4 && score != 0) {
            planets[0].makeFuelPlanet();
        } else {
            planets[0].changeColorGreen();
        }
        score++;
        this.score.setText("Score: " + score);
        // remake proximity circles
        circles.destroy();
        circles = game.add.graphics(0, 0);
        circles.lineStyle(1, 0xFF00FF);
        circles.drawCircle(planets[0].x, planets[0].y, 100);
        circles.lineStyle(0, 0xFF00FF);
    }
    */

    // check bounds
    if(rocket.getX() < -1 * BUFFER_ZONE || rocket.getX() > game.world.width + BUFFER_ZONE || rocket.getY() < -1 * BUFFER_ZONE || rocket.getY() > game.world.height + BUFFER_ZONE) {    // pause the game and display game over text
        rocket.setVelocity(new Vector(0, 0));
        for(var i = 0; i < planets.length; i++) {
            planets[i].endGameState();
        }
        this.gameOver.setText("GAME OVER!\nPlanets: " + score);
        gameOver = true;
    }

    // update fuel bar
    this.fuelBar.setPercent(this.fuelLevel);
    this.fuelLabel.setText("Fuel: " + Math.floor(this.fuelLevel) + "%");

    // check if restart game
    if(this.restartKey.isDown) {
        // reset rocket
        rocket.setX(500);
        rocket.setY(500);

        // reset movement variables
        rocket.setVelocity(new Vector(0, 0));
        rocket.setDirection(0)

        // delete two old planets
        for(var i = 0; i < planets.length; i++) {
            planets[i].destroy();
        }

        // create first two planets
        planets = [];
        planets.push(new Planet(game, 250, 750, getRandomInt(800, 1500)));
        planets.push(new Planet(game, 750, 250, getRandomInt(800, 1500)));
        planets.push(new Planet(game, 250, game.world.height-750, getRandomInt(800, 1500)));
        planets.push(new Planet(game, 750, game.world.height-250, getRandomInt(800, 1500)));
        planets.push(new Planet(game, game.world.width-250, 750, getRandomInt(800, 1500)));
        planets.push(new Planet(game, game.world.width-750, 250, getRandomInt(800, 1500)));
        planets.push(new Planet(game, game.world.width-250, game.world.height-750, getRandomInt(800, 1500)));
        planets.push(new Planet(game, game.world.width-750, game.world.height-250, getRandomInt(800, 1500)));
        stars = [];
        star = new Planet(game, 1000, 1000, 2700);
        star.makeStar();
        stars.push(star);

        // remake proximity circles
        /*
        circles.destroy();
        circles = game.add.graphics(0, 0);
        circles.lineStyle(1, 0xFF00FF);
        circles.drawCircle(planets[0].x, planets[0].y, 100);
        circles.drawCircle(planets[1].x, planets[1].y, 100);
        circles.lineStyle(0, 0xFF00FF);
        */

        // reset score
        score = 0;

        // reset fuel bar
        this.fuelLevel = 100;

        // take out game over message
        this.gameOver.setText("");
        gameOver = false;
    }

    // bring minimap to top
    game.world.bringToTop(graphics);
    for(var i = 0; i < planets.length; i++) {
        planets[i].bringToTop();
    }
    for(var i = 0; i < stars.length; i++) {
        stars[i].bringToTop();
    }

    // update rocket's position on minimap
    miniRocket.fixedToCamera = false;
    miniRocket.x = rocket.getX() * 150 / game.world.width;
    miniRocket.y = rocket.getY() * 150 / game.world.height;
    miniRocket.rotation = rocket.getDirection();
    miniRocket.fixedToCamera = true;
    game.world.bringToTop(miniRocket);
}

function render() {
    // display info about the rocket
    //game.debug.spriteInfo(rocket, 32, 32);
    // display fps
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
}

// function to calculate gravity given mass and distance away
function calculateGravity(m, r) {
    var ag = m / Math.pow(r, 2);
    return ag;
}

// function to calculate distance from rocket and planet
function calculateDistance(planet) {
    dx = planet.getX() - rocket.getX();
    dy = planet.getY() - rocket.getY();
    dist = Math.hypot(dx, dy);

    return dist <= PROXIMITY;
}

// function to calculate random number in range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

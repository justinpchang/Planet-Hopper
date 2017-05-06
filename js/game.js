/*************************************
    Gravity game?
    Author: Justin Chang
    Date: 3 May 2017
 *************************************/

const PROXIMITY = 100; // distance the rocket needs to be away from planet
const BUFFER_ZONE = 400; // distance the rocket can stray from the bounds
const UNIT_J = new Vector(0, -1);
const THRUST = .1;
const PLANET_MASS = 1135;

var rocket;
var planets;
var curPlanetIndex = 2; // 0 - planet0, 1 - planet1, 2 - new
var score = 0;
var bgGroup; // group of squares for background asteroids
var circles; // graphics object for drawing proximity circles around planets

// create the game
var game = new Phaser.Game(800, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

function preload() {
    // load assets
    game.load.image('rocket', 'assets/rocket.png');
    game.load.image('planetred', 'assets/planetred.png');
    game.load.image('planetgreen', 'assets/planetgreen.png');
    // set time mode for FPS counter
    game.time.advancedTiming = true;
}

function create() {
    // initialize game settings
    game.world.setBounds(0, 0, game.width, game.height);
    game.stage.disableVisibilityChange = true;

    // create asteroids
    var sqr, size;
    for (var i = 0; i < 300; i++) {
        size = game.rnd.integerInRange(5, 16);
        sqr = game.add.graphics(game.rnd.integerInRange(0, game.width), game.rnd.integerInRange(0, game.height), bgGroup);
        sqr.beginFill(0x444444);
        sqr.drawRect(size * -0.5, size * -0.5, size, size); // center the square on its position
        sqr.endFill();
    }

    // create graphics object for drawing proximity circles
    circles = game.add.graphics(0, 0);

    // add rocket
    rocket = game.add.sprite(350, 400, 'rocket');
    rocket.anchor.set(0.5, 0.5);

    // initialize movement variables
    this.velocity = new Vector(0, -1);
    this.direction = 0;

    // create first two planets
    var planet1 = new Planet(game, 500, 300, PLANET_MASS);
    var planet2 = new Planet(game, 100, 200, PLANET_MASS);
    planets = [planet1, planet2];
    // draw circles around planets
    circles.lineStyle(1, 0xFF00FF);
    circles.drawCircle(planets[0].x, planets[0].y, 100);
    circles.drawCircle(planets[1].x, planets[1].y, 100);
    circles.lineStyle(0, 0xFF00FF);

    // add key input to the game
    this.keys = game.input.keyboard.createCursorKeys();

    // create text for score in bottom left
    var scoreStyle = { font: "20px Arial", fill: "#ff0044", align: "left" };
    this.score = game.add.text(25, game.height - 25, "Score: " + score, scoreStyle);

    // create text for game over text in the center
    var gameOverStyle = { font: "50px Arial", fill: "#ff0044", align: "center" };
    this.gameOver = game.add.text(game.world.centerX, game.world.centerY, "", gameOverStyle);
    this.gameOver.anchor.set(0.5);
}

function update() {
    var accelerations = new Array();

    // for each planet, append gravity force to accelerations
    for(i = 0; i < planets.length; i++) {
        dx = rocket.x - planets[i].getX();
        dy = rocket.y - planets[i].getY();
        r = Math.abs(Math.hypot(dx, dy));
        theta = Math.atan(dy / dx);
        mag = calculateGravity(planets[i].getMass(), r);
        if(rocket.x < planets[i].getX()) {
            accelerations.push(new Vector(mag * Math.cos(theta), mag * Math.sin(theta)));
        } else {
            accelerations.push(new Vector(-1 * mag * Math.cos(theta), -1 * mag * Math.sin(theta)));
        }
    }

    // add accelerations to velocity vector
    this.velocity = this.velocity.add(accelerations[0]).add(accelerations[1]);

    // add thrust in forward direction of velocity
    if(this.keys.up.isDown) { // forward thrust
        var unitVector = this.velocity.getUnitVector().getComponents();
        this.velocity = this.velocity.add(new Vector(
            THRUST * unitVector[0],
            THRUST * unitVector[1]));
    } else if(this.keys.down.isDown) { // backward thrust
        var unitVector = this.velocity.getUnitVector().getComponents();
        this.velocity = this.velocity.add(new Vector(
            -1 * THRUST * unitVector[0],
            -1 * THRUST * unitVector[1]));
    }

    // increment position of rocket
    rocket.x += this.velocity.getComponents()[0];
    rocket.y += this.velocity.getComponents()[1];

    // calculate rotation for rocket (in direction of velocity)
    // direction is the radians away from straight up
    if(this.velocity.x >= 0) {
        this.direction = UNIT_J.angleBetween(this.velocity);
    } else {
        this.direction = -1 * UNIT_J.angleBetween(this.velocity);
    }
    rocket.rotation = this.direction;

    // check if rocket has hit planet
    if(planets[0].isOverlapping(rocket.x, rocket.y) || planets[1].isOverlapping(rocket.x, rocket.y)) {
        // pause the game and display game over text
        game.paused = true;
        this.gameOver.setText("GAME OVER!\nPlanets: " + score);
    }

    // check if within proximity of planet
    if(calculateDistance(planets[0]) && (curPlanetIndex === 2 || curPlanetIndex != 0)) {
        curPlanetIndex = 0;
        planets[0].changeColor();
        // replace planet 2
        planets[1].destroy();
        // find good x and y (OPTIMIZE THIS)
        nx = getRandomInt(100, game.width - 100);
        ny = getRandomInt(100, game.height - 100);
        while(Math.abs(nx - planets[0].getX()) + Math.abs(ny - planets[0].getY()) < 400) {
            nx = getRandomInt(100, game.width - 100);
            ny = getRandomInt(100, game.height - 100);
        }
        mass = PLANET_MASS;
        planets[1] = new Planet(game, nx, ny, mass);
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
        curPlanetIndex = 1;
        planets[1].changeColor();
        // replace planet 1
        planets[0].destroy();
        // find good x and y
        nx = getRandomInt(100, game.width - 100);
        ny = getRandomInt(100, game.height - 100);
        while(Math.abs(nx - planets[1].getX()) + Math.abs(ny - planets[1].getY()) < 400) {
            nx = getRandomInt(100, game.width - 100);
            ny = getRandomInt(100, game.height - 100);
        }
        mass = PLANET_MASS;
        planets[0] = new Planet(game, nx, ny, mass);
        score++;
        this.score.setText("Score: " + score);
        // remake proximity circles
        circles.destroy();
        circles = game.add.graphics(0, 0);
        circles.lineStyle(1, 0xFF00FF);
        circles.drawCircle(planets[0].x, planets[0].y, 100);
        circles.lineStyle(0, 0xFF00FF);
    }

    // check bounds
    if(rocket.x < -1 * BUFFER_ZONE || rocket.x > game.width + BUFFER_ZONE || rocket.y < -1 * BUFFER_ZONE || rocket.y > game.height + BUFFER_ZONE) {
        // pause the game and display game over text
        game.paused = true;
        this.gameOver.setText("GAME OVER!\nPlanets: " + score);
    }
}

function render() {
    // display info about the rocket
    game.debug.spriteInfo(rocket, 32, 32);
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
    dx = planet.getX() - rocket.x;
    dy = planet.getY() - rocket.y;
    dist = Math.hypot(dx, dy);

    return dist <= PROXIMITY;
}

// function to calculate random number in range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Planet {
    constructor(game, x, y, mass) {
        this.x = x;
        this.y = y;
        this.mass = mass - 100;
        this.game = game;
        this.planet = game.add.sprite(x, y, 'planetgreen');
        this.planet.anchor.set(0.5, 0.5);
        this.planet.scale.setTo(mass / 600);

        this.mini = game.add.sprite(x * 150 / game.world.width, y * 150 / game.world.height, 'planetgreen');
        this.mini.anchor.set(0.5, 0.5);
        this.mini.scale.setTo((mass/600) * 200 / game.world.width, (mass/600) * 200 / game.world.height);
        this.mini.fixedToCamera = true;
    }

    bringToTop() {
        game.world.bringToTop(this.mini);
    }

    getX() {
        return this.x;
    }

    setX(x) {
        this.x = x;
        this.planet.x = x;
    }

    getY() {
        return this.y;
    }

    setY(y) {
        this.y = y;
        this.planet.y = y;
    }

    getMass() {
        return this.mass;
    }

    setMass(mass) {
        this.mass = mass;
        this.planet.scale.setTo(mass/600 + .3, mass/600 + .3);
    }

    getSprite() {
        return this.planet;
    }

    endGameState() {
        this.mass = 0;
    }

    makeFuelPlanet() {
        this.planet.loadTexture('planetfuel');
    }

    makeStar() {
        this.planet.loadTexture('star');
    }

    // change color of planet to red once the planet has been 'visited'
    changeColorRed() {
        this.planet.loadTexture('planetred');
        this.mini.loadTexture('planetred');
    }

    changeColorGreen() {
        this.planet.loadTexture('planetgreen');
        this.mini.loadTexture('planetgreen');
    }

    changeMiniYellow() {
        this.mini.loadTexture('star');
    }

    destroy() {
        this.planet.destroy();
    }

    isOverlapping(x, y) {
        return Math.hypot(x - this.planet.x, y - this.planet.y) < this.planet.width/2;
    }

    isVisible() {
        return this.planet.inCamera;
    }
}

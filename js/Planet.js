class Planet {
    constructor(game, x, y, mass) {
        this.x = x;
        this.y = y;
        this.mass = mass - 500;
        this.planet = game.add.sprite(x, y, 'planetgreen');
        this.planet.anchor.set(0.5, 0.5);
        this.planet.scale.setTo((mass-700)/800 + .3, (mass-700)/800 + .3);
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
        this.planet.scale.setTo((mass-700)/800 + .3, (mass-700)/800 + .3);
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
    }

    changeColorGreen() {
        this.planet.loadTexture('planetgreen');
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

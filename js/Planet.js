class Planet {
    constructor(game, x, y, mass, fuelPlanet) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.planet = game.add.sprite(x, y, 'planetgreen');
        this.planet.anchor.set(0.5, 0.5);
        this.planet.scale.setTo((mass-700)/800 + .3, (mass-700)/800 + .3);
        if(fuelPlanet) {
            this.planet.loadTexture('planetfuel');
        }
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

    makeFuelPlanet() {
        this.planet.loadTexture('planetfuel');
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
        return this.planet.getBounds().contains(x, y);
    }
}

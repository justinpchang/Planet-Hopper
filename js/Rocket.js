class Rocket {
    constructor(game, x, y, velocity, direction) {
        this.game = game;
        this.rocket = game.add.sprite(x, y, 'rocketoff');
        this.rocket.x = x;
        this.rocket.y = y;
        this.rocket.anchor.set(0.5, 0.5);
        this.rocket.scale.setTo(0.6);
        this.velocity = velocity;
        this.direction = direction;

        /*this.mini = game.add.sprite(x * 150 / game.world.width, y * 150 / game.world.height, 'minimaprocket');
        this.mini.anchor.set(0.5, 0.5);
        this.mini.scale.setTo(0.333333333, 0.333333333);
        this.mini.fixedToCamera = true;*/
    }

    getSprite() {
        return this.rocket;
    }

    getX() {
        return this.rocket.x;
    }

    setX(x) {
        this.rocket.x = x;
    }

    getY() {
        return this.rocket.y;
    }

    setY(y) {
        this.rocket.y = y;
    }

    getVelocity() {
        return this.velocity;
    }

    setVelocity(v) {
        this.velocity = v;
    }

    getDirection() {
        return this.direction;
    }

    setDirection(dir) {
        this.direction = dir;
        this.rocket.rotation = this.direction;
    }

    loadTexture(texture) {
        this.rocket.loadTexture(texture);
    }
}

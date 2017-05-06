class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // add this and given vector
    add(vec) {
        return new Vector(this.x + vec.getComponents()[0], this.y + vec.getComponents()[1]);
    }

    // return components of vector in an array
    getComponents() {
        return [this.x, this.y];
    }

    // return magnitude of vector
    getMagnitude() {
        return Math.hypot(this.x, this.y);
    }

    // return angle in radians between this and given vector
    angleBetween(vec) {
        return Math.acos((this.x * vec.getComponents()[0] + this.y * vec.getComponents()[1])/(this.getMagnitude()*vec.getMagnitude()));
    }

    // return unit vector
    getUnitVector() {
        var magnitude = this.getMagnitude();
        return new Vector(this.x / magnitude, this.y / magnitude);
    }
}

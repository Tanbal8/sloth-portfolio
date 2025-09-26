class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    scale() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    add(other) {
        if (typeof other == "number")
            return new Vector(this.x + other, this.y + other);
        else if (other instanceof Vector)
            return new Vector(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        if (typeof other == "number")
            return new Vector(this.x - other, this.y - other);
        else if (other instanceof Vector)
            return new Vector(this.x - other.x, this.y - other.y);
    }
    multiply(other) {
        if (typeof other == "number")
            return new Vector(this.x * other, this.y * other);
    }
    to_string() {
        return `(${this.x},  ${this.y})`; 
    }
}
export default Vector;
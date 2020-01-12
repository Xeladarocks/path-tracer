class Color {
    static __type__ = this.name;
    constructor(r, g, b) {
        this.__type__ = Color.__type__;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    // Add Adds to the color
    Add(color) {
        return new Color(
            this.r+color.r,
            this.g+color.g,
            this.b+color.b
        )
    }

    // Subtract subtracts from the color
    Subtract(color) {
        return new Color(
            this.r-color.r,
            this.g-color.g,
            this.b-color.b
        )
    }

    // Multiply Multiplies the colors
    Multiply(value) {
        return new Color(
            this.r*value,
            this.g*value,
            this.b*value,
        )
    }

    // Divide Divide the color
    Divide(value) {
        return new Color(
            this.r/value,
            this.g/value,
            this.b/value,
        )
    }

    // Interpolate Interpolates between the colors
    Interpolate(color, value) {
        return new Color(
            this.r+(color.r-this.r)*value,
            this.g+(color.g-this.g)*value,
            this.b+(color.b-this.b)*value,
        )
    }

    // Clamp Clamps the color values to the maximum RGB range
    Clamp() {
        return new Color(
            Math.max(Math.min(this.r, 255), 0),
            Math.max(Math.min(this.g, 255), 0),
            Math.max(Math.min(this.b, 255), 0),
        )
    }
}
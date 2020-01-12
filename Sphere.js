// A Sphere.
class Sphere {
    static __type__ = this.name;

    constructor(position, radius, material, color, texture) {
        this.__type__ = Sphere.__type__;
        this.position = position;
        this.radius = radius;
        this.material = material;
        this.color = color;
        this.texture = texture;
    }

    IntersectRaySphere(ray) {
        var oc = ray.origin.sub(this.position);
        var k1 = ray.direction.dot(ray.direction);
        var k2 = 2*oc.dot(ray.direction);
        var k3 = oc.dot(oc) - this.radius*this.radius;
        var discriminant = k2*k2 - 4*k1*k3;
        if (discriminant < 0) {
            return [Infinity, Infinity];
        }
        var t1 = (-k2 + Math.sqrt(discriminant)) / (2*k1);
        var t2 = (-k2 - Math.sqrt(discriminant)) / (2*k1);
        return [t1, t2];
    }

    // CalculateNormal Calculates the normal of the collision point
    CalculateNormal(collisionPoint) {
        let v = collisionPoint.sub(this.position)
        // v := this.position.sub(collisionPoint)
        return v.normalize()
    }

    // GetColor Gets the color of the sphere
    GetColor(intersect) {
        if (this.texture != null) {
            return this.texture.GetColor(intersect)
        }

        return this.color;
    }
}
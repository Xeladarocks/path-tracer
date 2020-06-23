// Triangle A simple triangle
class Triangle {
    constructor(color, material, texture, v1, v2, v3) {
        this.__type__ = Triangle.name;
        this.color = color;
        this.material = material;
        this.texture = texture;
        this.vertex1 = v1;
        this.vertex2 = v2;
        this.vertex3 = v3;
    }

    // RayIntersects Checks if the ray intersects with the triangle.
    RayIntersects(ray) { // returns boolean
        let edge1 = this.vertex2.sub(this.vertex1)
        let edge2 = this.vertex3.sub(this.vertex1)
        let h = ray.direction.cross(edge2)
        let a = edge1.dot(h)
        if (a > -0.00001 && a < 0.00001) {
            return false
        }
        let f = 1.0 / a
        let s = ray.origin.sub(this.vertex1)
        let u = f * s.dot(h)
        if (u < 0 || u > 1) {
            return false
        }
        let q = s.cross(edge1)
        let v = f * ray.direction.dot(q)
        if (v < 0 || u+v > 1) {
            return false
        }
        let t0 = f * edge2.dot(q)
        if t0 > 0.00001 && t0 < 1/0.00001 {
            return true
        }
        return false
    }

    // CalculateNormal Checks if the ray intersects with the triangle.
    function CalculateNormal(collisionPoint) {
        let edge1 = this.vertex2.sub(this.vertex1)
        let edge2 = this.vertex3.sub(this.vertex1)
        let cross = edge1.CrossProduct(edge2)
        return cross.normalize()
    }

}
Triangle.__type__ = Triangle.name;

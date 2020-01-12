// Triangle A simple triangle
class Triangle {
    constructor(color, material, texture, v1, v2, v3) {
        this.color = color;
        this.material = material;
        this.texture = texture;
        this.vertex1 = v1;
        this.vertex2 = v2;
        this.vertex3 = v3;
    }

    // RayIntersects Checks if the ray intersects with the triangle.
    RayIntersects(ray) { // returns boolean
        let edge1 = this.vertex2.Subtract(this.vertex1)
        let edge2 = this.vertex3.Subtract(this.vertex1)

        let h = ray.direction.Cross(edge2)
        let a = edge1.DotProduct(h)

        if a > -epsilon && a < epsilon {
            return false, Vector3{}
        }

        f := 1.0 / a
        s := ray.origin.Subtract(t.vertex1)
        u := f * s.DotProduct(h)

        if u < 0 || u > 1 {
            return false, Vector3{}
        }

        q := s.CrossProduct(edge1)
        v := f * ray.direction.DotProduct(q)

        if v < 0 || u+v > 1 {
            return false, Vector3{}
        }

        t0 := f * edge2.DotProduct(q)

        if t0 > epsilon && t0 < 1/epsilon {
            return true, ray.origin.Add(ray.direction.MultiplyVal(t0))
        }

        return false, Vector3{}
    }

    // CalculateNormal Checks if the ray intersects with the triangle.
    func (t Triangle) CalculateNormal(collisionPoint Vector3) Vector3 {
        edge1 := t.vertex2.Subtract(t.vertex1)
        edge2 := t.vertex3.Subtract(t.vertex1)

        cross := edge1.CrossProduct(edge2)

        return cross.Normalize()
    }

    // GetColor Gets the color of the triangle
    func (t Triangle) GetColor(intersect Vector3) Color {
        if t.texture != nil {
            return t.texture.GetColor(intersect)
        }

        return t.color
    }

    // GetMaterial Gets the material of the triangle
    func (t Triangle) GetMaterial() Material {
        return t.material
    }

    // GetTexture Gets the texture of the sphere
    func (t Triangle) GetTexture() Texture {
        return t.texture
    }

}
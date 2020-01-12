class Vec3 {
    static __type__ = this.name;
    constructor(x, y, z) {
        this.__type__ = Vec3.__type__;
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        this.z = z != null ? z : 0;
    }
}
Vec3.create = function(x, y, z) {
    return new Vec3(x, y, z);
};
Vec3.fromArray = function(a) {
    return new Vec3(a[0], a[1], a[2]);
};
Vec3.prototype.set = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
};
Vec3.prototype.setVec3 = function(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
};
Vec3.prototype.equals = function(v, tolerance) {
    if (tolerance == undefined) {
        tolerance = 0.0000001;
    }
    return (Math.abs(v.x - this.x) <= tolerance) && (Math.abs(v.y - this.y) <= tolerance) && (Math.abs(v.z - this.z) <= tolerance);
};
Vec3.prototype.add = function(v) {
    return new Vec3(this.x+v.x, this.y+v.y, this.z+v.z);
};
Vec3.prototype.sub = function(v) {
    return new Vec3(this.x-v.x, this.y-v.y, this.z-v.z);
};
Vec3.prototype.scale = function(f) {
    return new Vec3(this.x*f, this.y*f, this.z*f);
};
Vec3.prototype.distance = function(v) {
    var dx = v.x - this.x;
    var dy = v.y - this.y;
    var dz = v.z - this.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
Vec3.prototype.squareDistance = function(v) {
    var dx = v.x - this.x;
    var dy = v.y - this.y;
    var dz = v.z - this.z;
    return dx * dx + dy * dy + dz * dz;
};
Vec3.prototype.simpleDistance = function(v) {
    var dx = Math.abs(v.x - this.x);
    var dy = Math.abs(v.y - this.y);
    var dz = Math.abs(v.z - this.z);
    return Math.min(dx, dy, dz);
};
Vec3.prototype.clone = function() {
    return new Vec3(this.x, this.y, this.z);
};
Vec3.prototype.dup = function() {
    return this.clone();
};
Vec3.prototype.dot = function(b) {
    return this.x * b.x + this.y * b.y + this.z * b.z;
};
Vec3.prototype.cross = function(v) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var vx = v.x;
    var vy = v.y;
    var vz = v.z;
    var fx = y * vz - z * vy;
    var fy = z * vx - x * vz;
    var fz = x * vy - y * vx;
    return new Vec3(fx, fy, fz);
};
Vec3.prototype.addScaled = function(a, f) {
    var fx = this.x + a.x * f;
    var fy = this.y + a.y * f;
    var fz = this.z + a.z * f;
    return new Vec3(fx, fy, fz);
};
Vec3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
Vec3.prototype.lengthSquared = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
};
Vec3.prototype.normalize = function() {
    var len = this.length();
    if (len > 0) {
        return this.scale(1 / len);
    }
    return this;
};
Vec3.prototype.limit = function(s) {
    var len = this.length();
    if (len > s && len > 0) {
        this.scale(s / len);
    }
    return this;
};
Vec3.prototype.lerp = function(v, t) {
    var fx = this.x + (v.x - this.x) * t;
    var fy = this.y + (v.y - this.y) * t;
    var fz = this.z + (v.z - this.z) * t;
    return new Vec3(fx, fy, fz);
};
// Interpolate Interpolates across two vectors
Vec3.prototype.interpolate = function(vector, percent) {
	return new Vec3(
		this.x + (vector.x-this.x)*percent,
		this.y + (vector.y-this.y)*percent,
		this.z + (vector.z-this.z)*percent,
    )
}
Vec3.prototype.transformMat4 = function(m) {
    var x = m.a14 + m.a11 * this.x + m.a12 * this.y + m.a13 * this.z;
    var y = m.a24 + m.a21 * this.x + m.a22 * this.y + m.a23 * this.z;
    var z = m.a34 + m.a31 * this.x + m.a32 * this.y + m.a33 * this.z;
    return new Vec3(x, y, z);
};
Vec3.prototype.transformQuat = function(q) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var qx = q.x;
    var qy = q.y;
    var qz = q.z;
    var qw = q.w;
    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z;
    var fx = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    var fy = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    var fz = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return new Vec3(fx, fy, fz);
};
Vec3.prototype.multiplyMat3 = function(mat) {
    let res = new Vec3();
	res.x += this.x * mat[0][0]
	res.x += this.y * mat[0][1]
	res.x += this.z * mat[0][2]

	res.y += this.x * mat[1][0]
	res.y += this.y * mat[1][1]
	res.y += this.z * mat[1][2]

	res.z += this.x * mat[2][0]
	res.z += this.y * mat[2][1]
	res.z += this.z * mat[2][2]

	return res;
}
Vec3.prototype.toString = function() {
    return "{" + Math.floor(this.x*1000)/1000 + ", " + Math.floor(this.y*1000)/1000 + ", " + Math.floor(this.z*1000)/1000 + "}";
};
Vec3.prototype.hash = function() {
    return 1 * this.x + 12 * this.y + 123 * this.z;
};
Vec3.Zero = new Vec3(0, 0, 0);
Vec3.Up = new Vec3(0, 1, 0);
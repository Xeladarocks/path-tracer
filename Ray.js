class Ray {
	constructor(origin, direction) {
		this.origin = origin;
		this.direction = direction;
	}
}

function bounceToColor(b, sphere_color) {
	let c = (b)*255*light_loss;
	return sphere_color.Subtract(new Color(c, c, c));
}

function GenerateRandomRay(origin, normal, reflectDirection, diffuse) {

	// Create a random direction
	let randomDirection = new Vec3(
		Math.random()*2-1,
		Math.random()*2-1,
		Math.random()*2-1,
	).normalize()

	// If the random direction we generated is pointing into the surface, we negate it so it points within 90 degrees of the surface normal
	if (normal.dot(randomDirection) <= 0) {
		randomDirection = randomDirection.scale(-1);
	}

	// Create a new direction, based on the random direction and the reflect direction, based on how diffuse the material is, by interpolating the directions.
	rayDirection = reflectDirection.interpolate(randomDirection, diffuse);

	return new Ray(
		origin.add(rayDirection.scale(0.01)),
		rayDirection,
	)
}

function random_in_unit_sphere() {
    let p;
    do {
        p = Subtract(MultiplySV(2, [Math.random(), Math.random(), Math.random()]), [1,1,1]);
	} while (LengthSquared(p) >= 1);
    return p;
}

// GetColorAt Gets the color based on the direction that the ray is facing
function GetSkyAt(direction) {
	let s = scene.skybox;
	let dot = s.up.dot(direction);
	
    if (dot < 0) {
        return s.sideColor.Interpolate(s.bottomColor, Math.abs(dot)).Multiply(s.intensity)
    }

    return s.sideColor.Interpolate(s.topColor, dot).Multiply(s.intensity)
}
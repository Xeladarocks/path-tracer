class Renderer {
    static __type__ = this.name;
    constructor(width, height, samples) {
        this.__type__ = Renderer.__type__;
        this.width = width;
        this.height = height;
        this.samples = samples;
    }

    // RenderPixel Returns the color of the pixel
    renderPixel(oray) {
        var local_colors = [];
        var ray = Object.assign( Object.create( Object.getPrototypeOf(oray)), oray);
    
        for (let b = 0; b < recursion_depth; b++) {
            rays_shot++;
            var [object, point] = this.ClosestIntersection(ray, min_dist, max_dist);
            if (object == null) { // hit nothings
                local_colors.push(GetSkyAt(ray.direction))
                break;
            }
            var normal = point.sub(object.position).normalize();
            var sphere_color = object.GetColor(point);
            var lighting = this.computeLighting(point, normal, object);
            sphere_color = sphere_color.Multiply(lighting);
            
            var reflectionDirection = ray.direction.sub(normal.scale(normal.dot(ray.direction)*2), normal).normalize();
            if(object.material.diffuse > 0 || object.material.reflectivity > 0) {
                // value of 0 = mirror reflection    |    value of 1 = full diffusion
                if(object.material.diffuse > 0)
                    var diffuse_amount = object.material.diffuse;
                else
                    var diffuse_amount = 1-object.material.reflectivity;
                    
                if(object.material.reflectivity > 0 && object.material.diffuse > 0) {
                    if(Math.random() < 0.5)diffuse_amount = 1-object.material.reflectivity; // 50% chance of reflecting if there's diffuse
                }

                local_colors.push(bounceToColor(b, sphere_color));
                ray = GenerateRandomRay(point, normal, reflectionDirection, diffuse_amount);
            }
        }

        return AverageColors(local_colors);
    }

    // Find the closest intersection between a ray and the spheres in the scene.
    ClosestIntersection(ray, min_t, max_t) {
        var closest_t = Infinity;
        var closest_sphere = null;
        
        for (var i = 0; i < scene.objects.length; i++) {
            var ts = scene.objects[i].IntersectRaySphere(ray);
            if (ts[0] < closest_t && min_t < ts[0] && ts[0] < max_t) {
                closest_t = ts[0];
                closest_sphere = scene.objects[i];
            }
            if (ts[1] < closest_t && min_t < ts[1] && ts[1] < max_t) {
                closest_t = ts[1];
                closest_sphere = scene.objects[i];
            }
        }
        
        if (closest_sphere) {
            let closest_point = ray.origin.add(ray.direction.scale(closest_t));
            return [closest_sphere, closest_point, closest_t];
        }
        return [null, null, Infinity];
    }

    computeLighting(point, normal, obj) {
        let intensity = 0;
        for(let i = 0; i < scene.lights.length; i++) {
            let light = scene.lights[i];
            if(light.ltype == LightType.AMBIENT) {
                intensity += light.intensity;
            } else {
                let ldir;
                let t_max;
                if(light.ltype == LightType.POINT) {
                    ldir = light.position.sub(point);
                    t_max = 1;
                } else if(light.ltype == LightType.DIRECTIONAL) {
                    ldir = light.position.sub(point);
                    t_max = max_dist;
                }
                // shadow check
                var blocker = this.ClosestIntersection(new Ray(point, ldir), EPSILON, t_max);
                if(blocker[0] != null) { // in shadow
                    continue;
                }

                // diffuse
                var contribution = light.intensity * light.position.sub(point).normalize().dot(normal);
                if(contribution > 0) intensity += contribution;
            }
        }
        return Math.min(1, intensity);
    }
}
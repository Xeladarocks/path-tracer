function draw() {
	for (var x = offset_x; x < width+offset_x; x++) {
		for (var y = offset_y; y < height+offset_y; y++) {
			let col = [];
			for(let s=0; s < sampling; s++) {
				let u, v;
				if(!animationMode && sampling > 1) {
					u = x + Math.random();
					v = y + Math.random();
				} else {
					u = x;
					v = y;
				}
                var direction = CanvasToViewport([u, v]);
				direction = direction.multiplyMat3(scene.camera.rotation.roll);
				direction = direction.multiplyMat3(scene.camera.rotation.pitch);
                direction = direction.multiplyMat3(scene.camera.rotation.yaw);
                let traced_color = renderer.renderPixel(new Ray(scene.camera.origin, direction));
				col.push(traced_color);
            }
            col = AverageColors(col);
			PutPixel(x, y, col.Clamp());
		}
    }
    //scene.objects[0].origin.x += cos(deltaTime)/2
	self.postMessage({canvas_buffer: canvas_buffer, offset_x: offset_x, offset_y: offset_y, rays_shot: rays_shot})
}

self.importScripts("util.js");
self.importScripts("Vec3.js");
self.importScripts("Color.js");

self.importScripts("Light.js");
self.importScripts("Sphere.js");
self.importScripts("Material.js");
self.importScripts("Renderer.js");
self.importScripts("Ray.js");

// Setup an event listener that will handle messages recieved from main.
self.addEventListener('message', function(o) {
    e = JSON.parse(o.data);
    e = argsToClass(e); // revive all classes!

    offset_x = e.offset_x;
    offset_y = e.offset_y;
    renderer = e.renderer;
    width = e.width;
    height = e.height;
    thread_count = e.thread_count;
    scene = e.scene;
    sampling = e.sampling;
    animationMode = e.animationMode;
    viewport_size = e.viewport_size;
    projection_plane_z = e.projection_plane_z;
    min_dist = e.min_dist;
    max_dist = e.max_dist;
    recursion_depth = e.recursion_depth;
    light_loss = e.light_loss;
    LightType = e.LightType;
    EPSILON = e.EPSILON;
    backgroundColor = e.backgroundColor;
    canvas_buffer = new ImageData(width, height);
    rays_shot = 0;

    //console.log(scene.objects)
    
    draw();
}, false);


var classes = [Vec3, Color, Material, Sphere, Renderer, Light];

var class_check_ignore = ["canvas_buffer"]
var class_types = [];
for(let i=0; i < classes.length; i++) {
    if(classes[i].__type__)
        class_types.push(classes[i].__type__)
    else
        throw new Error(`Type is undefined for ${classes[i].name}.`);
}

function argsToClass(d) {
    var l = 0;
    if(isObject(d))
        l = Object.size(d);
    else
        l = d.length;
    for(let i=0; i < l; i++) {
        var element;
        var element_key = null;
        if(isObject(d)) {
            element = Object.values(d)[i];
            element_key = Object.keys(d)[i];
        } else
            element = d[i];
        if(class_check_ignore.includes(element_key))continue;
        if(isObject(element) || Array.isArray(element)) {
            if(isObject(element)) {
                if(element.__type__ != null) {
                    var idx = class_types.indexOf(element.__type__);
                    if(idx == -1) {
                        throw new Error(`Type ${element.__type__} is not defined in classes.`);
                    } else {
                        d[element_key] = argsToClass(element);
                        d[element_key] = new classes[idx](...Object.values(element).slice(1));
                    }
                } else { // is a non-class object
                    d[element_key] = argsToClass(element);
                }
            } else { // is an array
                d[i] = argsToClass(element);
            }
        }
    }
    return d;
}

function isObject(element) {
    return (typeof element === 'object' && element !== null)
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
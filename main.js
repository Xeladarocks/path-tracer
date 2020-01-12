var canvas = document.getElementById("canvas");
var canvas_context = canvas.getContext("2d");
var canvas_buffer = canvas_context.getImageData(0, 0, canvas.width, canvas.height);

LightType = {
    AMBIENT: 0,
    POINT: 1, 
    DIRECTIONAL: 2
};

var EPSILON = 0.000000001;

// Scene setup.
var viewport_size = 1;
var projection_plane_z = 1;
var UP = [0, 1, 0];
var max_dist = 1000000;
var min_dist = 0;
var rays_shot = 0;

// Scene setup.
var scene = {
	camera: {
		origin: new Vec3(0, 1, 0),
		rotation: {
			yaw: [[0,0,0],
				  [0,1,0],
				  [0,0,0]],
			pitch: [[0,0,0],
				    [0,1,0],
				    [0,0,0]],
			roll: [[0,0,0],
				   [0,1,0],
                   [0,0,0]],
        },
        forward: new Vec3(0, 0, 1)
    },
    skybox: {
        up: new Vec3(0, 1, 0),
        topColor: new Color(63, 178, 232),
        bottomColor: new Color(225, 244, 252),
        sideColor: new Color(225, 244, 252),
        intensity: 1
    },
	objects: [
		new Sphere(new Vec3(0, 1, 5), 1, new Material(1, 0, 10, 0, 1), new Color(255, 255, 255), null),
		new Sphere(new Vec3(3.2, 1.8, 5.5), 1.8, new Material(1, 1, 1, 0, 0), new Color(255, 134, 134), null),
		new Sphere(new Vec3(-1.7, 0.7, 4), 0.7, new Material(1, 1, 10, 0, 0), new Color(255, 73, 34), null),
		new Sphere(new Vec3(0.8, 0.4, 2.2), 0.4, new Material(1, 1, 1, 0, 0), new Color(25, 187, 121), null),
	    new Sphere(new Vec3(-0.5, 0.25, 2.8), 0.25, new Material(1, 1, 1, 0, 0), new Color(255,255,0), null),
        
		new Sphere(new Vec3(0, -10000, 5), 10000, new Material(0.7, 1, 1, 0, 1), new Color(225, 244, 252), null)
	],
	lights: [
		new Light(LightType.AMBIENT, 0.5),
		//new Light(LightType.POINT, 0.5, new Vec3(5, 8, 7)),
		new Light(LightType.DIRECTIONAL, 0.5, new Vec3(-5, 5, 0))
	]
}
console.log(scene.objects)

var yaw_rotation = degtorad(0);
setCameraYaw(yaw_rotation);
var pitch_rotation = degtorad(0);
setCameraPitch(pitch_rotation);
var roll_rotation = degtorad(0);
setCameraRoll(roll_rotation);

var animationMode = document.getElementById("animationCheck").checked;
var recursion_depth = document.getElementById("recursionSlider").value;
var sampling = document.getElementById("samplingSlider").value;
var light_loss = document.getElementById("lightLossSlider").value;

const canvasBig = document.getElementById("canvas").width;
const canvasSmall = 200;
const canvas_factors = factors(canvasBig).filter(item => {
    return item <= 16; // sqrt of max amount of threads
});
var renderer = new Renderer(canvas.width, canvas.height, sampling);

document.getElementById("threadCountSlider").max = canvas_factors.length-1;
var thread_count = Math.pow(canvas_factors[document.getElementById("threadCountSlider").value]);
var thread_completion = 0;
var workers = [];
var workers_data = [];

var thisTime, deltaTime, lastTime;

function draw() {
    /* Loop stuff */
    updateKeys(); // update key inputs

    var local_sampling = sampling;
    var local_recursion_depth = recursion_depth;
    if(animationMode) {
        local_sampling = 5;
        local_recursion_depth = 1;

        thisTime = Date.now();
        deltaTime = thisTime - lastTime;
        lastTime = Date.now();
    }

    /*************/
    if(!animationMode)ClearAll();
    rays_shot = 0;

    var twidth = canvas.width / Math.sqrt(thread_count);
    var theight = canvas.height / Math.sqrt(thread_count);
    for(let t=0; t < thread_count; t++) {
        workers[t].postMessage( JSON.stringify({
            offset_x: (t * twidth) % canvas.width,
            offset_y: Math.floor((t*twidth) / canvas.width) * theight,
            width: twidth,
            height: theight,
            renderer: renderer,
            thread_count: thread_count,
            scene: scene,
            sampling: Math.ceil(local_sampling / Math.sqrt(thread_count)),
            animationMode: animationMode,
            viewport_size: viewport_size,
            projection_plane_z: projection_plane_z,
            min_dist: min_dist,
            max_dist: max_dist,
            recursion_depth: local_recursion_depth,
            light_loss: light_loss,
            LightType: LightType,
            EPSILON: EPSILON
        }) );
    }
}

function createWorkers() {
    for(let t=0; t < thread_count; t++) {
        workers.push(new Worker('worker.js'));
		workers[t].addEventListener('message', function(e) {
            if(animationMode) {
                workers_data.push({buffer: e.data.canvas_buffer, x:e.data.offset_x, y:e.data.offset_y});
            } else {
                UpdateCanvas(e.data.canvas_buffer, e.data.offset_x, e.data.offset_y);
            }
			rays_shot += e.data.rays_shot;
			document.getElementById("raysShotConsole").innerHTML = numberWithCommas(rays_shot);
			thread_completion++;
			if(thread_completion >= workers.length) {
				thread_completion = 0;
                //console.log("drawing all")
                if(animationMode)ClearAll(); // clear canvas
				for(let w of workers_data) {
					UpdateCanvas(w.buffer, w.x, w.y)
				}
				workers_data = [];
				if(animationMode) {
                    requestAnimationFrame(draw);
                }
			}
		}, false);
	}
}

window.onload = draw;
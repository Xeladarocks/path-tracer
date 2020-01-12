// html updating inputs & stuff
function updateAnimation(element) {
	animationMode = element.checked;
	var animOff = ["drawButton", "samplingcontainer"];
	var animOn = ["animationControls"]
	if(animationMode) {
	  	for(let e of animOff)
			document.getElementById(e).style.display = "none";
	 	for(let e of animOn)
			document.getElementById(e).style.display = "inline";
		renderer.width = renderer.height = canvas.width = canvas.height = canvasSmall;
		workers_data = [];
		ClearAll();
	} else {
		for(let e of animOn)
			document.getElementById(e).style.display = "none";
	 	for(let e of animOff)
			document.getElementById(e).style.display = "inline";
	  	renderer.width = renderer.height = canvas.width = canvas.height = canvasBig;
	}
	requestAnimationFrame(draw);
}
updateAnimation(document.getElementById("animationCheck"));

function updatethreadCount(value) {
	if(workers.length > 0) {
		for(let t=0; t < thread_count; t++) {
			workers[t].terminate();
		}
		workers = [];
	}

	thread_count = Math.pow(canvas_factors[value], 2);

	createWorkers();
}
function updatethreadValue(value) {
	document.getElementById("threadCountConsole").innerHTML = Math.pow(canvas_factors[value], 2);
}
updatethreadValue(document.getElementById("threadCountSlider").value);
updatethreadCount(document.getElementById("threadCountSlider").value);

function updateRecursion(value) {
	recursion_depth = value;
	document.getElementById("recursionConsole").innerHTML = value;
}
updateRecursion(document.getElementById("recursionSlider").value);

function updateSampling(value) {
	sampling = value*value;
	document.getElementById("samplingConsole").innerHTML = sampling;
}
var getSampling = new URL(window.location.href).searchParams.get("sampling");
if(getSampling) {
	getSampling = Math.sqrt(getSampling);
	document.getElementById("samplingSlider").value = getSampling;
}
updateSampling(document.getElementById("samplingSlider").value);

function updateLightLoss(value) {
	light_loss = value;
	document.getElementById("lightLossConsole").innerHTML = value;
}
updateLightLoss(document.getElementById("lightLossSlider").value);


  

var keys = {left:false,right:false,down:false,up:false,w:false,s:false,a:false,d:false,e:false,q:false};
function updateKeys() {
	let direction;
	let speedModifier = 0.5;
	if(keys.left) {
		yaw_rotation -= degtorad(10);
		setCameraYaw(yaw_rotation);
	}
	if(keys.right) {
		yaw_rotation += degtorad(10);
		setCameraYaw(yaw_rotation);
    }
    if(keys.down) {
		pitch_rotation += 0.1;
		setCameraPitch(pitch_rotation);
	}
	if(keys.up) {
		pitch_rotation -= 0.1;
		setCameraPitch(pitch_rotation);
	}
	if(keys.w) {
		direction = scene.camera.forward.multiplyMat3(scene.camera.rotation.yaw);
		scene.camera.origin = scene.camera.origin.add(direction.scale(speedModifier).scale(deltaTime/50))
	}
	if(keys.s) {
		direction = scene.camera.forward.multiplyMat3(scene.camera.rotation.yaw);
		scene.camera.origin = scene.camera.origin.sub(direction.scale(speedModifier).scale(deltaTime/50))
	}
	if(keys.a) {
		direction = new Vec3(-1, 0, 0).multiplyMat3(scene.camera.rotation.yaw);
		scene.camera.origin = scene.camera.origin.add(direction.scale(speedModifier).scale(deltaTime/50))
	}
	if(keys.d) {
		direction = new Vec3(1, 0, 0).multiplyMat3(scene.camera.rotation.yaw);
		scene.camera.origin = scene.camera.origin.add(direction.scale(speedModifier).scale(deltaTime/50))
    }
    if(keys.e) {
		scene.camera.origin = scene.camera.origin.add(Vec3.Up.scale(speedModifier).scale(deltaTime/50))
    }
    if(keys.q) {
		scene.camera.origin = scene.camera.origin.sub(Vec3.Up.scale(speedModifier).scale(deltaTime/50))
	}
}

document.onkeydown = function(event) {
	switch (event.keyCode) {
	   	case 37: // left arrow
			keys.left = true;
			break;
		case 39: // right arrow
			keys.right = true;
            break;
        case 40: // down arrow
            keys.down = true;
            break;
        case 38: // up arrow
            keys.up = true;
            break;
		case 87: // w
			keys.w = true;
			break;
		case 83: // s
			keys.s = true;
			break;
		case 65: // a
			keys.a = true;
			break;
		case 68: // d
			keys.d = true;
			break;
		case 69: // e
			keys.e = true;
			break;
		case 81: // q
			keys.q = true;
			break;
	}
}
document.onkeyup = function(event) {
	switch (event.keyCode) {
        case 37: // left arrow
            keys.left = false;
            break;
        case 39: // right arrow
            keys.right = false;
            break;
        case 40: // down arrow
            keys.down = false;
            break;
        case 38: // up arrow
            keys.up = false;
            break;
        case 87: // w
            keys.w = false;
            break;
        case 83: // s
            keys.s = false;
            break;
		case 65: // a
			keys.a = false;
			break;
		case 68: // d
			keys.d = false;
			break;
		case 69: // e
			keys.e = false;
			break;
		case 81: // q
			keys.q = false;
			break;
	}
}
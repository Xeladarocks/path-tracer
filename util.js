// AverageColors Finds the average of all of the colors in the array
function AverageColors(colors) {
	var r = 0
	var g = 0
	var b = 0

	length = colors.length;

	for(let i = 0; i < length; i++) {
		r += colors[i].r
		g += colors[i].g
		b += colors[i].b
	}

	let lengthFixed = Math.max(length, 1);

	return new Color(r/lengthFixed, g/lengthFixed, b/lengthFixed);
}

function cos(f) {
	return Math.cos(f)
}
function sin(f) {
	return Math.sin(f)
}
function degtorad(degrees) {
	var pi = Math.PI;
	return degrees * (pi/180);
}


function setCameraYaw(radian) {
	scene.camera.rotation.yaw = [
		[ cos(radian), 0, sin(radian)],
		[           0, 1,           0],
		[-sin(radian), 0, cos(radian)]
	]
}
function setCameraPitch(radian) {
	scene.camera.rotation.pitch = [
		[1,            0,           0],
		[0,  cos(radian), -sin(radian)],
		[0,  sin(radian),  cos(radian)]
  ]
}
function setCameraRoll(radian) {
	scene.camera.rotation.roll = [
		[cos(radian), -sin(radian), 0],
		[sin(radian),  cos(radian), 0],
		[          0,            0, 1]
  ]
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function factors(number) {
	return Array.from(Array(number + 1), (_, i) => i).filter(i => number % i === 0)
}




var CanvasToViewport = function(p2d) {
	return new Vec3(p2d[0] * viewport_size / (width * Math.sqrt(thread_count)) - 0.5,
			p2d[1] * viewport_size / (height * Math.sqrt(thread_count)) - 0.5,
			projection_plane_z); 
}
// Displays the contents of the offscreen buffer into the canvas.
var UpdateCanvas = function(buffer, offset_x, offset_y) {
	canvas_context.putImageData(buffer, offset_x, canvas.height-offset_y-(canvas.height/Math.sqrt(thread_count)));
}
var ClearAll = function() {
	canvas.width = canvas.width;
}
var PutPixel = function(x, y, color) {
	x = x-offset_x;
	y = height-(y-offset_y)-1;
	var idx = (x + y * width)*4;
	canvas_buffer.data[idx++] = color.r;
	canvas_buffer.data[idx++] = color.g;
	canvas_buffer.data[idx++] = color.b;
	canvas_buffer.data[idx++] = 255; // Alpha = 255 (full opacity)
}
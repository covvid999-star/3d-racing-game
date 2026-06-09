import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lights
const sun = new THREE.DirectionalLight(0xffffff,2);
sun.position.set(10,20,10);
sun.castShadow = true;
scene.add(sun);

scene.add(
new THREE.AmbientLight(0xffffff,0.6)
);

// Road
const road = new THREE.Mesh(
new THREE.BoxGeometry(20,1,1000),
new THREE.MeshStandardMaterial({
color:0x333333
})
);

road.receiveShadow = true;
scene.add(road);

// Player Car
const car = new THREE.Mesh(
new THREE.BoxGeometry(2,1,4),
new THREE.MeshStandardMaterial({
color:"red"
})
);

car.position.y = 1;
car.castShadow = true;
scene.add(car);

// Obstacles
const obstacles = [];

for(let i=0;i<30;i++){

const obs = new THREE.Mesh(
new THREE.BoxGeometry(2,2,2),
new THREE.MeshStandardMaterial({
color:"yellow"
})
);

obs.position.set(
(Math.random()*14)-7,
1,
-i*30-50
);

scene.add(obs);
obstacles.push(obs);

}

camera.position.set(0,5,10);

// Game Variables
let speed = 0;
let score = 0;
let gameOver = false;

// Keyboard
const keys = {};

window.addEventListener("keydown",(e)=>{
keys[e.key] = true;
});

window.addEventListener("keyup",(e)=>{
keys[e.key] = false;
});

// Mobile Controls
let moveLeft = false;
let moveRight = false;
let nitroMobile = false;

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const nitroBtn = document.getElementById("nitroBtn");

if(leftBtn){

leftBtn.addEventListener("touchstart",()=>{
moveLeft = true;
});

leftBtn.addEventListener("touchend",()=>{
moveLeft = false;
});

}

if(rightBtn){

rightBtn.addEventListener("touchstart",()=>{
moveRight = true;
});

rightBtn.addEventListener("touchend",()=>{
moveRight = false;
});

}

if(nitroBtn){

nitroBtn.addEventListener("touchstart",()=>{
nitroMobile = true;
});

nitroBtn.addEventListener("touchend",()=>{
nitroMobile = false;
});

}

// Reset Button
const resetBtn =
document.getElementById("reset");

if(resetBtn){

resetBtn.onclick = ()=>{
location.reload();
};

}

// Collision Function
function checkCollision(a,b){

return(
Math.abs(a.position.x-b.position.x)<2 &&
Math.abs(a.position.z-b.position.z)<3
);

}

// Animation Loop
function animate(){

requestAnimationFrame(animate);

if(gameOver){

renderer.render(scene,camera);
return;

}

// Keyboard Driving
if(keys["ArrowUp"])
speed += 0.001;

if(keys["ArrowDown"])
speed -= 0.001;

if(keys["Shift"])
speed += 0.003;

// Mobile Driving
if(moveLeft)
car.position.x -= 0.15;

if(moveRight)
car.position.x += 0.15;

if(nitroMobile)
speed += 0.003;

// Keyboard Steering
if(keys["ArrowLeft"])
car.position.x -= 0.15;

if(keys["ArrowRight"])
car.position.x += 0.15;

// Speed Limits
speed = Math.max(
0,
Math.min(speed,0.5)
);

// Road Limits
car.position.x = Math.max(
-8,
Math.min(8,car.position.x)
);

// Move Car
car.position.z -= speed*5;

// Camera Follow
camera.position.z =
car.position.z + 10;

camera.position.x =
car.position.x;

camera.lookAt(car.position);

// Score
score += speed*10;

const scoreEl =
document.getElementById("score");

if(scoreEl){
scoreEl.textContent =
Math.floor(score);
}

const speedEl =
document.getElementById("speed");

if(speedEl){
speedEl.textContent =
Math.floor(speed*300);
}

// Obstacle Check
for(const obs of obstacles){

if(checkCollision(car,obs)){

gameOver = true;

alert(
"Game Over!\nScore: "+
Math.floor(score)
);

}

}

// Render
renderer.render(
scene,
camera
);

}

animate();

// Resize
window.addEventListener(
"resize",
()=>{

camera.aspect =
window.innerWidth/
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

}
);

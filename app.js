let scene;
let camera;
let renderer;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let mouthMesh;
let isOpening = true;
let mouthOpenAmount = 0;

function main() {
  const canvas = document.querySelector('#c');

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 2;
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.autoClear = false;
  renderer.setClearColor(0x00000, 0.0);

  const earthGeometry = new THREE.SphereGeometry(0.6, 32, 32);

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('texture/earthmap1k.jpg'),
    bumpMap: THREE.ImageUtils.loadTexture('texture/earthbump.jpg'),
    bumpScale: 0.3,
  });

  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earthMesh);

  const sunGeometry = new THREE.SphereGeometry(0.2, 32, 32);

  const sunMaterial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('texture/sunback.jpg'),
    side: THREE.FrontSide,
    shininess: 0,
  });

  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunMesh.position.set(-1, 1, -1);
  scene.add(sunMesh);

  const pointerLight = new THREE.PointLight(0xffffff, 0.9);

  pointerLight.position.set(5, 3, 5);
  scene.add(pointerLight);

  const starGeometry = new THREE.SphereGeometry(800, 64, 64);

  const starMaterial = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('texture/galaxy.jpg'),
    side: THREE.BackSide,
  });

  const starMesh = new THREE.Mesh(starGeometry, starMaterial);
  scene.add(starMesh);

  earthMesh.position.set(0, 0, 0);
  starMesh.position.set(0, 0, 0);

  const mouthTextures = [
    'texture/boca1.png',
    'texture/boca2.png',
  ];

  const mouthGeometry = new THREE.PlaneGeometry(1.2, 0.8);
  const mouthMaterial = new THREE.MeshBasicMaterial({ transparent: true });

  mouthMesh = new THREE.Mesh(mouthGeometry, mouthMaterial);
  scene.add(mouthMesh);

  function handleMouseWheel(event) {
    const delta = Math.sign(event.deltaY);

    const zoomSpeed = 0.1;
    camera.position.z -= delta * zoomSpeed;
  }

  canvas.addEventListener('wheel', handleMouseWheel);

  function onKeyDown(event) {
    switch (event.keyCode) {
      case 38:
        moveForward = true;
        break;
      case 40:
        moveBackward = true;
        break;
      case 37:
        moveLeft = true;
        break;
      case 39:
        moveRight = true;
        break;
    }
  }

  function onKeyUp(event) {
    switch (event.keyCode) {
      case 38:
        moveForward = false;
        break;
      case 40:
        moveBackward = false;
        break;
      case 37:
        moveLeft = false;
        break;
      case 39:
        moveRight = false;
        break;
    }
  }

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  function animate() {
    requestAnimationFrame(animate);
    updateCameraPosition();
    earthMesh.rotation.y -= 0.0015;
    sunMesh.rotation.y += 0.2;
    starMesh.rotation.y += 0.0005;
    moveRandomMouth();
    render();
  }

  function render() {
    renderer.clear();
    renderer.render(scene, camera);
  }

  function updateCameraPosition() {
    const moveSpeed = 0.05;

    if (moveForward) {
      camera.position.z -= moveSpeed;
    }
    if (moveBackward) {
      camera.position.z += moveSpeed;
    }
    if (moveLeft) {
      camera.position.x -= moveSpeed;
    }
    if (moveRight) {
      camera.position.x += moveSpeed;
    }
  }

  function getRandomMouthTexture() {
    const randomIndex = Math.floor(Math.random() * mouthTextures.length);
    return THREE.ImageUtils.loadTexture(mouthTextures[randomIndex]);
  }

  function setRandomMouthPosition() {
    const randomX = Math.random() * 4 - 2;
    const randomY = Math.random() * 4 - 2;
    const randomZ = -10;

    mouthMesh.position.set(randomX, randomY, randomZ);
  }

function moveRandomMouth() {
  const moveSpeed = 0.01;

  const radius = 4.5;
  const angle = Date.now() * 0.0005;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  mouthMesh.position.x = x;
  mouthMesh.position.y = y;

  if (mouthMesh.position.z > 0) {
    setRandomMouthPosition();
    mouthMaterial.map = getRandomMouthTexture();
  }

  if (isOpening) {
    mouthOpenAmount += 0.05;
    if (mouthOpenAmount >= 1) {
      isOpening = false;
      mouthMaterial.map = THREE.ImageUtils.loadTexture(mouthTextures[1]);
    }
  } else {
    mouthOpenAmount -= 1;
    if (mouthOpenAmount <= 0) {
      isOpening = true;
      mouthMaterial.map = THREE.ImageUtils.loadTexture(mouthTextures[0]);
    }
  }

  mouthMesh.scale.set(1.2, 0.8, 1.0);
  mouthMesh.scale.y *= Math.abs(Math.sin(mouthOpenAmount * Math.PI));
}

  setRandomMouthPosition(); // Posicionar la boca inicialmente
  mouthMaterial.map = THREE.ImageUtils.loadTexture(mouthTextures[0]);

  animate();
}

window.onload = main;

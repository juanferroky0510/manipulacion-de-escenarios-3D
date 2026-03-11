import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, controls, scene, renderer;

init();

function init() {

    scene = new THREE.Scene();

    // Fondo oscuro
    scene.background = new THREE.Color(0x335533);

    // Niebla más visible
    scene.fog = new THREE.FogExp2(0x101820, 0.0015);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1200
    );

    camera.position.set(450, 260, 50);

    // CONTROLES

    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);

    controls.enableDamping = true;
    controls.dampingFactor = 0.07;

    controls.screenSpacePanning = false;

    controls.minDistance = 120;
    controls.maxDistance = 650;

    controls.cursorStyle = 'grab';

    controls.maxPolarAngle = Math.PI / 2;

    // GEOMETRÍA (árboles tipo cono)

    const geometry = new THREE.ConeGeometry(10, 35, 4, 1);

    const material = new THREE.MeshPhongMaterial({
        color: 0xff8844,
        flatShading: true
    });

    const mesh = new THREE.InstancedMesh(geometry, material, 600);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < 600; i++) {

        dummy.position.x = Math.random() * 2000 - 1000;
        dummy.position.y = 0;
        dummy.position.z = Math.random() * 2000 - 1000;

        dummy.updateMatrix();

        mesh.setMatrixAt(i, dummy.matrix);

    }

    scene.add(mesh);

    // LUCES

    // Luz principal verde clara
    const dirLight1 = new THREE.DirectionalLight(0xaaffaa, 3);
    dirLight1.position.set(1, 1, 0.5);
    scene.add(dirLight1);

    // Luz secundaria verde más oscura
    const dirLight2 = new THREE.DirectionalLight(0x228844, 2.5);
    dirLight2.position.set(-1, -1, -0.5);
    scene.add(dirLight2);

    // Luz ambiental verde suave
    const ambientLight = new THREE.AmbientLight(0x335533);
    scene.add(ambientLight);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    controls.update();

    render();

}

function render() {

    renderer.render(scene, camera);

}
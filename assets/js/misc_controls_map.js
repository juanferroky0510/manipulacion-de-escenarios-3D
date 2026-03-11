import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { MapControls } from 'three/addons/controls/MapControls.js';

let camera, controls, scene, renderer;

init();

function init() {

    scene = new THREE.Scene();

    // Fondo diferente
    scene.background = new THREE.Color(0x0f1c2e);

    // Más niebla
    scene.fog = new THREE.FogExp2(0x0f1c2e, 0.001);

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

    camera.position.set(0, 250, -450);

    // CONTROLES

    controls = new MapControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.07;

    controls.screenSpacePanning = false;

    controls.minDistance = 120;
    controls.maxDistance = 650;

    controls.maxPolarAngle = Math.PI / 2;

    // GEOMETRIA

    const geometry = new THREE.BoxGeometry();
    geometry.translate(0, 0.5, 0);

    // Color diferente
    const material = new THREE.MeshPhongMaterial({
        color: 0xE6605E,
        flatShading: true
    });

    const mesh = new THREE.InstancedMesh(geometry, material, 600);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < 600; i++) {

        dummy.position.x = Math.random() * 2000 - 1000;
        dummy.position.y = 0;
        dummy.position.z = Math.random() * 2000 - 1000;

        dummy.scale.x = 25;
        dummy.scale.y = Math.random() * 90 + 15;
        dummy.scale.z = 25;

        dummy.updateMatrix();

        mesh.setMatrixAt(i, dummy.matrix);

    }

    scene.add(mesh);

    // LUCES

    const dirLight1 = new THREE.DirectionalLight(0xffd27f, 3);
    dirLight1.position.set(1, 1, 0.5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4477ff, 2.5);
    dirLight2.position.set(-1, -0.5, -1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);

    window.addEventListener('resize', onWindowResize);

    const gui = new GUI();
    gui.add(controls, 'zoomToCursor');
    gui.add(controls, 'screenSpacePanning');

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
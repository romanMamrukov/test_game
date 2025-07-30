import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";
import "https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js";

export function createLevel(scene) {
  // 🌤 Lighting
  const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
  ambientLight.intensity = 0.4;

  const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), scene);
  dirLight.position = new BABYLON.Vector3(30, 50, 30);
  dirLight.intensity = 1;
  dirLight.shadowEnabled = true;

  // ✅ Checker Texture
  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  const checkerTexture = new BABYLON.CheckerboardProceduralTexture("checker", 512, scene);
  checkerTexture.numberOfSquares = 10;
  groundMat.diffuseTexture = checkerTexture;

  // 🌍 Ground
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 60, height: 60 }, scene);
  ground.material = groundMat;
  ground.receiveShadows = true;
  ground.checkCollisions = true;

  // 🎵 Try to load background music
  try {
    new BABYLON.Sound("bgMusic", "./sounds/music.mp3", scene, null, {
      loop: true,
      autoplay: true,
      volume: 0.4
    });
  } catch (e) {
    console.warn("No background music found in ./sounds/music.mp3");
  }

  // 📦 Try to load imported level model
  BABYLON.SceneLoader.ImportMesh(
    "",
    "./models/",
    "level.glb",
    scene,
    (meshes) => {
      meshes.forEach(mesh => {
        mesh.checkCollisions = true;
        if (mesh.receiveShadows !== undefined) mesh.receiveShadows = true;
      });
      console.log("Custom level loaded.");
    },
    null,
    (scene, msg, err) => {
      console.warn("No model found, using default level instead.");

      // Default level blocks
      const ramp = BABYLON.MeshBuilder.CreateBox("ramp", { width: 10, height: 0.5, depth: 10 }, scene);
      ramp.rotation.x = Math.PI / 6;
      ramp.position.set(0, 0.25, -20);
      ramp.checkCollisions = true;

      const platform = BABYLON.MeshBuilder.CreateBox("platform", { width: 10, height: 1, depth: 10 }, scene);
      platform.position.set(15, 0.5, -20);
      platform.checkCollisions = true;

      const building = BABYLON.MeshBuilder.CreateBox("building", { width: 12, height: 5, depth: 12 }, scene);
      building.position.set(-20, 2.5, 20);
      building.checkCollisions = true;

      const upperFloor = BABYLON.MeshBuilder.CreateBox("floor2", { width: 12, height: 0.5, depth: 12 }, scene);
      upperFloor.position.set(-20, 4, 20);
      upperFloor.checkCollisions = true;
    }
  );
}

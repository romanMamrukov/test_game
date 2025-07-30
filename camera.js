import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";

export function setupCameras(scene, player, canvas) {
  const followCam = new BABYLON.FollowCamera("FollowCam", player.position.add(new BABYLON.Vector3(0, 2, -6)), scene);
  followCam.lockedTarget = player;
  followCam.radius = 6;
  followCam.heightOffset = 2;
  followCam.cameraAcceleration = 0.1;
  followCam.maxCameraSpeed = 30;

  const firstCam = new BABYLON.UniversalCamera("fpCam", player.position.clone().add(new BABYLON.Vector3(0, 1.6, 0)), scene);
  firstCam.attachControl(canvas, true);
  firstCam.checkCollisions = true;
  firstCam.applyGravity = false;
  firstCam.ellipsoid = new BABYLON.Vector3(0.3, 0.6, 0.3);
  firstCam.speed = 0; // We'll sync it manually

  let isThirdPerson = true;
  scene.activeCamera = followCam;
  followCam.attachControl(canvas, true);

  scene.onBeforeRenderObservable.add(() => {
    if (!isThirdPerson) {
      firstCam.position = player.position.clone().add(new BABYLON.Vector3(0, 1.6, 0));
    }
  });

  window.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "c") {
      isThirdPerson = !isThirdPerson;
      scene.activeCamera.detachControl(canvas);
      scene.activeCamera = isThirdPerson ? followCam : firstCam;
      scene.activeCamera.attachControl(canvas, true);
    }
  });

  return {
    followCam,
    firstCam,
    getActiveCamera: () => scene.activeCamera,
    isThirdPerson: () => isThirdPerson
  };
}

import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";

export function setupControls(scene, player, getCamera, inputMap) {
  const ray = new BABYLON.Ray();
  let velocityY = 0;
  const gravity = -9.8;
  const jumpForce = 6;
  const groundCheckDistance = 1.1; // allow for ellipsoid offset

  // Get mesh name to skip in raycast
  const playerMeshName = player.name;

  const isGrounded = () => {
    const origin = player.position.clone();
    origin.y += 0.05; // slight offset
    ray.origin = origin;
    ray.direction = new BABYLON.Vector3(0, -1, 0);

    const hit = scene.pickWithRay(ray, mesh => {
      return mesh.checkCollisions && mesh.name !== playerMeshName;
    });

    return hit?.hit && hit.distance <= groundCheckDistance;
  };

  scene.onBeforeRenderObservable.add(() => {
    const delta = scene.getEngine().getDeltaTime() / 1000;
    const speed = inputMap["shift"] ? 6 : 3;

    let inputDir = new BABYLON.Vector3(
      (inputMap["a"] ? -1 : 0) + (inputMap["d"] ? 1 : 0),
      0,
      (inputMap["w"] ? 1 : 0) + (inputMap["s"] ? -1 : 0)
    );

    if (inputDir.lengthSquared() > 0) {
      inputDir = inputDir.normalize();
      const forward = getCamera().getForwardRay().direction;
      const angle = Math.atan2(forward.x, forward.z);
      inputDir = BABYLON.Vector3.TransformCoordinates(inputDir, BABYLON.Matrix.RotationY(angle));
      player.moveWithCollisions(inputDir.scale(speed * delta));
    }

    // Gravity and Jump
    if (isGrounded()) {
      if (inputMap[" "]) {
        velocityY = jumpForce;
      } else {
        velocityY = 0;
      }
    } else {
      velocityY += gravity * delta;
    }

    // Apply vertical movement
    player.moveWithCollisions(new BABYLON.Vector3(0, velocityY * delta, 0));
  });
}

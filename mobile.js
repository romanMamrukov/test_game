import nipplejs from "https://cdn.skypack.dev/nipplejs";

export function setupMobileControls(scene, inputMap, canvas, camera, player) {
  const joystickZone = document.getElementById("cameraArea");
  if (!joystickZone) {
    console.warn("Joystick zone (cameraArea) not found.");
    return;
  }

  const joystick = nipplejs.create({
    zone: joystickZone,
    mode: "static",
    position: { right: "50%", bottom: "10%" },
    color: "blue"
  });

  let direction = null;

  joystick.on("dir", (evt, data) => {
    direction = data.direction?.angle || null;
  });

  joystick.on("end", () => {
    direction = null;
  });

  scene.onBeforeRenderObservable.add(() => {
    if (!direction || !player || typeof camera !== "function") return;

    const activeCamera = camera();
    if (!activeCamera) return;

    const speed = 0.1;
    const forward = activeCamera.getForwardRay().direction;
    const right = BABYLON.Vector3.Cross(forward, BABYLON.Axis.Y).normalize();

    switch (direction) {
      case "up":
        player.moveWithCollisions(forward.scale(speed));
        break;
      case "down":
        player.moveWithCollisions(forward.scale(-speed));
        break;
      case "left":
        player.moveWithCollisions(right.scale(-speed));
        break;
      case "right":
        player.moveWithCollisions(right.scale(speed));
        break;
    }
  });

  // Optional cleanup
  scene.onDisposeObservable.add(() => {
    joystick.destroy();
  });
}

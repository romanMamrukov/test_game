import nipplejs from "https://cdn.jsdelivr.net/npm/nipplejs@0.9.0/dist/nipplejs.esm.js";

export function setupMobileControls(scene, inputMap, canvas, camera) {
  const joystick = nipplejs.create({
    zone: document.getElementById("cameraArea"),
    mode: "static",
    position: { right: '50%', bottom: '10%' },
    color: "blue"
  });

  let direction = null;

  joystick.on("dir", (evt, data) => {
    direction = data.direction ? data.direction.angle : null;
  });

  joystick.on("end", () => {
    direction = null;
  });

  scene.onBeforeRenderObservable.add(() => {
    const speed = 0.1;
    const forward = camera().getForwardRay().direction;
    const right = BABYLON.Vector3.Cross(forward, BABYLON.Axis.Y).normalize();

    if (!direction) return;
    if (direction === "up") player.moveWithCollisions(forward.scale(speed));
    if (direction === "down") player.moveWithCollisions(forward.scale(-speed));
    if (direction === "left") player.moveWithCollisions(right.scale(-speed));
    if (direction === "right") player.moveWithCollisions(right.scale(speed));
  });
}

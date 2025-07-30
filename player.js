import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";

export function createPlayer(scene) {
  const player = BABYLON.MeshBuilder.CreateCapsule("player", { height: 2, radius: 0.4 }, scene);
  player.position = new BABYLON.Vector3(0, 1, 0);
  player.checkCollisions = true;
  player.ellipsoid = new BABYLON.Vector3(0.4, 1, 0.4);
  player.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
  player.applyGravity = true;

  return player;
}

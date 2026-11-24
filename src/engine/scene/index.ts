/*
 * 3D scene engine (lazy chunk). Never import this from code that ships in the main bundle;
 * the WebGL check lives in `./webgl` for that reason.
 */
export { type CameraRigHandle, CameraRig } from "./camera-rig";
export { computeFraming, type Framing, type Padding } from "./framing";
export {
  createLabelElements,
  LabelLayer,
  type LabelElements,
  LabelProjector,
  type SceneLabel,
} from "./labels";
export { SCENE_COLORS } from "./palette";
export { SceneCanvas, type SceneCanvasProps } from "./scene-canvas";
export { SceneView, type SceneViewProps } from "./scene-view";

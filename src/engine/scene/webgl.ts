let cached: boolean | undefined;

/**
 * Whether this browser can create a WebGL context. The probe context is released straight
 * away (browsers cap live contexts) and the answer is cached.
 *
 * Imported by the main bundle, so it must stay free of three.js.
 */
export function isWebGLAvailable(): boolean {
  if (cached !== undefined) return cached;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    cached = Boolean(context);
  } catch {
    cached = false;
  }
  return cached;
}

# ADR-0006: Stylized 3D isometric visual style (not photorealistic)

- **Status:** Accepted (Phase 0 revision, 2026-11-24)

## Context

The original brief said "realistic 3D". The product owner clarified that a **3D isometric view is
sufficient** — realism is not a requirement; clarity is.

## Decision

- Orthographic camera at isometric angles, with limited orbit, pan and zoom.
- All components are **built in code** from simple geometry (rounded boxes, cylinders, panels),
  with matte/soft-shaded materials, crisp outline edges and a small semantic colour palette
  (request = cyan, response = emerald, warning = amber, error = rose, selection = violet).
- No GLTF asset pipeline, no HDR environment maps, no post-processing in the MVP.
- Phase 4 starts with a short look-development spike comparing two isometric styles (e.g. solid
  flat-shaded with outlines vs. glowing line-art) for approval.

## Consequences

- Much lower asset and performance risk; consistent visual language across concepts.
- Visual polish comes from composition, colour semantics, motion and lighting restraint rather
  than detailed models.

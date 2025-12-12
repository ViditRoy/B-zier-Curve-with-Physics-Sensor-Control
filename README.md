# Interactive Bézier Rope Simulation

## Overview
This project demonstrates an interactive cubic Bézier rope simulation that responds to mouse input in real time. The rope dynamically reacts to control point movement using a spring-damping physics model, and tangent vectors are visualized along the curve.

## Math
- **Cubic Bézier curve**:
B(t) = (1 - t)^3 P0 + 3(1 - t)^2 t P1 + 3(1 - t) t^2 P2 + t^3 P3
- **Tangent vector (derivative)**:
B'(t) = 3(1-t)^2 (P1-P0) + 6(1-t) t (P2-P1) + 3 t^2 (P3-P2)
- Curve points are sampled in small increments (t = 0 to 1, step 0.01) for smooth rendering.

## Physics Model
- **Spring-damping system** for dynamic points:
acceleration = -k * (position - target) - damping * velocity
- Velocity is updated each frame and capped to prevent overshoot, giving smooth, rope-like motion.

## Design Choices
- Fully **manual implementation** of Bézier math, tangents, and physics.
- **Interactive control** with mouse dragging.
- Tangent vectors and endpoints visualized for clarity.
- **Responsive canvas** that rescales with window size.
- Rendering uses `requestAnimationFrame` for smooth real-time updates.

## Usage
1. Open `index.html` in a modern browser.
2. Move the mouse or drag points to interact with the rope.
3. Resize the window — the curve adjusts proportionally.

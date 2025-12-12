# B-zier-Curve-with-Physics-Sensor-Control
# Overview
This project demonstrates an interactive cubic Bezier rope simulation

# How the code works
The code is built entirely with vanilla HTML, CSS and JavaScript. Each File has a specific responsibility that contributes to the simulation:

# 1. Index.html
- Creates a full screen element.
- Loads the main.js script.
- Applies the style.css layout.

# 2. style.css
- Ensures the canvas stretches to fill the entire screen.
- Removes default margins so the simulation has a clean fullscreen view.

# 3. main.js
This is where all the logic of the Bezier rope simulation is present.
# Functions:
- bezier(t) -  the point on the curve.
- bezierDeriv(t) - the tangent vector.
These have been sample in small increments.
- requestAnimationFrame(loop) ensures - curve is rendered, tangents are shown, control points are drawn.
Rendering is completely manual without any library functions.
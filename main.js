const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let P0 = { x: 0, y: 0 };
let P3 = { x: 0, y: 0 };
let P1 = { x: 0, y: 0 };
let P2 = { x: 0, y: 0 };
let target1 = { x: 0, y: 0 };
let target2 = { x: 0, y: 0 };
let V1 = { x: 0, y: 0 };
let V2 = { x: 0, y: 0 };
let dragging = null;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const offsetX = Math.min(150, canvas.width / 4);
  const offsetY = Math.min(150, canvas.height / 4);

  P0.x = offsetX;
  P0.y = canvas.height / 2;
  P3.x = canvas.width - offsetX;
  P3.y = canvas.height / 2;

  P1.x = P0.x + offsetX;
  P1.y = P0.y - offsetY;
  P2.x = P3.x - offsetX;
  P2.y = P3.y + offsetY;

  target1.x = P1.x;
  target1.y = P1.y;
  target2.x = P2.x;
  target2.y = P2.y;
}
resize();
window.addEventListener("resize", resize);

function cubicBezier(t, P0, P1, P2, P3) {
  const mt = 1 - t;
  return {
    x: mt*mt*mt*P0.x + 3*mt*mt*t*P1.x + 3*mt*t*t*P2.x + t*t*t*P3.x,
    y: mt*mt*mt*P0.y + 3*mt*mt*t*P1.y + 3*mt*t*t*P2.y + t*t*t*P3.y
  };
}

function cubicBezierDerivative(t, P0, P1, P2, P3) {
  const mt = 1 - t;
  return {
    x: 3*mt*mt*(P1.x - P0.x) + 6*mt*t*(P2.x - P1.x) + 3*t*t*(P3.x - P2.x),
    y: 3*mt*mt*(P1.y - P0.y) + 6*mt*t*(P2.y - P1.y) + 3*t*t*(P3.y - P2.y)
  };
}

function distance(A, B) {
  return Math.hypot(A.x - B.x, A.y - B.y);
}

function springPhysics(P, V, target, k = 0.08, damping = 0.12, maxV = 15) {
  const ax = -k*(P.x - target.x) - damping*V.x;
  const ay = -k*(P.y - target.y) - damping*V.y;
  V.x += ax;
  V.y += ay;
  V.x = Math.max(-maxV, Math.min(V.x, maxV));
  V.y = Math.max(-maxV, Math.min(V.y, maxV));
  P.x += V.x;
  P.y += V.y;
}

canvas.addEventListener("mousedown", e => {
  const r = 20;
  const m = { x: e.clientX, y: e.clientY };
  if (distance(m, P1) < r) dragging = "P1";
  else if (distance(m, P2) < r) dragging = "P2";
});

canvas.addEventListener("mousemove", e => {
  const pos = { x: e.clientX, y: e.clientY };
  if (dragging === "P1") target1 = { ...pos };
  else if (dragging === "P2") target2 = { ...pos };
  else {
    target1 = { x: pos.x, y: pos.y };
    target2 = { x: canvas.width - pos.x, y: canvas.height - pos.y };
  }
});

canvas.addEventListener("mouseup", () => dragging = null);

function drawPoint(P, color="#f5c400") {
  ctx.beginPath();
  ctx.arc(P.x, P.y, 8, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawCurve() {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#0ff";
  ctx.beginPath();
  let p = cubicBezier(0, P0, P1, P2, P3);
  ctx.moveTo(p.x, p.y);
  for (let t = 0; t <= 1; t += 0.01) {
    p = cubicBezier(t, P0, P1, P2, P3);
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

function drawTangents() {
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";
  for (let t = 0; t <= 1; t += 0.1) {
    const p = cubicBezier(t, P0, P1, P2, P3);
    const d = cubicBezierDerivative(t, P0, P1, P2, P3);
    const mag = Math.hypot(d.x, d.y);
    const nx = d.x / mag;
    const ny = d.y / mag;
    const speed = (Math.hypot(V1.x,V1.y) + Math.hypot(V2.x,V2.y)) / 2;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + nx*(25 + speed*2), p.y + ny*(25 + speed*2));
    ctx.stroke();
  }
}

function drawAll() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawCurve();
  drawTangents();
  drawPoint(P0,"#ff0000");
  drawPoint(P3,"#ff0000");
  drawPoint(P1);
  drawPoint(P2);
}

function loop() {
  springPhysics(P1, V1, target1);
  springPhysics(P2, V2, target2);
  drawAll();
  requestAnimationFrame(loop);
}

loop();

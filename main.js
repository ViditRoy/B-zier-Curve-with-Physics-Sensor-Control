const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const P0 = { x: 200, y: canvas.height / 2 };
const P3 = { x: canvas.width - 200, y: canvas.height / 2 };

let P1 = { x: P0.x + 150, y: P0.y - 150 };
let P2 = { x: P3.x - 150, y: P3.y + 150 };

let v1 = { x: 0, y: 0 };
let v2 = { x: 0, y: 0 };

let target1 = { x: P1.x, y: P1.y };
let target2 = { x: P2.x, y: P2.y };

let dragging = null;

canvas.addEventListener("mousedown", e => {
  const r = 20;
  const m = { x: e.clientX, y: e.clientY };
  if (dist(m, P1) < r) dragging = "P1";
  else if (dist(m, P2) < r) dragging = "P2";
});
canvas.addEventListener("mousemove", e => {
  if (dragging === "P1") target1 = { x: e.clientX, y: e.clientY };
  else if (dragging === "P2") target2 = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener("mouseup", () => dragging = null);

canvas.addEventListener("mousemove", e => {
  if (!dragging) {
    target1 = { x: e.clientX, y: e.clientY };
    target2 = { x: canvas.width - e.clientX, y: canvas.height - e.clientY };
  }
});

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function physics() {
  const k = 0.08;
  const d = 0.12;

  let ax1 = -k * (P1.x - target1.x) - d * v1.x;
  let ay1 = -k * (P1.y - target1.y) - d * v1.y;
  v1.x += ax1;
  v1.y += ay1;
  P1.x += v1.x;
  P1.y += v1.y;

  let ax2 = -k * (P2.x - target2.x) - d * v2.x;
  let ay2 = -k * (P2.y - target2.y) - d * v2.y;
  v2.x += ax2;
  v2.y += ay2;
  P2.x += v2.x;
  P2.y += v2.y;
}

function bezier(t, A, B, C, D) {
  const mt = 1 - t;
  return {
    x: mt*mt*mt*A.x + 3*mt*mt*t*B.x + 3*mt*t*t*C.x + t*t*t*D.x,
    y: mt*mt*mt*A.y + 3*mt*mt*t*B.y + 3*mt*t*t*C.y + t*t*t*D.y
  };
}

function bezierDeriv(t, A, B, C, D) {
  const mt = 1 - t;
  return {
    x: 3*mt*mt*(B.x - A.x) + 6*mt*t*(C.x - B.x) + 3*t*t*(D.x - C.x),
    y: 3*mt*mt*(B.y - A.y) + 6*mt*t*(C.y - B.y) + 3*t*t*(D.y - C.y)
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#0ff";
  ctx.beginPath();

  let p = bezier(0, P0, P1, P2, P3);
  ctx.moveTo(p.x, p.y);

  for (let t = 0; t <= 1; t += 0.01) {
    p = bezier(t, P0, P1, P2, P3);
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  ctx.fillStyle = "#f5c400";
  drawPoint(P0);
  drawPoint(P1);
  drawPoint(P2);
  drawPoint(P3);

  for (let t = 0; t <= 1; t += 0.1) {
    const p = bezier(t, P0, P1, P2, P3);
    const d = bezierDeriv(t, P0, P1, P2, P3);
    const m = Math.hypot(d.x, d.y);
    const nx = d.x / m;
    const ny = d.y / m;

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + nx * 25, p.y + ny * 25);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawPoint(p) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
  ctx.fill();
}

function loop() {
  physics();
  draw();
  requestAnimationFrame(loop);
}
loop();

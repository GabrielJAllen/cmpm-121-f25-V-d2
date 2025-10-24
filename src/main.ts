import "./style.css";

document.body.innerHTML = `
  <h1>Current Header</h1>
  <canvas id="canvas" class="canvas"></canvas>
  <p><button id="clear">Clear</button></p>
  <button id="undo">Undo</button>
  <button id="redo">Redo</button>
`;

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const pad = <CanvasRenderingContext2D> canvas.getContext("2d");
const clear = <HTMLButtonElement> document.getElementById("clear");
const undo = <HTMLButtonElement> document.getElementById("undo");
const redo = <HTMLButtonElement> document.getElementById("redo");

const cursor = { x: 0, y: 0, drawing: false };
const lines: [[{ x: number; y: number }]] = [
  <[{ x: number; y: number }]> <unknown> [],
];
const redoLines: [[{ x: number; y: number }]] = [
  <[{ x: number; y: number }]> <unknown> [],
];

let currentLine: [{ x: number; y: number }];

canvas.addEventListener("mousedown", (e) => {
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
  cursor.drawing = true;

  currentLine = <[{ x: number; y: number }]> <unknown> [];
  lines.push(currentLine);
  redoLines.splice(0, redoLines.length);
  currentLine.push({ x: cursor.x, y: cursor.y });

  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
  if (cursor.drawing) {
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    currentLine.push({ x: cursor.x, y: cursor.y });

    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

canvas.addEventListener("mouseup", () => {
  if (cursor.drawing) {
    cursor.drawing = false;
    currentLine = <[{ x: number; y: number }]> <unknown> [];

    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

canvas.addEventListener("drawing-changed", () => {
  pad.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    if (line.length > 0) {
      pad.beginPath();
      const { x, y } = line[0];
      pad.moveTo(x, y);
      for (const { x, y } of line) {
        pad.lineTo(x, y);
      }
      pad.stroke();
    }
  }
});

clear.addEventListener("click", () => {
  lines.splice(0, lines.length);
  canvas.dispatchEvent(new Event("drawing-changed"));
});

undo.addEventListener("click", () => {
  if (lines.length > 0) {
    redoLines.push(<[{ x: number; y: number }]> lines.pop());
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

redo.addEventListener("click", () => {
  if (redoLines.length > 0) {
    lines.push(<[{ x: number; y: number }]> redoLines.pop());
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

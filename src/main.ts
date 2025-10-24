import "./style.css";

document.body.innerHTML = `
  <h1>Current Header</h1>
  <canvas id="canvas" class="canvas"></canvas>
  <p><button id="clear">Clear</button></p>
`;

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const pad = <CanvasRenderingContext2D> canvas.getContext("2d");
const clear = <HTMLButtonElement> document.getElementById("clear");
const cursor = { x: 0, y: 0, drawing: false };

//drawing functions below based off code from https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
canvas.addEventListener("mousedown", (e) => {
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
  cursor.drawing = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (cursor.drawing) {
    drawLine(pad, cursor.x, cursor.y, e.offsetX, e.offsetY);
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (cursor.drawing) {
    drawLine(pad, cursor.x, cursor.y, e.offsetX, e.offsetY);
    cursor.x = 0;
    cursor.y = 0;
    cursor.drawing = false;
  }
});

function drawLine(
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
} //end of code based off of https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event

clear.addEventListener("click", () => {
  pad.clearRect(0, 0, canvas.width, canvas.height);
});

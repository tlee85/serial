let port;
let writer;
let ledState = { on: false };
let brightness = 0;

function setup() {
  createCanvas(400, 400);

  if ("serial" in navigator) {
    // The Web Serial API is supported.
    let button = createButton("connect");
    button.position(0, 0);
    button.mousePressed(connect);
  }
}

function keyTyped() {
  if (key === 'a') {
    ledState.on = !ledState.on;
    serialWrite(ledState);
  }
}

function draw() {
  background(brightness);
}

function serialWrite(jsonObject) {
  if (writer) {
    let value = jsonObject.on ? "1" : "0";
    let encoder = new TextEncoder();
    writer.write(encoder.encode(value));
  }
}

async function connect() {
  port = await navigator.serial.requestPort();

  await port.open({ baudRate: 9600 });

  writer = port.writable.getWriter();

  const reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .getReader();

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    brightness = parseInt(value);
  }
}

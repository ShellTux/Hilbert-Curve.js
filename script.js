var cv;
var ctx;
var points = [];
var order = 1;
var N;
var width;
var height;
var slider1;
var slider2;
var text1;
var text2;
var len;
var counter = 0;

const setup = function() {
  cv = document.querySelector('canvas');
  ctx = cv.getContext('2d');
  cv.background('black');
  slider1 = document.getElementById('order');
  slider1.onchange = reset;
  slider2 = document.getElementById('iterations');
  slider2.onchange = () => text2.innerHTML = `Iterations ${slider2.value}`;
  text1 = document.getElementById('order_a');
  text2 = document.getElementById('iterations_a');

  order = parseInt(slider1.value);
  N = Math.pow(2, 2 * order);
  sqN = Math.pow(2, order);
  points = new Array(N).fill(0);
  len = cv.width / Math.pow(2, order);

  points = points.map((e, i) => hilbert(i));
  draw();
}

window.onload = setup;

const hilbert = function(i) {
  const hilbertcurve = [{
    x: 0,
    y: 0
  }, {
    x: 0,
    y: 1
  }, {
    x: 1,
    y: 1
  }, {
    x: 1,
    y: 0
  }];
  let x = hilbertcurve[i & 3].x;
  let y = hilbertcurve[i & 3].y;
  i = (i >>> 2);

  for (let n = 4; n <= sqN; n *= 2) {
    let n2 = n / 2;
    let temp;
    switch (i & 3) {
      case 0:
        /* case A: left-bottom */
        tmp = x;
        x = y;
        y = tmp;
        break;
      case 1:
        /* case B: left-upper */
        x = x;
        y = y + n2;
        break;
      case 2:
        /* case C: right-upper */
        x = x + n2;
        y = y + n2;
        break;
      case 3:
        /* case D: right-bottom */
        tmp = y;
        y = (n2 - 1) - x;
        x = (n2 - 1) - tmp;
        x = x + n2;
        break;
    }

    i = (i >>> 2);
  }
  return {
    x: len * (x + 0.5),
    y: len * (y + 0.5)
  };
};

const draw = function() {
  for (let i = 0; i < parseInt(slider2.value); i++) {
    if (counter >= N - 1) reset();
    let cor = map(counter, 0, N - 1, 0, 360);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'hsl(' + cor + ', 100%, 50%)';

    let p1 = points[counter + 0];
    let p2 = points[counter + 1];
    ctx.line(p1.x, p1.y, p2.x, p2.y);
    // ctx.fillText(i, p2.x, p2.y);
    counter++;
  }
  setTimeout(draw, 20);
};

const reset = function() {
  counter = 0;
  order++;
  slider1.value = order;
  text1.innerHTML = `Order ${order}`;
  text2.innerHTML = `Iterations ${slider2.value}`;
  setup();
}

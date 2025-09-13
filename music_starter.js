let particles = [];
let initialized = false;
let heartSize = 120;

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  // background color
let bg1 = [82, 1, 1];
let bg2 = [0, 0, 110];

let t = map(other, 0, 100, 0, 1);
let r = lerp(bg1[0], bg2[0], t);
let g = lerp(bg1[1], bg2[1], t);
let b = lerp(bg1[2], bg2[2], t);

// trail
noStroke();
fill(r, g, b, 50);
rect(0, 0, width, height);

  // small hearts
  if (!initialized) {
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: random(width),
        y: random(height),
        dx: -random(1, 3),
        dy: random(-0.5, 0.5),
        baseSize: random(5, 10)
      });
    }
    initialized = true;
  }

  // move small hearts
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < -20) {
      p.x = width + 20;
      p.y = random(height);
    }

    let shake = map(vocal, 0, 100, 0, 5);
    let s = p.baseSize * (1 + 0.01 * vocal * sin(counter * 0.1 + i));
    let sx = p.x + sin(counter * 0.2 + i) * shake;
    let sy = p.y + cos(counter * 0.2 + i) * shake;

    let c1 = color(201, 52, 90);
    let c2 = color(87, 167, 201);
    let amt = constrain(vocal / 100, 0, 1);
    let c = lerpColor(c1, c2, amt);

    noStroke();
    fill(c);
    drawSmallHeart(sx, sy, s);

    if (vocal > 20) {
      fill(c);
      drawingContext.shadowBlur = map(vocal, 20, 100, 5, 20);
      drawingContext.shadowColor = c;
      drawSmallHeart(sx, sy, s * 1.3);
      drawingContext.shadowBlur = 0;
  }
}

  // main heart pulsing
  let pulse = map(drum, 0, 100, 0, 0.3);
  let curHeartSize = heartSize * (1 + pulse);

  drawHeartFlame(width/2, height/2, curHeartSize, drum, counter);

  noStroke();
  fill(252, 109, 142);
  drawHeart(width/2, height/2, curHeartSize);

  fill(224, 38, 59);
  drawHeart(width/2, height/2 - 5, curHeartSize * 0.7);

  let glowAlpha = map(bass, 0, 100, 0, 100);
  fill(245, 183, 201, glowAlpha);
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = color(252, 179, 199, 100);
  drawHeart(width/2, height/2, curHeartSize * 1.2);
  drawingContext.shadowBlur = 0;


  // lyrics
  if (words && words.trim() !== "") {
    textAlign(CENTER, CENTER);
    textFont('Gravitas One');
    textSize(25 + bass / 5);
    fill(255, 225, 217);
    if (bass > 50) {
      fill(0, 0, 0, 100);
      text(words, width/2 + 2, height/6 + 2);
      fill(255, 225, 217);
    }
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'rgba(245, 162, 145, 0.5)';
    text(words, width/2, height/6);
    drawingContext.shadowBlur = 0;
  }
}

function drawSmallHeart(x, y, s) {
  push();
  translate(x, y);
  beginShape();
  vertex(0, 0);
  bezierVertex(-s/3, -s/3, -s*2/3, 0, 0, s*2/3);
  bezierVertex(s*2/3, 0, s/3, -s/3, 0, 0);
  endShape(CLOSE);
  pop();
}

function drawHeart(x, y, s) {
  push();
  translate(x, y);
  beginShape();
  vertex(0, 0);
  bezierVertex(-s/2, -s/2, -s, 0, 0, s);
  bezierVertex(s, 0, s/2, -s/2, 0, 0);
  endShape(CLOSE);
  pop();
}

function drawHeartFlame(x, y, s, drum, counter) {
  let layers = 5;
  let flameIntensity = map(drum, 0, 100, 0.5, 1.5);

  for (let i = 0; i < layers; i++) {
    let layerSize = s * (1.1 + i * 0.15) * flameIntensity;
    let alpha = 150 - i * 30;
    let r = 255, g = 150 - i * 20, b = 50 - i * 10;

    fill(r, g, b, alpha);
    let jitterX = sin(counter * 0.1 + i * 0.5) * 3;
    let jitterY = cos(counter * 0.1 + i * 0.3) * 3;

    drawingContext.shadowBlur = 15 + i * 5;
    drawingContext.shadowColor = color(r, g, b, 100);

    push();
    translate(x + jitterX, y + jitterY);
    beginShape();
    vertex(0, 0);
    bezierVertex(-layerSize/2, -layerSize/2, -layerSize, 0, 0, layerSize);
    bezierVertex(layerSize, 0, layerSize/2, -layerSize/2, 0, 0);
    endShape(CLOSE);
    pop();

    drawingContext.shadowBlur = 0;
  }
}
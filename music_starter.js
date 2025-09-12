// 在函数外部定义粒子数组和初始化标志
let particles = [];
let initialized = false;
let heartBaseSize = 120; // 更大的基础爱心大小

// 可自定义的大爱心颜色
let heartColors = {
  main: [113, 229, 245],     // 主爱心颜色 (RGB)
  highlight: [69, 223, 245], // 高光颜色 (RGB)
  glow: [131, 233, 247]     // 光晕颜色 (RGB)
};

// 可自定义的歌词样式
let lyricsStyle = {
  font: 'Arial Black',          // 默认字体
  color: [255, 225, 217],  // 默认颜色 (白色)
  size: 25                 // 默认大小
};

// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {
  // 使用半透明背景创建拖尾效果
  background(150, 16, 2, 66);
  
  // 初始化粒子系统（只执行一次）
  if (!initialized) {
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: random(width),
        y: random(height),
        size: random(5, 15),
        speedX: -random(2, 4), // 恒定速度向左运动
        speedY: random(-0.5, 0.5),
        color: color(
          random(180, 220), // 更深的红色
          random(100, 140), // 更深的绿色
          random(80, 120),  // 更深的蓝色
          random(100, 200)  // 透明度
        ),
        baseSize: random(5, 15), // 存储原始大小
        baseX: random(width), // 存储原始位置用于震动效果
        baseY: random(height),
        pulse: 0 // 粒子脉冲状态
      });
    }
    initialized = true;
  }
  
  // 更新和绘制背景粒子
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // 更新粒子位置 - 恒定速度向左运动
    p.x += p.speedX;
    p.y += p.speedY;
    
    // 边界检查 - 如果粒子超出画布，从右侧重新进入
    if (p.x < -20) {
      p.x = width + 20;
      p.y = random(height);
      p.baseX = p.x; // 更新基础位置
      p.baseY = p.y;
    }
    if (p.y < -20) {
      p.y = height + 20;
      p.baseY = p.y;
    }
    if (p.y > height + 20) {
      p.y = -20;
      p.baseY = p.y;
    }
    
    // 粒子震动效果 - 随人声音量变化
    let pulseIntensity = map(vocal, 0, 100, 0, 0.8);
    p.pulse = sin(counter * 0.1 + i * 0.1) * pulseIntensity;
    
    // 计算当前粒子大小
    let currentSize = p.baseSize * (1 + p.pulse);
    
    // 粒子位置震动效果
    let shakeIntensity = map(vocal, 0, 100, 0, 5);
    let shakeX = sin(counter * 0.2 + i * 0.1) * shakeIntensity;
    let shakeY = cos(counter * 0.2 + i * 0.1) * shakeIntensity;
    
    // 绘制爱心粒子
    noStroke();
    let alpha = map(vocal, 0, 100, 50, 255);
    fill(red(p.color), green(p.color), blue(p.color), alpha);
    
    // 绘制爱心形状（添加震动效果）
    drawParticleHeart(p.x + shakeX, p.y + shakeY, currentSize);
    
    // 添加光晕效果（随人声音量变化）
    if (vocal > 20) {
      let glowAlpha = map(vocal, 20, 100, 20, 100);
      let glowSize = map(vocal, 20, 100, 1.2, 1.5);
      
      fill(red(p.color), green(p.color), blue(p.color), glowAlpha);
      drawingContext.shadowBlur = map(vocal, 20, 100, 5, 20);
      drawingContext.shadowColor = color(red(p.color), green(p.color), blue(p.color), 80);
      drawParticleHeart(p.x + shakeX, p.y + shakeY, currentSize * glowSize);
      drawingContext.shadowBlur = 0;
    }
  }
  
  // 中心爱心大小随鼓点震动 - 减小震动幅度
  let heartPulse = map(drum, 0, 100, 0, 0.3); // 减小震动幅度
  let currentHeartSize = heartBaseSize * (1 + heartPulse);
  
  // 绘制爱心形状的火焰效果
  drawHeartFlame(width/2, height/2, currentHeartSize, drum, counter);
  
  // 绘制中心爱心
  noStroke();
  
  // 主爱心 - 使用自定义颜色
  fill(heartColors.main[0], heartColors.main[1], heartColors.main[2]);
  drawHeart(width/2, height/2, currentHeartSize);
  
  // 添加内部高光 - 使用自定义颜色
  fill(heartColors.highlight[0], heartColors.highlight[1], heartColors.highlight[2]);
  drawHeart(width/2, height/2 - 5, currentHeartSize * 0.7);
  
  // 添加光晕效果（随贝斯音量变化）- 使用自定义颜色
  let glowAlpha = map(bass, 0, 100, 0, 100);
  fill(heartColors.glow[0], heartColors.glow[1], heartColors.glow[2], glowAlpha);
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = color(heartColors.glow[0], heartColors.glow[1], heartColors.glow[2], 100);
  drawHeart(width/2, height/2, currentHeartSize * 1.2);
  drawingContext.shadowBlur = 0;
  
  // 显示歌词
  if (words && words.trim() !== "") {
    // 使用自定义字体
    textFont(lyricsStyle.font);
    textAlign(CENTER, CENTER);
    
    // 文字大小随人声音量变化，但基于自定义的基础大小
    let textSizeValue = lyricsStyle.size + (vocal / 5);
    textSize(textSizeValue);
    
    // 使用自定义文字颜色
    fill(lyricsStyle.color[0], lyricsStyle.color[1], lyricsStyle.color[2]);
    
    // 添加文字阴影效果
    if (bass > 50) {
      fill(0, 0, 0, 100);
      text(words, width/2 + 2, height/6 + 2);
      fill(lyricsStyle.color[0], lyricsStyle.color[1], lyricsStyle.color[2]);
    }
    
    // 添加文字描边效果，使其更加酷炫
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'rgba(245, 162, 145, 0.5)';
    
    // 确保歌词在画布可见区域内
    let textY = constrain(height/6, 40, height - 100);
    text(words, width/2, textY);
    
    // 重置阴影
    drawingContext.shadowBlur = 0;
  }
}

// 绘制粒子爱心
function drawParticleHeart(x, y, size) {
  push();
  translate(x, y);
  beginShape();
  vertex(0, 0);
  bezierVertex(-size/3, -size/3, -size*2/3, 0, 0, size*2/3);
  bezierVertex(size*2/3, 0, size/3, -size/3, 0, 0);
  endShape(CLOSE);
  pop();
}

// 绘制中心爱心
function drawHeart(x, y, size) {
  push();
  translate(x, y);
  beginShape();
  vertex(0, 0);
  bezierVertex(-size/2, -size/2, -size, 0, 0, size);
  bezierVertex(size, 0, size/2, -size/2, 0, 0);
  endShape(CLOSE);
  pop();
}

// 绘制爱心形状的火焰效果
function drawHeartFlame(x, y, size, drum, counter) {
  // 火焰层数
  let layers = 5;
  
  // 根据鼓点调整火焰强度
  let flameIntensity = map(drum, 0, 100, 0.5, 1.5);
  
  for (let i = 0; i < layers; i++) {
    let layerSize = size * (1.1 + i * 0.15) * flameIntensity;
    let alpha = 150 - i * 30;
    
    // 火焰颜色从红色到黄色渐变
    let r = 255;
    let g = 150 - i * 20;
    let b = 50 - i * 10;
    
    fill(r, g, b, alpha);
    
    // 添加火焰抖动效果
    let jitterX = sin(counter * 0.1 + i * 0.5) * 3;
    let jitterY = cos(counter * 0.1 + i * 0.3) * 3;
    
    // 绘制爱心形状的火焰层
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

// 修改大爱心颜色的函数
function setHeartMainColor(r, g, b) {
  heartColors.main = [r, g, b];
}

function setHeartHighlightColor(r, g, b) {
  heartColors.highlight = [r, g, b];
}

function setHeartGlowColor(r, g, b) {
  heartColors.glow = [r, g, b];
}

// 修改歌词样式的函数
function setLyricsFont(fontName) {
  lyricsStyle.font = fontName;
}

function setLyricsColor(r, g, b) {
  lyricsStyle.color = [r, g, b];
}

function setLyricsSize(size) {
  lyricsStyle.size = size;
}

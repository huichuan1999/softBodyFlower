// Coding Train / Daniel Shiffman

const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;

const { GravityBehavior } = toxi.physics2d.behaviors;

const { Vec2D, Rect } = toxi.geom;

let physics;
let particles = [];
let springs = [];
let draggedParticle = null;
let particleGrabRadius = 15;
let centerParticle;

function setup() {
  createCanvas(windowWidth, windowHeight);

  physics = new VerletPhysics2D();
  physics.setWorldBounds(new Rect(0, 0, width, height));

  createSymmetricalFlower();
}

function createSymmetricalFlower() {
  let nPetals = 20;
  let angleStep = TWO_PI / nPetals;
  let radius = 100;
  let centerX = width / 2;
  let centerY = height / 2;

  centerParticle = new VerletParticle2D(new Vec2D(centerX, centerY));
  physics.addParticle(centerParticle);
  particles.push(centerParticle);

  for (let i = 0; i < nPetals; i++) {
    let angle = i * angleStep;
    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);
    let particle = new VerletParticle2D(new Vec2D(x, y));
    particles.push(particle);
    physics.addParticle(particle);

    let centerSpring = new VerletSpring2D(centerParticle, particle, radius, 0.01);
    springs.push(centerSpring);
    physics.addSpring(centerSpring);

    if (i > 0) {
      let spring = new VerletSpring2D(particles[i + 1], particles[i], 2 * radius * sin(angleStep / 2), 0.01);
      springs.push(spring);
      physics.addSpring(spring);
    }
  }

  let lastSpring = new VerletSpring2D(particles[1], particles[nPetals], 2 * radius * sin(angleStep / 2), 0.01);
  springs.push(lastSpring);
  physics.addSpring(lastSpring);
}

function draw() {
  background(240);

  // Draw petals
  noStroke();
  fill(255, 255, 255, 128);
  beginShape();
  for (let i = 1; i < particles.length; i++) {
    vertex(particles[i].x, particles[i].y);
  }
  endShape(CLOSE);

  stroke(0);
  for (let spring of springs) {
    line(spring.a.x, spring.a.y, spring.b.x, spring.b.y);
  }

  for (let particle of particles) {
    ellipse(particle.x, particle.y, 10, 10);
  }

  if (draggedParticle !== null) {
    draggedParticle.set(mouseX, mouseY);
  }

  physics.update();
}

function mousePressed() {
  for (let particle of particles) {
    let d = dist(mouseX, mouseY, particle.x, particle.y);
    if (d < particleGrabRadius) {
      draggedParticle = particle;
      break;
    }
  }
}

function mouseReleased() {
  draggedParticle = null;
}

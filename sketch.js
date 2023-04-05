let s;
let scl = 20;
let food;
let playfield = 600;
let slider;
let snakeSpeed;
let apple;
let sky;

function setup() {
  createCanvas(playfield, 640);

  background(50);

  s = new Snake();

  pickLocation();

  setDifficelt();

  apple = loadImage(
    "https://raw.githubusercontent.com/day421/SnakeGame/main/image/apple.png"
  );

  sky = loadImage(
    "https://raw.githubusercontent.com/day421/SnakeGame/main/image/sky.jpg"
  );
}

function draw() {
  snakeSpeed = round(slider.value() * (1 + s.score * 0.08), 3);

  frameRate(snakeSpeed);

  background(sky);

  scoreboard();

  if (s.eat(food)) {
    pickLocation();
  }

  s.death();
  s.update();
  s.show();

  fill(255, 0, 100);
  image(apple, food.x, food.y, scl, scl);
}

function pickLocation() {
  let cols = floor(playfield / scl);
  let rows = floor(playfield / scl);

  food = createVector(floor(random(cols)), floor(random(rows)));

  food.mult(scl);

  for (let i = 0; i < s.tail.length; i++) {
    let pos = s.tail[i];

    let d = dist(food.x, food.y, pos.x, pos.y);

    if (d < 1) {
      pickLocation();
    }
  }
}

function scoreboard() {
  fill(0);
  rect(0, 600, 600, 40);

  textFont("Consolas");
  textSize(18);

  fill(255);
  if (s.score == s.highscore) fill(255, 215, 0);
  text("Score: " + s.score, 10, 625);

  fill(255);
  text("Highscore: " + s.highscore, 450, 625);

  fill(255);
  text("Speed: " + snakeSpeed, 290, 625);
}

function keyPressed() {
  if (keyCode === UP_ARROW) s.dir(0, -1);
  else if (keyCode === DOWN_ARROW) s.dir(0, 1);
  else if (keyCode === RIGHT_ARROW) s.dir(1, 0);
  else if (keyCode === LEFT_ARROW) s.dir(-1, 0);
}

function Snake() {
  this.x = 0;
  this.y = 0;

  this.xspeed = 1;
  this.yspeed = 0;

  this.total = 0;

  this.tail = [];

  this.score = 1;
  this.highscore = 1;

  this.dir = function (x, y) {
    this.xspeed = x;
    this.yspeed = y;
  };

  this.eat = function (pos) {
    let d = dist(this.x, this.y, pos.x, pos.y);

    if (d < 1) {
      this.total++;
      this.score++;

      if (this.score > this.highscore) {
        this.highscore = this.score;
      }

      return true;
    } else {
      return false;
    }
  };

  this.death = function () {
    for (let i = 0; i < this.tail.length; i++) {
      let pos = this.tail[i];

      let d = dist(this.x, this.y, pos.x, pos.y);

      if (d < 1) {
        this.total = 0;
        this.score = 0;

        this.tail = [];
      }
    }
  };

  this.update = function () {
    if (this.total == this.tail.length) {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }

    this.tail[this.total - 1] = createVector(this.x, this.y);

    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;

    this.x = constrain(this.x, 0, playfield - scl);
    this.y = constrain(this.y, 0, playfield - scl);
  };

  this.show = function () {
    for (let i = 0; i < this.tail.length; i++) {
      if (i % 2 == 0) {
        fill(255);
      } else {
        fill(60, 179, 113);
      }
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }

    if (this.tail.length % 2 == 0) {
      fill(255);
    } else {
      fill(60, 179, 113);
    }
    rect(this.x, this.y, scl, scl);
  };
}

function setDifficelt() {
  slider = createSlider(1, 20, 10);
  slider.position(150, 608);
  slider.style("width", "80px");
}

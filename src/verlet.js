class Verlet {
  constructor(canvas) {
    this.points = [];
    this.sticks = [];
    this.mouse = {x: 0, y: 0, drag: false};
    this.canvas = canvas;

    this.init();
  }

  init() {
    document.addEventListener('mousemove', e => {
      const rect = this.canvas.canvas.getBoundingClientRect();
    	this.mouse.x = e.pageX - rect.left - window.scrollX;
      this.mouse.y = e.pageY - rect.top - window.scrollY;
    });
    document.addEventListener('mousedown', e => this.mouse.drag = true);
    document.addEventListener('mouseup', e => this.mouse.drag = false);
    document.addEventListener('touchstart', e => this.mouse.drag = true);
    document.addEventListener('touchend', e => this.mouse.drag = false);
    document.addEventListener('touchmove', e => {
    	e.preventDefault();
    	const rect = this.canvas.canvas.getBoundingClientRect();
      this.mouse.x = e.changedTouches[0].pageX - rect.left - window.scrollX;
      this.mouse.y = e.changedTouches[0].pageY - rect.top - window.scrollY;
    });
  }

  createCloth(row = 25, col = 25, gap = 15) {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (i === 0 && j % 4 === 0) {
          this.points.push(new Point(j * gap + 200, i * 0 + 10, true));
        }
        else {
          this.points.push(new Point(j * gap + 200, i * 0 + 10));
        }
      }
    }

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (j != col - 1) this.sticks.push(new Stick(this.points[j + col * i], this.points[j + col * i + 1], gap));
        if (i != row - 1) this.sticks.push(new Stick(this.points[j + col * i], this.points[j + col * (i + 1)], gap));
      }
    }
  }

  constrain() {
    this.points.forEach(e => e.constrain(this.canvas));
  }

  updatePoints() {
    this.points.forEach(e => e.update());
  }

  updateSticks() {
    this.sticks.forEach(e => e.adjust());
  }

  render() {
    this.canvas.lineWidth(1);
    this.sticks.forEach(e => {
      const length = Vector.sub(e.p1.pos, e.p2.pos).getMag();
      const color = this._map(length, e.length, e.length+5, 250, 360);
      this.canvas.stroke(`hsl(${color}, 100%, 50%, 1)`);
      e.display(this.canvas);
    });
  }
  
  // https://lucidar.me/en/mathematics/check-if-a-point-belongs-on-a-line-segment/
  cutSticks() {
    this.sticks.forEach((element, index) => {
      const ab = Vector.sub(element.p1.pos, element.p2.pos);
      const ac = Vector.sub(element.p1.pos, this.mouse);

      if (this.mouse.drag && Math.abs(Vector.cross(ab, ac)) < 50) {
        const kac = Vector.dot(ab, ac);
        const kab = Vector.dot(ab, ab);

        if (kac > 0 && kab > kac) {
          this.sticks.splice(index, 1);
        }
      }
    });
  }

  animate() {
    this.canvas.clear();
    
    this.cutSticks();
    this.updatePoints();
    for (let j = 0; j < 3; j++) {
      this.updateSticks();
    }
    this.constrain();
    this.render();

    window.requestAnimationFrame(this.animate.bind(this));
  }

  _map(n, start1, stop1, start2, stop2) {
    const result = (n - start1) * (stop2 - start2) / (stop1 - start1) + start2;
    return result < start2 ? start2 : (result > stop2 ? stop2 : result);
  }
}
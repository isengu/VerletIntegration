class Point {
	constructor(x = 100, y = 100, locked = false) {
		this.pos = new Vector(x, y);
		this.prevPos = new Vector(x, y);
		this.locked = locked;
	}
	update() {
		if(!this.locked){
			const velocity = Vector.sub(this.pos, this.prevPos);
			velocity.y += gravity;

			this.prevPos.x = this.pos.x;
			this.prevPos.y = this.pos.y;

			this.pos.add(velocity);
		}
	}
	constrain() {
		const velocity = Vector.sub(this.pos, this.prevPos);

		if(this.pos.x > canvas.width) {
			this.pos.x = canvas.width;
			this.prevPos.x = this.pos.x + velocity.x;
		}
		if(this.pos.x < 0) {
			this.pos.x = 0;
			this.prevPos.x = this.pos.x + velocity.x;
		}
		if(this.pos.y > canvas.height) {
			this.pos.y = canvas.height;
			this.prevPos.y = this.pos.y + velocity.y;
		}
		if(this.pos.y < 0) {
			this.pos.y = 0;
			this.prevPos.y = this.pos.y + velocity.y;
		}
	}
	display() {
		canvas.circle(this.pos.x, this.pos.y, 2);
	}
}
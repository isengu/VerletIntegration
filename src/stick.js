class Stick {
	constructor(p1, p2, length) {
		this.p1 = p1;
		this.p2 = p2;
		this.length = length;
	}
	adjust() {
		const dir = Vector.sub(this.p1.pos, this.p2.pos);
		const dist = dir.getMag();

		const percent = (this.length - dist) / dist / 2;
		const offset = dir.multiply(percent);

		if(!this.p1.locked){
			this.p1.pos.add(offset);
		}
		if(!this.p2.locked){
			this.p2.pos.sub(offset);
		}
	}
	display() {
		canvas.line(this.p1.pos.x, this.p1.pos.y, this.p2.pos.x, this.p2.pos.y);
	}
}
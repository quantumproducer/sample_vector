Thing.prototype.draw = function(client, context) {
	context.fillStyle = 'blue';
	context.arc(this.x, this.y, 30, 0, 2 * Math.PI, false);	
	context.fill();
};

Laser.prototype.draw = function(client, context) {
	context.lineWidth = Laser.lineWidth;
	context.beginPath();
	context.moveTo(this.x - this.mx * 2, this.y - this.my * 2);
	context.lineTo(this.x + this.mx * 2, this.y + this.my * 2);
	context.strokeStyle = this.teamColor;
  context.closePath();
	context.stroke();
}


Title.prototype.draw = function(client, context) {
	context.font = '23pt Courier New';
	var style = context.fillStyle;
	context.fillStyle = Exoslicer.color();
	context.fillText(this.text(), client.canvas.width / 2, client.canvas.height - 40);	
	context.fillStyle = style;
}

Menu.prototype.draw = function(client, context) {
	var y = client.canvas.height * 0.5;
	var h = 30;
	
	context.font = '14pt Courier New';
	for (var i = 0; i < this.options.length; i++) {
		var o = this.options[i];
		if (i == this.index) {
			context.fillStyle = Exoslicer.color();
		} else {
			context.fillStyle = 'white';		
		}
		var t = o.text();
		context.fillText(t, client.canvas.width / 2, y);			
		context.fillStyle = 'white';
		

		if (i == this.index) {
			var spacing = client.canvas.width * 0.3;
			context.strokeStyle = 'white';
			var x = client.canvas.width / 2 - spacing;
			var segment = 6;
			var yOffset = -6;
			context.beginPath();
			context.moveTo(x - segment, y - segment + yOffset);
			context.lineTo(x, y + yOffset);
			context.lineTo(x - segment, y + segment + yOffset);
			x = client.canvas.width / 2 + spacing;
			context.moveTo(x + segment, y - segment + yOffset);
			context.lineTo(x, y + yOffset);
			context.lineTo(x + segment, y + segment + yOffset);
			context.stroke();
		}

		y+= h;
	}
}

TitleBorder.prototype.draw = function(client, context) {
	context.beginPath();
	context.strokeStyle = 'white';
	context.lineWidth = 2;
	context.moveTo(0, 0);
	context.lineTo(0, client.canvas.height);
	context.lineTo(client.canvas.width, client.canvas.height);
	context.lineTo(client.canvas.width, 0);
	context.lineTo(0, 0);
	context.stroke();
	context.lineWidth = Ship.lineWidth;
}

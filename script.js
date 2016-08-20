drawThing = function(client, context, thing, vertexes, scale, contextFn) {
  var start = vertexes[0];
  context.beginPath();
  context.moveTo(thing.x + (start[0] * scale), thing.y + (start[1] * scale));
  for (var i = 0; i < vertexes.length; i++) {
    var vertex = vertexes[i];
    context.lineTo(thing.x + (vertex[0] * scale), thing.y + (vertex[1] * scale));
  }
  context.lineTo(thing.x + (start[0] * scale), thing.y + (start[1] * scale));
  context[contextFn]();
  context.closePath();
}

drawThing2 = function(client, context, thing, vertexes, scale, contextFn) {
  var start = vertexes[0];
  context.beginPath();
  context.moveTo((start[0] * scale), (start[1] * scale));
  for (var i = 0; i < vertexes.length; i++) {
    var vertex = vertexes[i];
    context.lineTo((vertex[0] * scale),(vertex[1] * scale));
  }
  context.lineTo((start[0] * scale),(start[1] * scale));
  context[contextFn]();
  context.closePath();
}

strokeT = function(client, context, thing, vertexes, scale) {
  drawThing(client, context, thing, vertexes, scale, 'stroke');
}

strokeT2 = function(client, context, thing, vertexes, scale) {
  drawThing2(client, context, thing, vertexes, scale, 'stroke');
}

fillT = function(client, context, thing, vertexes, scale) {
  drawThing(client, context, thing, vertexes, scale, 'fill');
}

fillT2 = function(client, context, thing, vertexes, scale) {
  drawThing2(client, context, thing, vertexes, scale, 'fill');
}


usingGamepad = function(input) {
   return (input.x < 0 || input.y > 0 || input.x > 0 || input.y < 0 || input.buttons[0].pressed || input.buttons[1].pressed || input.buttons[2].pressed || input.buttons[3].pressed || input.buttons[4].pressed || input.buttons[5].pressed || input.buttons[8].pressed || input.buttons[9].pressed || input.buttons[12].pressed || input.buttons[13].pressed || input.buttons[14].pressed || input.buttons[15].pressed);
}

interpolateGamepad = function(input) {
  var x = input.x;
  var y = input.y;

  var sum = Math.abs(x) + Math.abs(y);
  if (sum <= 0) {
    return input;
  }

  if (sum < 1.732050808) {
    return {'x' : x, 'y': y, 'buttons' : input.buttons };    
  }

  var xRatio = Math.abs(x) / sum;
  var yRatio = Math.abs(y) / sum;

  x = xRatio * x;
  y = yRatio * y;

  return {'x' : x, 'y': y, 'buttons' : input.buttons };
}

getDistance = function(a, b) {
  var x = ((a.x - b.x) * (a.x - b.x));
	var y = ((a.y - b.y) * (a.y - b.y));
	if (x + y == 0){
    return 0;
	}
	return Math.sqrt((x+y));
}

polygonContainsPoint = function(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point['x'];
    var y = point['y'];

    if (x > vs[0][0] + 56 || x < vs[0][0] - 56 || y > vs[0][1] + 56 || y < vs[0][1] - 56) {
			return false;
		}    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
        	inside = !inside;
        }
    }
    
    return inside;
};

 wrapText = function(context, text, x, y, maxWidth, lineHeight) {
            var words = text.split(' ');
            var line = '';
    
            for (var n = 0; n < words.length; n++) {
              var testLine = line + words[n] + ' ';
              var metrics = context.measureText(testLine);
              var testWidth = metrics.width;
              if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
              } else {
                line = testLine;
              }
            }
            context.fillText(line, x, y);
          }

dw = function(x) {
  return x / Thing.fw * Thing.cw;
}

dh = function(y) {
  return y / Thing.fh * Thing.ch;
  this.fh * this.ch;
}

rotate_point = function(pointX, pointY, originX, originY, angle) {
    angle = angle * Math.PI / 180.0;
    return {
        x: Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
        y: Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
    };
}

applyThrust = function(thing) {
    var origin = {'x' : thing.x, 'y': thing.y};
    var tp = [thing.x, thing.y - 1];
    var np = rotate_point(tp[0], tp[1], origin.x, origin.y, thing.r);
    thing.mx = np.x - thing.x;
    thing.my = np.y - thing.y;
    thing.x = thing.x + thing.mx * thing.grab('thruster').power;
    thing.y = thing.y + thing.my * thing.grab('thruster').power;
}

applyThrust2 = function(thing) {
    var origin = {'x' : thing.x, 'y': thing.y};
    var tp = [thing.x, thing.y - 1];
    var np = rotate_point(tp[0], tp[1], origin.x, origin.y, thing.r);
    thing.mx = np.x - thing.x;
    thing.my = np.y - thing.y;
    thing.x = thing.x + thing.mx * thing.thrustPower();
    thing.y = thing.y + thing.my * thing.thrustPower();
}

lateralMove = function(thing) {
  var total = Math.abs(thing.mx) + Math.abs(thing.my);
    if (total <= 0) {
      return;
    }
    var xx = thing.mx / total * thing.speedMod();
    var yy = thing.my / total * thing.speedMod();

    var sum = Math.abs(xx) + Math.abs(yy);

    if (sum < 1.732050808) {
      xx = thing.mx * thing.speedMod();
      yy = thing.my * thing.speedMod();
    }
    
    thing.x = thing.x + xx * thing.speed;
    thing.y = thing.y + yy * thing.speed;
}

pointArrayRotated = function(points, angle, origin) {
        for (var i = 0; i < points.length; i++){
            var p = points[i];
            var rotated = rotate_point(p[0], p[1], origin.x, origin.y, angle);
            points[i] = [rotated.x, rotated.y];
        }

        return points;
    }
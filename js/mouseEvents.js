// Mouse Events
var rects = [];

// TOUCH

var isDown = false;
var selectedElm = null;
var offset;

var justClicked = null;
var doubleClick = false;
var preventHighlight = false;


function selectElement(e){

    // Definimos un array de elementos sobre los que se puede clicar
	rects = [];
	for(i=0; i<cartasJugador[1].length; i++) rects.push(cartas[ cartasJugador[1][i] ]);
	// if(botonCante.display == true) rects.unshift(botonCante);
	// rects.unshift(backButton);
	// if(notificationBackground.display == true) rects.unshift(notificationBackground);
	
    var x = e.clientX || e.changedTouches[0].clientX;
    var y = e.clientY || e.changedTouches[0].clientY;

    //Comprobando si estamos clicando sobre algún elemento perteneciente a rects
    for (var i = 0; i < rects.length; i++) {

        // Preparamos la info para llamar a clickHit()
        var elm = rects[i];
        var click = [x,y];

        var collide = checkHit(click,elm);

        if (collide){

			if(elm.style == 'carta'){

				// Comporbamos si hay doble click
				if(justClicked == elm){
					doubleClick = true;
					new jobObj({
						duration:0.5,
						action: function(){ doubleClick = false;	}
					});
				}else{
					justClicked = elm;
					new jobObj({
						duration:0.5,
						action: function(){ justClicked = null;	}
					});
				}

				// Comprobamos si la carta se está clicando en su mitad inferior para seleccionarla o solo mostrarla.
				// console.log(cartasJugador[1].length);
				// console.log(cartas[cartasJugador[1][Math.floor(cartasJugador[1].length/2)]]);
				// var maxTapTop = cartas[cartasJugador[1][Math.floor(cartasJugador[1].length/2)]].top;
				// console.log(cartasJugador[1][i-1]);
			
				var maxTapTop = cartas[elm.id].top;
				// var maxTapTop = cartas[cartasJugador[1][i-1]].top;
				if( y > maxTapTop ){
	
					console.log("Only Tapping Element " + elm.id);
					selectedElm = elm; // <<<<------ No hace falta tappedElm y es suficiente con selectedElm???????
		
					break;

				}

			}

			// Si se sigue es porque la carta fue seleccionada en su mitad superior.
            console.log("Selecting Element " + elm.id);
			selectedElm = elm;
            isDown = true;
            offset = [
                elm.left - (e.clientX || e.changedTouches[0].clientX),
                elm.top - (e.clientY || e.changedTouches[0].clientY)
			];

            // Adding on active style
            selectedElm.pressed = true;
            selectedElm.boxShadowBlur = vh(1);
            if(selectedElm.activeStyle != null) Object.assign(selectedElm, styles[selectedElm.activeStyle]);

			// Hay que renderizar el canvas del J1 xq hay que pasar la carta seleccionada al canvas Selected.
			// Si no lo hiciéramos, la casta se dibujaría dos veces, en el J1 y en el Selected, en definitiva,
			// hay que renderizar J1 para que la carta seleccionada desaparezca del J1.
			canvasMustBeRendered["J1"] = true;

            break;

        }

    }

}

function moveElement(e){

    var x = e.clientX || e.changedTouches[0].clientX;
    var y = e.clientY || e.changedTouches[0].clientY;
    mouseX = x;
    mouseY = y;

    if (isDown) { // Si hay una carta seleccionada

        // We dont move the elm if it's not draggable
        if(selectedElm.draggable == false) return;

        // Check margins
        var tmpLeft = (x + offset[0]);
        var tmpTop = (y + offset[1]);
        var canMove = checkMargins(tmpLeft,tmpTop);
        if (canMove[0]) selectedElm.left = tmpLeft;
		if (canMove[1]) selectedElm.top  = tmpTop;
		
		// Rotate card in Z edge
        selectedElm.rotateZ = getDeg(selectedElm.left);

		// Check if hovering monton or another card
		monton.style.backgroundColor = "rgba(0,0,0,0.2)"; // Reset monton backgroundColor
		if(selectedElm.left>monton.offsetLeft && selectedElm.left<monton.offsetLeft+monton.offsetWidth &&
			selectedElm.top>monton.offsetTop && selectedElm.top<monton.offsetTop+monton.offsetHeight ){

			console.log("Moving to MONTON");
			monton.style.backgroundColor = "rgba(0,200,0,0.1)";

		}else{

			// Miramos si estamos moviendo la carta sobre alguna otra de las nuestras.
			for (var i = cartasJugador[1].length-1; i >= 0; i--) {

				// Preparamos la info para llamar a clickHit()
				var elm = cartas[cartasJugador[1][i]];
				if(elm == selectedElm) continue; // Si es el elemento seleccionado no nos interesa.
				var click = [selectedElm.left,selectedElm.top]; // Buscamos que la carta sea la que pase por encima de otra, no la posición del mouse
				var collide = checkHit(click,elm);

				if (collide){

					console.log("Replacing Element " + elm.id);
					replaceElms(elm);
					break;

				}
			}

        }

    }else{
		// Si no hay carta seleccionada, se comprueba si se esta sobre una carta en la parte inferior para mostrarla si moverla.
		// Si se mueve el dedo hacia arriba la carta se selecciona automáticamente llamando a selectElement() -> isDown pasaría a true.

		for (i=0; i<cartasJugador[1].length; i++) {

			// Preparamos la info para llamar a clickHit()
			var elm = cartas[cartasJugador[1][i]];
			var click = [x,y]; // Buscamos que la carta sea la que pase por encima de otra, no la posición del mouse
			var collide = checkHit(click,elm);

			if (collide){

				// var maxTapTop = cartas[cartasJugador[1][Math.floor(cartasJugador[1].length/2)]].top;
				var maxTapTop = cartas[elm.id].top; // Esta propiedad es el centro del a carta
				if( y > maxTapTop ){
					console.log("Only Tapping");
					selectedElm = elm;
					break;
				}else{
					selectedElm = null;
					selectElement(e);
				}

			}
		}

	}

}

function unselectElement(){

    if(!selectedElm) return;

    // Check if there's an action asociated with the element
    // if(selectedElm.onMouseUp != undefined) selectedElm.onMouseUp(selectedElm.args);

    // Removing on active style
    selectedElm.pressed = false;
	for(var prop in styles[selectedElm.activeStyle]) selectedElm[prop] = defaultElement[prop];
    for(prop in styles[selectedElm.activeStyle]) selectedElm[prop] = styles[selectedElm.style][prop];
    // Object.assign(selectedElm, styles[selectedElm.style]);
	
	// Reset monton backgroundColor
	monton.style.backgroundColor = "rgba(0,0,0,0.2)";

	// Check if dropping over monton
	if(selectedElm.style == 'carta'){
		if(selectedElm.left>monton.offsetLeft && selectedElm.left<monton.offsetLeft+monton.offsetWidth &&
			selectedElm.top>monton.offsetTop && selectedElm.top<monton.offsetTop+monton.offsetHeight ){

			console.log(selectedElm.id+" Se soltó sobre el MONTON");
			jugar(selectedElm.id);
			orderCards(1);

		}else if(doubleClick == true){
			preventHighlight = true;
			doubleClick = false;
			justClicked = null;
			console.log(selectedElm.id+" Se hizo doble click");
			jugar(selectedElm.id);
			if(selectedElm) selectedElm.boxShadowBlur = 0;
			selectedElm = null;
		}else{
			new jobObj({
				duration:0.6,
				action: function(){ if(turn == 1) highlightPosibles(); }
			});
		}
		new jobObj({
			duration:0.1, //0.1
			action:orderCards,
			delay:0.2, //0.2
			delayAction:orderCards,
			args:1
		});
		// Se pone en true xq si no falta un frame (o varios) en el que la carta no se dibuja desde que pasa de canvasSelected a J1
		canvasMustBeRendered["J1"] = true;
	}

	// Reset the selectedElm variable
	// console.log("Deselecting Element " + selectedElm.id);
	isDown = false;
	if(selectedElm) selectedElm.boxShadowBlur = 0;
	selectedElm = null;

}

// Replacing Cards
function replaceElms(elm){

	if(jobs.find( x => x.id === elm.id) != undefined) return; // Si la carta se está moviendo en ese momento no se reemplaza.

    //Quitamos el elemento seleccionado selectedElm del array elmSort (Lo introducimos más tarde)
    var posSelected = cartasJugador[1].indexOf(parseInt(selectedElm.id,10));
    if(posSelected != -1) cartasJugador[1].splice(posSelected,1);

    //Introducimos el seleccionado antes o después del target
    var posTarget = cartasJugador[1].indexOf(parseInt(elm.id,10));
    if(posTarget == posSelected) posTarget++; //Al mover hacia la izquierda el target tiene la misma posición, así que incrementamos el index
    cartasJugador[1].splice(posTarget,0,parseInt(selectedElm.id,10));
    orderCards(1);

}

function checkMargins(x,y){

    var moveX, moveY;
    if( (x < canvas["Selected"].width) && (x > 0) ) moveX = true;
    if( (y < canvas["Selected"].height) && (y > 0) ) moveY = true;
    return ([moveX,moveY]);

}


// Detecting clicks inside rotated elements
// click - mouse click position [x,y]
// elm - target object

function checkHit(click,elm){

    var left = elm.left;
    var top = elm.top;
    var position = [left,top];

    var [rotY,rotX] = getElementRotation(elm);
    var w = (elm.scaleX * rotY) * elm.width;
    var h = (elm.scaleY * rotX) * elm.height;
    var size = [w,h];

    var degrees = elm.rotateZ;

    return clickHit(click,position,size,degrees);
}

// /**
// * Find the vertices of a rotating rectangle
// *
// * @param {Array} position From left, top [X,Y]
// * @param {Array} size Lengths [X,Y]
// * @param {Number} degrees Degrees rotated around center
// * @return {Object} Arrays LT, RT, RB, LB [X,Y]
// */
function findRectVertices(position, size, degrees) {
	var left = position[0] - (size[0]/2);
	var right = position[0] + (size[0]/2);
	var top = position[1] - (size[1]/2);
	var bottom = position[1] + (size[1]/2);

	var center = [ position[0], position[1] ];
	var LT = [ left, top ];
	var RT = [ right, top ];
	var RB = [ right, bottom ];
	var LB = [ left, bottom ];

	return {
		LT: rotatePoint(LT, center, degrees, 0),
		RT: rotatePoint(RT, center, degrees, 1),
		RB: rotatePoint(RB, center, degrees, 2),
		LB: rotatePoint(LB, center, degrees, 3)
	};
}

var vector = [];
vector[0] = [0,0];
vector[1] = [0,0];
vector[2] = [0,0];
vector[3] = [0,0];
vector[4] = [0,0];
// /**
// * Find point after rotation around another point by X degrees
// *
// * @param {Array} point The point to be rotated [X,Y]
// * @param {Array} rotationCenterPoint The point that should be rotated around [X,Y]
// * @param {Number} degrees The degrees to rotate the point
// * @return {Array} Returns point after rotation [X,Y]
// */
function rotatePoint(point, rotationCenterPoint, degrees, i) {
	// Using radians for this formula
	var radians = degrees * Math.PI / 180;

	// Translate the plane on which rotation is occurring.
	// We want to rotate around 0,0. We'll add these back later.
	point[0] -= rotationCenterPoint[0];
	point[1] -= rotationCenterPoint[1];

	// Perform the rotation
	var newPoint = [];
	newPoint[0] = point[0] * Math.cos(radians) - point[1] * Math.sin(radians);
	newPoint[1] = point[0] * Math.sin(radians) + point[1] * Math.cos(radians);

	// Translate the plane back to where it was.
	newPoint[0] += rotationCenterPoint[0];
	newPoint[1] += rotationCenterPoint[1];


    vector[i] = newPoint;
	return newPoint;
}

// /**
// * Distance formula
// *
// * @param {Array} p1 First point [X,Y]
// * @param {Array} p2 Second point [X,Y]
// * @return {Number} Returns distance between points
// */
function distance(p1, p2) {
	return Math.sqrt( Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) );
}

// /**
// * Heron's formula (triangle area)
// *
// * @param {Number} d1 Distance, side 1
// * @param {Number} d2 Distance, side 2
// * @param {Number} d3 Distance, side 3
// * @return {Number} Returns area of triangle
// */
function triangleArea(d1, d2, d3) {
	// See https://en.wikipedia.org/wiki/Heron's_formula
	var s = (d1 + d2 + d3) / 2;
	return Math.sqrt(s * (s - d1) * (s - d2) * (s - d3));
}

// /**
// * Determine if a click hit a rotated rectangle
// *
// * @param {Array} click Click position [X,Y]
// * @param {Array} position Rect from left, top [X,Y]
// * @param {Array} size Rect size as lengths [X,Y]
// * @param {Number} degrees Degrees rotated around center
// * @return {Boolean} Returns true if hit, false if miss
// */
function clickHit(click, position, size, degrees) {
	// Find the area of the rectangle
	// Round to avoid small JS math differences
	var rectArea = Math.round(size[0] * size[1]);

	// Find the vertices
	var vertices = findRectVertices(position, size, degrees);

	// Create an array of the areas of the four triangles
	var triArea = [
		// Click, LT, RT
		triangleArea(
			distance(click, vertices.LT),
			distance(vertices.LT, vertices.RT),
			distance(vertices.RT, click)
		),
		// Click, RT, RB
		triangleArea(
			distance(click, vertices.RT),
			distance(vertices.RT, vertices.RB),
			distance(vertices.RB, click)
		),
		// Click, RB, LB
		triangleArea(
			distance(click, vertices.RB),
			distance(vertices.RB, vertices.LB),
			distance(vertices.LB, click)
		),
		// Click, LB, LT
		triangleArea(
			distance(click, vertices.LB),
			distance(vertices.LB, vertices.LT),
			distance(vertices.LT, click)
		)
	];

	// Reduce this array with a sum function
	// Round to avoid small JS math differences
	triArea = Math.round(triArea.reduce(function(a,b) { return a + b; }, 0));

	// Finally do that simple thing we visualized earlier
	if (triArea > rectArea) {
		return false;
	}
	return true;
}



var imgs = [];
var assetsCount = 0;
// var backgrounds = [];
// var patternsCount = 0;
var assets = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
// var patterns = ['felt'];
var jobs = [];
// var startSteps = 0; // Contará los pasos necesarios para empezar el juego

// Variables de FPS
const FRAMES_PER_SECOND = 30;  // Valid values are 60,30,20,15,10...
// set the mim time to render the next frame
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
var lastFrameTime = 0;  // the last frame time

var lastCalledTime;
var lastFps;
var fps;

var canvasSelectedJustRendered = false;
var canvasMustBeRendered = [];
for(i=0; i<canvasList.length; i++){
    canvasMustBeRendered[canvasList[i]] = false;    
}
var testing = false;

// var grabar = false;
// var nFrame = 0;
// function grabacion(){
// 	if(grabar == true){
// 		grabar = false;
// 	}else{
// 		grabar = true;
// 	}
// 	console.log(grabar);
// }
// function getFrame(){
// 	var dURL = canvas.toDataURL();
// 	aTag = document.createElement("a");
// 	aTag.download = 'test-'+lastFrameTime+'.png';
// 	aTag.href = dURL;
// 	aTag.textContent = "click to download";
// 	nFrame++;
// 	document.body.appendChild(aTag);
// 	aTag.click();
// 	aTag.parentNode.removeChild(aTag);
// }

function main(time) {

	// Limit the Frame Rate
	// if(time-lastFrameTime < FRAME_MIN_TIME){ //skip the frame if the call is too early
    //     requestAnimationFrame(main);
    //     return; // return as there is nothing to do
    // }
    // lastFrameTime = time; // remember the time of the rendered frame

	// if(grabar) getFrame();

    // Your main loop contents
    procesos();

    // Get next Frame!
	window.requestAnimationFrame(main);
}


function procesos(){

	// Clear the canvas (when needed)
	if(testing) ctx["Testing"].clearRect(0, 0, wWidth, wHeight);

	// Jobs
    jobs.forEach(function(job,t){
        runJob(job,t);
    });
    // console.log(jobs);

    // El for se indexa con el array cartas en vez de con el array cartasIds por si no se han creado las cartas
    for(i=cartasIds.length-1; i>=0; i--) drawCard(cartas[cartasIds[i]] , "Barridas");
 

    // Dibujamos las cartas de los jugadores

    // Jugador 1
    // Solucionado provisionalmente. Problema con el delay que hay entre el canvasSelected y el J1.
    // Como al soltar una carta, las cartas no se reordenan de inmediato, durante unos frames la carta seleccionada no se dibuja.

    if(canvasMustBeRendered["J1"]){

        ctx["J1"].clearRect(0, 0, wWidth, wHeight);

        for(j=1; j<=1; j++){
            if(reversedCards == true && j == 1){
                for(i=cartasJugador[1].length-1; i>=0; i--){
                    if(selectedElm && cartasJugador[j][i] == Number(selectedElm.id)) continue; // Si es la carta seleccionada, no se dibija pues ya se dibuja en el selectedELm
                    if(cartasIds.indexOf(cartasJugador[j][i]) == -1) drawCard(cartas[cartasJugador[j][i]],"J1");
                }
            }else{
                for(i=0; i<cartasJugador[j].length; i++){
                    if(selectedElm && cartasJugador[j][i] == Number(selectedElm.id)) continue; // Si es la carta seleccionada, no se dibija pues ya se dibuja en el selectedELm
                    if(cartasIds.indexOf(cartasJugador[j][i]) == -1) drawCard(cartas[cartasJugador[j][i]],"J1");
                }
            }
        }

        layerTesting(10,64,"J1","green");

    }else{

        layerTesting(10,64,"J1","red");

    }


    // Jugador 2,3,4
    for(j=2; j<=4; j++){
        
        if(canvasMustBeRendered["J"+j]){

            ctx["J"+j].clearRect(0, 0, wWidth, wHeight);
        
            for(i=0; i<cartasJugador[j].length; i++){
                if(selectedElm && cartasJugador[j][i] == Number(selectedElm.id)) continue; // Si es la carta seleccionada, no se dibija pues ya se dibuja en el selectedELm
                if(cartasIds.indexOf(cartasJugador[j][i]) == -1) drawCard(cartas[cartasJugador[j][i]],"J"+j);
            }

            layerTesting(10,32*(j+1),"J"+j,"green");
    
        }else{

            layerTesting(10,32*(j+1),"J"+j,"red");
            
        }

    }

    
    // Dibujamos las cartas de la jugada
    if(canvasMustBeRendered["Jugada"]){

        ctx["Jugada"].clearRect(0, 0, wWidth, wHeight);
 
        for(i=4;i>=1;i--){ // Se dibujan en orden inverso para que la del jugador 1 siempre quede por encima
            if(cartasJugada[i] != 0) drawCard(cartas[cartasJugada[i]] , "Jugada");
        }
 
        layerTesting(10,32*6,"Jugada","green");

    }else{

        layerTesting(10,32*6,"Jugada","red");

    }

    // Dibujamos las cartas barridas
    if(canvasMustBeRendered["Barridas"]){

        ctx["Barridas"].clearRect(0, 0, wWidth, wHeight);
 
        for(i=1;i<=2;i++){
            for(j=cartasEquipo[i].length-5; j<cartasEquipo[i].length; j++) if(cartasEquipo[i][j]) drawCard(cartas[cartasEquipo[i][j]] , "Barridas");
        } 
 
        layerTesting(10,32*7,"Barridas","green");

    }else{

        layerTesting(10,32*7,"Barridas","red");

    }


    //************************************************************************** */
    // canvasSelected

	// El selectedElm lo dibujamos al final para que quede por encima
    if(selectedElm != null){

        // elm = (selectedElm != null) ? selectedElm : tappedElm;
        elm = selectedElm;
        ctx["Selected"].clearRect(0, 0, wWidth, wHeight);
        drawCard(elm,"Selected");

        layerTesting(10,32,"Selected","green");

        canvasSelectedJustRendered = true;
        // console.log('Rendering Selected');       

    }else if(canvasSelectedJustRendered){

        ctx["Selected"].clearRect(0, 0, wWidth, wHeight);

        layerTesting(10,32,"Selected","orange");

        canvasSelectedJustRendered = false;
        // console.warn("NOT Rendering Selected");

    }else{

        layerTesting(10,32,"Selected","red");
        
    }
    
    //************************************************************************** */


    // Reset MustBeRendered Variables
    for(i=0; i<canvasList.length; i++){
        canvasMustBeRendered[canvasList[i]] = false;    
    }

	// Write Current FPS
	if(testing) getFPS();


    // Draw clicks
    // ctx.beginPath();
    // ctx.arc(vector[0][0], vector[0][1], 5, 0, 2 * Math.PI);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.arc(vector[1][0], vector[1][1], 5, 0, 2 * Math.PI);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.arc(vector[2][0], vector[2][1], 5, 0, 2 * Math.PI);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.arc(vector[3][0], vector[3][1], 5, 0, 2 * Math.PI);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.arc(vector[4][0], vector[4][1], 10, 0, 2 * Math.PI);
    // ctx.stroke();

}

function layerTesting(x,y,txt,color){
    if(!testing) return;
    ctx["Testing"].font = "32px Arial";
    ctx["Testing"].fillStyle = color;
    ctx["Testing"].fillText(txt, x, y);
}


/* --------------------------------- */
/* -------> MOUSE HOVERING <-------- */
/* --------------------------------- */


var mouseX = -1;
var mouseY = -1;
var hoveredElm;
function handleMouse(){

	rects = cartas.concat(buttons);
	rects.shift();

	if(!isDown && !selectedElm){
		var isHovering = false;
		//Comprobando si tenemos el mouse sobre algún elemento con la propiedad hoverStyle activa
		for (i = rects.length-1; i >= 0; i--) {

			if(rects[i].hoverStyle == null) continue;

			// Preparamos la info para llamar a clickHit()
			var click = [mouseX,mouseY];

			var left = rects[i].left;
			var top = rects[i].top;
			var position = [left,top];

			var [rotY,rotX] = getElementRotation(rects[i]);
			var w = (rects[i].scaleX * rotY) * rects[i].width;
			var h = (rects[i].scaleY * rotX) * rects[i].height;
			var size = [w,h];

			var degrees = rects[i].rotateZ;

			var collide = clickHit(click,position,size,degrees);
			// console.log(collide);

			if (collide){

				console.log("Hovering Element " + rects[i].id);
				hoveredElm = rects[i];
				isHovering = true;
				// Applying on hover style
	            if(rects[i].hoverStyle != null) Object.assign(rects[i], styles[rects[i].hoverStyle]);
				break;

			}

		}

		if(hoveredElm && !isHovering){
			for(var prop in styles[hoveredElm.hoverStyle]) hoveredElm[prop] = defaultElement[prop];
			for(prop in styles[hoveredElm.hoverStyle]) hoveredElm[prop] = styles[hoveredElm.style][prop];
			hoveredElm = null;
		}

	}

}


/* ------------------------- */
/* -------> ASSETS <-------- */
/* ------------------------- */

function loadAssets(){
    // Cargamos las imágenes de las cartas
    for(i=0;i<assets.length;i++){
        loadAsset(assets[i]);
    }
}

function loadAsset(id){
    imgs[id] = new Image();
	imgs[id].src = "img/"+id+".png";
	imgs[id].onerror = function(e){
		imgs[id].src = "img/"+id+".jpg";
	}
    imgs[id].onload = function(){
        // console.log(id+".jpg loaded!");
        assetsLoaded();
    };
}

function assetsLoaded(){
    assetsCount++;
    if(assetsCount == assets.length){
        console.log("Assets loaded!");
		console.log(imgs);
    }
}

/* ------------------------- */
/* ------> ELEMENTS <------- */
/* ------------------------- */


function drawCard(elm,tarjet){

    ctx[tarjet].save();

    // Trasladamos el puntero a las coordenadas del objeto
    ctx[tarjet].translate(elm.left,elm.top);
    // Aplicamos la rotación deseada al puntero
    ctx[tarjet].rotate(elm.rotateZ * Math.PI / 180);
    // Escalamos el objeto si fuera necesario con la rotación en X y en Y aplicada
    var [rotY,rotX] = getElementRotation(elm);
	ctx[tarjet].scale((elm.scaleX * rotY), (elm.scaleY * rotX));
    
    // Set Filters
    var filters = '';
    // if(elm.brightness != 1) filters = 'brightness('+elm.brightness+')';
    // if(elm.contrast != 1) filters += 'contrast('+elm.contrast+')';
    if(elm.grayscale != 0) filters += 'grayscale('+elm.grayscale+')';
    // if(elm.opacity != 1) filters += 'opacity('+elm.opacity+')';
    // if(elm.saturate != 1) filters += 'saturate('+elm.saturate+')';
    // if(elm.sepia != 0) filters += 'sepia('+elm.sepia+')';
    // if(elm.invert != 0) filters += 'invert('+elm.invert+')';
    // if(elm.hueRotate != 0) filters += 'hue-rotate('+elm.hueRotate+')';
    // if(elm.url != 0) filters += 'url('+elm.url+')';
    // if(elm.blur != 0) filters += 'blur('+elm.blur+'px)';
    // if(elm.dropShadow != 0) filters += 'drop-shadow('+elm.dropShadow+')';
    ctx[tarjet].filter = filters;


	// Draw the card shadow
	ctx[tarjet].shadowColor = elm.boxShadowColor;
	ctx[tarjet].shadowBlur = elm.boxShadowBlur;
	

	if((elm.backgroundBack != null) && ( ((elm.rotateY > 90) && (elm.rotateX <= 90)) || ((elm.rotateX > 90) && (elm.rotateY <= 90)) )){
		ctx[tarjet].drawImage(elm.backgroundBack, elm.width/-2, elm.height/-2, elm.width, elm.height);
	}else{
		ctx[tarjet].drawImage(elm.backgroundImage, elm.width/-2, elm.height/-2, elm.width, elm.height);
	}

    ctx[tarjet].restore();

}


function drawElm(elm,target){

	document.body.style.cursor = elm.cursor;

    ctx[target].save();

    // Trasladamos el puntero a las coordenadas del objeto
    ctx[target].translate(elm.left,elm.top);
    // Aplicamos la rotación deseada al puntero
    ctx[target].rotate(elm.rotateZ * Math.PI / 180);
    // Escalamos el objeto
    // ctx.scale(elm.scaleX, elm.scaleY);

    // Escalamos el objeto si fuera necesario con la rotación en X y en Y aplicada
    var [rotY,rotX] = getElementRotation(elm);
    ctx[target].scale((elm.scaleX * rotY), (elm.scaleY * rotX));

    // Set Filters
    // var filters = '';
    // if(elm.brightness != 1) filters = 'brightness('+elm.brightness+')';
    // if(elm.contrast != 1) filters += 'contrast('+elm.contrast+')';
    // if(elm.grayscale != 0) filters += 'grayscale('+elm.grayscale+')';
    // if(elm.opacity != 1) filters += 'opacity('+elm.opacity+')';
    // if(elm.saturate != 1) filters += 'saturate('+elm.saturate+')';
    // if(elm.sepia != 0) filters += 'sepia('+elm.sepia+')';
    // if(elm.invert != 0) filters += 'invert('+elm.invert+')';
    // if(elm.hueRotate != 0) filters += 'hue-rotate('+elm.hueRotate+')';
    // if(elm.url != 0) filters += 'url('+elm.url+')';
    // if(elm.blur != 0) filters += 'blur('+elm.blur+'px)';
    // if(elm.dropShadow != 0) filters += 'drop-shadow('+elm.dropShadow+')';
    // ctx.filter = filters;

    // Define the container shape
    defineRoundedRect(elm.width/-2,elm.height/-2,elm.width,elm.height,elm.borderRadius,ctx);

	ctx[target].globalAlpha = elm.opacity;

	if(elm.backgroundColor != 'none'){
		// Draw the box shadow
		ctx[target].shadowColor = elm.boxShadowColor;
		ctx[target].shadowBlur = elm.boxShadowBlur;

		// Fill container
		ctx[target].fillStyle = elm.backgroundColor;
		ctx[target].fill();
	}

	
	// Draw container border
	if(elm.borderWidth > 0){
		ctx[target].lineWidth = elm.borderWidth;
		ctx[target].strokeStyle = elm.borderColor;
		ctx[target].stroke();
	}

    // Reset Shadows
    stopShadowing();

	if(elm.txt != ''){
		// Draw the text shadow
		ctx[target].shadowColor = elm.textShadowColor;
		ctx[target].shadowBlur = elm.textShadowBlur;
		ctx[target].shadowOffsetX = elm.textShadowOffsetX;
		ctx[target].shadowOffsetY = elm.textShadowOffsetY;

		// Draw Text
		ctx[target].font = elm.textStyle + ' ' + elm.textSize + 'px ' + elm.textFont;
		ctx[target].textAlign = elm.textAlign;
		ctx[target].textBaseline = elm.textBaseline;
		ctx[target].strokeStyle = elm.textBorderColor;
		ctx[target].lineWidth = elm.textBorderWidth;
		if(elm.textBorderWidth > 0) ctx[target].strokeText(elm.txt, 0, 0);
		ctx[target].fillStyle = elm.textColor;
		if(elm.textColor != 'none') ctx[target].fillText(elm.txt, 0, 0);
	}

    ctx[target].imageSmoothingEnabled = elm.imageSmoothingEnabled;
    ctx[target].imageSmoothingQuality = elm.imageSmoothingQuality;

    // Draw image
    if(elm.backgroundImage != null){
        if((elm.backgroundBack != null) && ( ((elm.rotateY > 90) && (elm.rotateX <= 90)) || ((elm.rotateX > 90) && (elm.rotateY <= 90)) )){
            ctx[target].drawImage(elm.backgroundBack, (elm.width-elm.padding)/-2, (elm.height-elm.padding)/-2, (elm.width-elm.padding), (elm.height-elm.padding));
        }else{
            ctx[target].drawImage(elm.backgroundImage, (elm.width-elm.padding)/-2, (elm.height-elm.padding)/-2, (elm.width-elm.padding), (elm.height-elm.padding));
        }

    }

    ctx[target].restore();

}

function stopShadowing(){
    // stop shadowing
    ctx.shadowColor = defaultElement.boxShadowColor;
    ctx.shadowBlur = defaultElement.boxShadowBlur;
    ctx.shadowOffsetX = defaultElement.boxShadowOffsetX;
    ctx.shadowOffsetY = defaultElement.boxShadowOffsetY;
}

function getElementRotation(elm){

    // Rotate on Y
    var rotY, rotX;

    if(elm.rotateY != 0){
        rotY = Math.abs(elm.rotateY);
        if( (rotY%360) == 0){
            rotY = 1;
        }else if( (rotY%180) == 0){
            rotY = -1;
        }else{
            rotY = rotY%360;
            if(rotY>180) rotY = 360-rotY;
            if((rotY%180)>90){
                rotY *= -1;
            }else{
                rotY = 90-rotY;
            }
            rotY = rotY%90;
            rotY = rotY / 90;
        }
    }else{ rotY = 1; }

    // Rotate on X
    if(elm.rotateX != 0){
        rotX = Math.abs(elm.rotateX);
        if( (rotX%360) == 0){
            rotX = 1;
        }else if( (rotX%180) == 0){
            rotX = -1;
        }else{
            rotX = rotX%360;
            if(rotX>180) rotX = 360-rotX;
            if((rotX%180)>90){
                rotX *= -1;
            }else{
                rotX = 90-rotX;
            }
            rotX = rotX%90;
            rotX = rotX / 90;
        }
    }else{ rotX = 1; }

    return [rotY,rotX];
}

/* --------------------- */
/* ------> JOBS <------- */
/* --------------------- */

function runJob(job,t){

	job.t = t;
    if(job.enabled){

        if(job.timerStart == 0) job.timerStart = performance.now();
        var start = job.timerStart;

        job.currentTime = performance.now();
        var end = job.currentTime;

        var time = Math.round(end - start) / 1000;
        job.elapsedTime = time;


        if((job.delay <= time) && (job.delaying == true)){
            job.delaying = false;
            job.timerStart = 0;
            job.currentTime = 0;
            job.elapsedTime = 0;
            if(job.delayAction != null) job.delayAction(job.args);
            return;
        }

        if(job.delaying == true){
            return;
        }


        var elm = job.elm; // Definimos el elemento sobre el que se va a trabajar

        // Llamamos a canvasToBerendered para saber qué canvas hay que redibujar
        canvasToBeRendered(elm);

        if(time >= job.duration){
            for(i=0; i<job.props.length; i++){
                elm[job.props[i]] = job.endValues[i];
            }
            // jobs.splice(t,1); // Delete Job
            job.remove(t);
            // console.log("se acabó la animación");
            if(job.action != null) job.action(job.args);
            if(job.repeat == true){
                new jobObj({
                    id: job.id,
                    props: job.props,
                    startValues: job.startValues,
                    endValues: job.endValues,
                    duration: job.duration,
                    animation: job.animation,
                    delay: job.delay,
                    repeat: job.repeat,
                    enabled: job.enabled,
                    action: job.action,
                    args: job.args
                });
            }
		}else{
            for(i=0; i<job.props.length; i++){
                var animStep = easing[job.animation](time, 0, 1, job.duration);
                dif = (job.endValues[i] - job.startValues[i]) * animStep;
                elm[job.props[i]] = job.startValues[i] + dif;
            }
        }

    }

}

function canvasToBeRendered(elm){
    if(elm == null) return; // Hay jobs que se lanzan sin elm y resultan null. Por ejemplo un temporizador sin más.
    // console.log(elm)

    // Buscamos el elemento en las cartas barridas
    for(i=1;i<=2;i++){
        if(cartasEquipo[i].indexOf(elm.id) != -1){
            canvasMustBeRendered["Barridas"] = true;
        }
    } 

    // Buscamos el elemento en las cartas de la jugada
    for(i=4;i>=1;i--){ // Se dibujan en orden inverso para que la del jugador 1 siempre quede por encima
        if(cartasJugada[i] == elm.id){
            canvasMustBeRendered["Jugada"] = true;
        }
    }

    // Buscamos el elemento en los jugadores
    for(i=1; i<=4; i++){
        if(cartasJugador[i].indexOf(elm.id) != -1){
            // console.log("Have to render canvas " + i);
            canvasMustBeRendered["J"+i] = true;
        }
    }

}


/* -------------------- */
/* ------> FPS <------- */
/* -------------------- */

function getFPS(){
    if(!lastCalledTime) {
        lastCalledTime = performance.now();
        fps = 0;
        return;
    }
    delta = (performance.now() - lastCalledTime)/1000;
    lastCalledTime = performance.now();
    fps = 1/delta;
    fps = Math.round(fps/10)*10;

    // Equilibramos un poco
    // if((lastFps == 60) && (fps != lastFps)){
    //     tmpFps = lastFps;
    //     lastFps = fps;
    //     fps = tmpFps;
    // }else{
    //     lastFps = fps;
    // }

    // console.log(fps)
    // return(fps);

    ctx["Testing"].font = "32px Arial";
	ctx["Testing"].fillStyle = "red";
	ctx["Testing"].fillText(fps, wWidth-50, 32);

}

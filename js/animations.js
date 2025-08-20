// Ordenar Cartas
function orderCards(j,velo){

    if(velo == undefined) velo = 0.3;
    var numCartas = cartasJugador[j].length;
    if(numCartas == 0) canvasMustBeRendered["J"+j] = true; // Hay que renderizarlo ya que de lo contrario la última carta se queda dibujada...
    for(i=0; i<cartasJugador[j].length; i++){

        if(selectedElm && cartasJugador[j][i] == selectedElm.id) continue; // El elemento seleccionado no se reordena

        var elm = cartas[cartasJugador[j][i]];
        if(ckeckId(elm.id) != undefined && j==1) continue; // Si el elemento se está moviendo no se reordena.
        var rotationY = 180; if(j==1) rotationY = 0; // Si la carta es del jugador 1 no se voltea, si no lo es se vuelve a voltear
        new jobObj({
            id: cartasJugador[j][i],
            elm: cartas[cartasJugador[j][i]],
            props: ['left','top','width','height','rotateZ','rotateY','grayscale','padding','borderRadius'],
            startValues: [ elm.left, elm.top, elm.width, elm.height, elm.rotateZ, elm.rotateY, elm.grayscale, elm.padding, elm.borderRadius ],
            endValues: [ posCartas[j][numCartas][i].left, posCartas[j][numCartas][i].top, posCartas[j][numCartas][i].width, posCartas[j][numCartas][i].height, posCartas[j][numCartas][i].rotateZ, rotationY, 0, posCartas[j][numCartas][i].height*0.09, posCartas[j][numCartas][i].height*0.04 ],
            duration: velo,
            animation: "easeOutQuad"
        });

    }

    function ckeckId(id){ return jobs.find( x => x.id === id); } // Buscamos el elemento en los jobs.

}


// Animación de repartir cartas

function repartirCartasAnim(){

    for(i=0; i<cartasIds.length; i++){
        new jobObj({
            id: cartasIds[i],
            elm: cartas[cartasIds[i]],
            duration: i*0.12, //1.5
            action: quitarCartaId,
            args:{id: cartasIds[i], i:i}
        });

    }
}

function quitarCartaId(args){

    canvasMustBeRendered["Barridas"] = true; // Hay que renderizar el canvas "Jugada" para que se vea cómo se van las cartas y cómo se da la vuelta la última.

    var index = cartasIds.indexOf(args.id); // Posicion de la carta que deseamos mover
    cartasIds.splice(index, 1); // Quitamos la carta de la posición (index)

    // Cuántas cartas se han repartido a ese jugador?
    var numCartas = 0;
    var j = ( (args.i+(saque-1)) % 4)+1; // Jugador al que se le reparte <<<<< Esto funciona, MEJOR NI PREGUNTAR
    for(n=0; n<cartasJugador[j].length; n++){
        if(cartasIds.indexOf(cartasJugador[j][n]) == -1){
            numCartas++;
        }
    }

    if(args.i == 39){ // Si es la última carta en repartirse, se muestra para el pinte
		// Se voltea la última carta

		// Se prepara el ángulo de la última carta para que la animación de repartir la última carta coincida bien.
		var anguloFinal;
		if((j==1) || (j==2)){
			cartas[cartasJugador[j][9]].rotateZ = 0;
			anguloFinal = -180;
		}else if(j==4){
			anguloFinal = -360;
		}else{
			anguloFinal = 0;
		}
		// Se muestra la última carta
        new jobObj({
            id: cartasJugador[j][9],
            elm: cartas[cartasJugador[j][9]],
            props: ['rotateY'],
            startValues: [ cartas[cartasJugador[j][9]].rotateY ],
            endValues: [ 0 ],
            duration: 0.5,
            animation: "easeOutQuad",
			delay: 0.5,
			action: mostrarPinte
        });
        // Se oculta la última carta
        new jobObj({
            id: cartasJugador[j][9],
            elm: cartas[cartasJugador[j][9]],
            props: ['rotateY'],
            startValues: [ 0 ],
            endValues: [ 180 ],
			duration: 0.5,
            animation: "easeOutQuad",
			delay: 1.5
        });
        // Se termina de repartir la última carta
        for(k=0; k<numCartas-1; k++){
            new jobObj({
                id: cartasJugador[j][k],
                elm: cartas[cartasJugador[j][k]],
                props: ['left','top','width','height','rotateZ','padding','bordeRadius'],
                startValues: [cartas[cartasJugador[j][k]].left, cartas[cartasJugador[j][k]].top, cartas[cartasJugador[j][k]].width, cartas[cartasJugador[j][k]].height, cartas[cartasJugador[j][k]].rotateZ, cartas[cartasJugador[j][k]].padding, cartas[cartasJugador[j][k]].borderRadius ],
                endValues: [posCartas[j][numCartas][k].left, posCartas[j][numCartas][k].top, posCartas[j][numCartas][k].width, posCartas[j][numCartas][k].height, posCartas[j][numCartas][k].rotateZ, posCartas[j][numCartas][k].height*0.09, posCartas[j][numCartas][k].height*0.04 ],
                duration: 0.5,
                animation: "easeOutQuad",
                delay: 2
            });
		}
		new jobObj({  // <<<< Esta última es la que va con el ángulo final corregido
			id: cartasJugador[j][9],
			elm: cartas[cartasJugador[j][9]],
			props: ['left','top','width','height','rotateZ','padding','bordeRadius'],
			startValues: [ cartas[cartasJugador[j][9]].left, cartas[cartasJugador[j][9]].top, cartas[cartasJugador[j][9]].width, cartas[cartasJugador[j][9]].height, anguloFinal, cartas[cartasJugador[j][9]].padding, cartas[cartasJugador[j][9]].borderRadius ],
			endValues: [posCartas[j][numCartas][k].left, posCartas[j][numCartas][k].top, posCartas[j][numCartas][k].width, posCartas[j][numCartas][k].height, posCartas[j][numCartas][k].rotateZ, posCartas[j][numCartas][k].height*0.09, posCartas[j][numCartas][k].height*0.04 ],
			duration: 0.5,
			animation: "easeOutQuad",
			delay: 2
		});
        // Se voltean la cartas del jugador 1
        for(n=0; n<cartasJugador[1].length; n++){
            new jobObj({
                id: cartasJugador[1][n],
                elm: cartas[cartasJugador[1][n]],
                props: ['rotateY'],
                startValues: [ cartas[cartasJugador[1][n]].rotateY ],
                endValues: [ 0 ],
                duration: 0.6,
                animation: "linearTween",
                delay: 2.5
            });
        }
        new jobObj({
            duration: 2.81,
            action:function(){ reversedCards = true; } // reversedCards define en engine.js el orden de dibujado de las cartas
		});
		
		// Se empieza a jugar
        new jobObj({
            duration: 3.5,
            action: function(){ ordenarCartas(); } // Se ordenan las cartas
        });
        new jobObj({
            duration: 3.8,
            action: function(){ resaltarJugador(turn); jugar(); } // Se llama a jugar. Si es el turno del jugador 1 se rechazará dentro de jugar()
        });
    }else{
        for(k=0; k<numCartas; k++){
            new jobObj({
                id: cartasJugador[j][k],
                elm: cartas[cartasJugador[j][k]],
                props: ['left','top','width','height','rotateZ','padding','bordeRadius'],
                startValues: [cartas[cartasJugador[j][k]].left, cartas[cartasJugador[j][k]].top, cartas[cartasJugador[j][k]].width, cartas[cartasJugador[j][k]].height, cartas[cartasJugador[j][k]].rotateZ, cartas[cartasJugador[j][k]].padding, cartas[cartasJugador[j][k]].borderRadius ],
                endValues: [posCartas[j][numCartas][k].left, posCartas[j][numCartas][k].top, posCartas[j][numCartas][k].width, posCartas[j][numCartas][k].height, posCartas[j][numCartas][k].rotateZ, posCartas[j][numCartas][k].height*0.09, posCartas[j][numCartas][k].height*0.04 ],
                duration: 0.3, //4
                animation: "easeOutQuad",
                delay: 0.1
            });
		}
		
    }

}

// Mostrar el pinte cuando se muestra la última carta que se reparte

function mostrarPinte(){

	pinteMarcador.style.backgroundImage = "url(img/"+pinte+".png)";
	for(i=0; i<5; i++){
		// Se hace parpadear el pinte
		new jobObj({
			delay: i*1,
			delayAction: function(){ pinteMarcador.style.opacity = 1; },
			duration: 0.5,
			action: function(){ pinteMarcador.style.opacity = 0; }
		});
		// Se deja fijo el pinte
		new jobObj({
			duration: 5,
			action: function(){ pinteMarcador.style.opacity = 1; }
		});
	}

}



// Echar carta

function echarCarta(x){

	var randomVal = Math.floor(Math.random() * 6);
	var degAzar = -3 + randomVal;
	if(turn == 4) degAzar -= 360;
	if(turn == 1) degAzar = cartas[x].rotateZ;

	new jobObj({
        id:x,
        elm: cartas[x],
		props:['left','top','width','height','padding', 'rotateZ','rotateY'],
		startValues: [ cartas[x].left, cartas[x].top, cartas[x].width, cartas[x].height, cartas[x].padding, cartas[x].rotateZ, cartas[x].rotateY ],
		endValues: [ posJugador[turn].left, posJugador[turn].top, posJugador[turn].width, posJugador[turn].height, (posJugador[turn].height*0.09), degAzar, 0 ],
        duration: 0.5,
		animation: "easeOutQuad"
    });

}

// Barrer Cartas

function barrerCartasMesa(id,team){

    // Declaramos también el barridas en true porque si no queda un frame sin renderizar
    canvasMustBeRendered["Jugada"] = true;
    canvasMustBeRendered["Barridas"] = true;

	new jobObj({
        id:id,
        elm: cartas[id],
		props:['left','top'],
		startValues: [ cartas[id].left, cartas[id].top ],
		endValues: [posCartasBarridas[team].left, posCartasBarridas[team].top ],
		duration: 1,
		animation: "easeOutQuad"
	});

}


// Animación de añadir puntos al marcador

function anadirPuntos(team,x){

    console.log(team);
    console.log(x);
    for(i=0; i<x.length; i++){

        new jobObj({
            id:'tantos'+team,
            elm: tantos[team],
            delay: i*0.35,
            duration: 0,
            action: popTantos,
            args: [team, x[i]]
        });

    }

}

function popTantos(args){

    tantos[team].txt = parseInt(tantos[team].txt) + args[1];
    tantos[team].innerHTML = parseInt(tantos[team].innerHTML) + args[1];
    t = args[0];
    tantos[t].style.fontSize = posMarcador.height*0.9 + 'px';
    new jobObj({
        duration: 0.20,
        action: function(){ tantos[t].style.fontSize = posTantos[t].textSize + 'px'; }
    });

}


// Mostrar Cante
var _cantando = false; // Cuando se esté cantando será true y no se podrá jugar en jugar()
function mostrarCante(jugador,palo,team){

    if(jugador == 1) _cantando = true;
    var puntosParaAnadir = []; // Guardará los puntos que se suman por el cante.
    if(palo == pinte){
        puntosParaAnadir.push(40);
        showMsg("El jugador " + jugador + " canta las 40");
    }else{
        puntosParaAnadir.push(20);
        showMsg("El jugador " + jugador + " canta 20 en " + palo);
    }

    console.log("Se van a mostrar las cartas de " + palo + " del jugador " + jugador);

        for(j=0;j<cantes[palo].length;j++){

            var c = cartas[cantes[palo][j]];
            new jobObj({
                elm: c,
                props: ['left','top','rotateZ','rotateY'],
                startValues: [ c.left, c.top, c.rotateZ, c.rotateY ],
                endValues: [ posCante[jugador].left[j], posCante[jugador].top, posCante[jugador].deg[j], 0 ],
                duration: 0.5,
                animation: 'easeOutQuad'
            });

        }
        new jobObj({
            duration: 1.5,
            action: function(){
                orderCards(jugador, 0.5);
                if(jugador == 1) _cantando = false;
            }
        });

        new jobObj({
            duration: 1,
            action: function(){ anadirPuntos(team,puntosParaAnadir); }
        });
        
}


// Mostrar mensaje

// var msgTimer;
function showMsg(msg){

    mensajes.innerHTML = msg;
    mensajes.style.opacity = 1;
    new jobObj({
        duration: 2.5,
        action: function(){ mensajes.style.opacity = 0; }
	});
	
	// Se ocultan el pinte y los garbanzos
    pinteMarcador.style.opacity = 0;
    new jobObj({
        duration: 2.5,
        action: function(){ pinteMarcador.style.opacity = 1; }
	});
    
    for(j=1; j<=2; j++){
		for(g=1; g<=7; g++){
			document.getElementById("garbanzo"+j+g).style.opacity = 0;
		}
	}
    
    new jobObj({
        duration: 2.5,
        action: function(){ 

            for(a=1; a<=2; a++){
                for(b=1; b<=7; b++){
                    document.getElementById("garbanzo"+a+b).style.opacity = 1;
                }
            }

        }
    });    


}

// Resaltado del montón
function rejectMonton(){

    try{
        // Se ha puesto un try porque ha habido problemas en esta función. Cuando se canta se le puede dar más de una vez al botón
        // y puede que también a las cartas que se están mostrando. Sale un error en selectedElm.pressed que es NULL. Ahora mientras se canta
        // no pueden jugar las cartas por lo que no debería haber problema. No obstante, se ha puesto un try y se comproeba que selectedElm no es NULL.
        if(selectedElm == null){
            console.warn("selectedElm es NULL");
            return;
        }
        
        // Removing on active style
        selectedElm.pressed = false;
        for(var prop in styles[selectedElm.activeStyle]) selectedElm[prop] = defaultElement[prop];
        for(prop in styles[selectedElm.activeStyle]) selectedElm[prop] = styles[selectedElm.style][prop];
        // Desactivando selectedElm
        isDown = false;
        if(selectedElm) selectedElm.boxShadowBlur = 0;
        selectedElm = null;
        orderCards(1);
        monton.style.backgroundColor = 'rgba(255,0,0,0.2';
        new jobObj({
            elm: monton,
            delay:0.1,
            action: function(){ monton.style.backgroundColor = 'rgba(0,0,0,0.2' }
        });
    }catch(e){
        console.warn(e);
    }

}

// Resaltar jugador
function resaltarJugador(x){

    for(i=1;i<=4;i++) document.getElementById("turno"+i).style.opacity = 0;
    if(x!=false) document.getElementById("turno"+turn).style.opacity = 1;

}

// Highlight Posibles

function highlightPosibles(){

	if(preventHighlight == true){
		preventHighlight = false;
		return;
	}

	if(!highlight || cartasJugador[1].length == 0) return; // Si es false es que el usuario ha desactivado el resaltado de cartas y no se continúa
 
	var cartasPosibles = cardsToUse; // Array de cartas que se pueden utilizar

	if((cartasPosibles.length == cartasJugador[1].length) || (cartasPosibles.length == 0)){
		console.log("No tienes cartas para jugar, por lo que vale cualquiera");
		return;
    }else{

		//Radio del arco sobre el que van colocadas las cartas. Será hipotenusa.
		var magicRadius = Math.round((wWidth + (wWidth * (wWidth/wHeight))) * 1.618);
		// catetoRef se toma como referencia para la altura de las cartas. Se restará a catetoB después de calcular su distancia con catetoA y magicRadius
		var catetoRef = Math.round(Math.sqrt( Math.pow(magicRadius,2) - Math.pow((wWidth / 2),2) ));

        var espacio = cartas[cartasJugador[1][cartasJugador[1].length-1]].left - cartas[cartasJugador[1][0]].left;
		var cartasGrandes = cartasPosibles.length; // Número de cartas grandes
        var unidadesTotales = cartasJugador[1].length + cartasGrandes - 1;
        if( cartasPosibles.indexOf( cartasJugador[1][0] ) != -1 ){
            unidadesTotales -= 1;
        }else{
            // unidadesTotales += 1;
        }
        if( cartasPosibles.indexOf( cartasJugador[1][cartasJugador[1].length-1] ) != -1 ){
            // unidadesTotales -= 1;
        }else{
            // unidadesTotales += 1;
        }
        var unidadDeSeparacion = espacio / unidadesTotales;
        var distLeft;

		for(i=0; i<cartasJugador[1].length; i++){

			if( cartasPosibles.indexOf( cartasJugador[1][i] ) != -1 ){
				
				tmpSizeH = sizeH;
				tmpSizeW = sizeW;

				// Distancia left a la que va el centro de la carta. (l+1) y (i+1) son necesarios para calcular el centro
				distLeft += unidadDeSeparacion*2;
                if(i==0) distLeft = cartas[cartasJugador[1][0]].left; // Si es la primera carta se respeta su posición
                if(i==cartasJugador[1].length-1) distLeft = cartas[cartasJugador[1][i]].left; // Si es la última carta se respeta su posición
				if( ((wHeight/wWidth)<1) || (cartasJugador[1].length<7) ) distLeft = cartas[cartasJugador[1][i]].left; // Si la pantalla está en horizontal no se desplazan las cartas
				// Distancia desde el centro hasta el centro de la carta
				catetoA = (wWidth / 2) - (distLeft);

				// Distancia desde el vértice hasta la carta
				catetoB = Math.round(Math.sqrt( Math.pow(magicRadius,2) - Math.pow(catetoA,2) ) * 100) / 100;

				// Distancia top de la carta
				tmpTop = wHeight - (catetoB-catetoRef) - (tmpSizeH/2);

				//Calculando Ángulo
				tmpDeg = catetoB / magicRadius;
				tmpDeg = Math.acos(tmpDeg) * 180/Math.PI;
				if( distLeft < (wWidth/2) ) tmpDeg = tmpDeg*-1;

				tmpPadding = tmpSizeH*0.09;
				tmpBorderRadius = tmpSizeH*0.04;
				tmpGrayscale = 0;

			}else{
				
				tmpSizeH = sizeH*0.7;
				tmpSizeW = sizeW*0.7;

				// Distancia left a la que va el centro de la carta. (l+1) y (i+1) son necesarios para calcular el centro
				distLeft += unidadDeSeparacion;
                if(i==0) distLeft = cartas[cartasJugador[1][0]].left; // Si es la primera carta se respeta su posición
                if(i==cartasJugador[1].length-1) distLeft = cartas[cartasJugador[1][i]].left; // Si es la última carta se respeta su posición
				if( ((wHeight/wWidth)<1) || (cartasJugador[1].length<7) ) distLeft = cartas[cartasJugador[1][i]].left; // Si la pantalla está en horizontal no se desplazan las cartas

				// Distancia desde el centro hasta el centro de la carta
				catetoA = (wWidth / 2) - (distLeft);

				// Distancia desde el vértice hasta la carta
				catetoB = Math.round(Math.sqrt( Math.pow(magicRadius,2) - Math.pow(catetoA,2) ) * 100) / 100;

				// Distancia top de la carta
				tmpTop = wHeight - (catetoB-catetoRef) - (tmpSizeH/2);

				//Calculando Ángulo
				tmpDeg = catetoB / magicRadius;
				tmpDeg = Math.acos(tmpDeg) * 180/Math.PI;
				if( distLeft < (wWidth/2) ) tmpDeg = tmpDeg*-1;

				tmpPadding = tmpSizeH*0.09;
				tmpBorderRadius = tmpSizeH*0.04;
				tmpGrayscale = 1;

			}

			var elm = cartas[cartasJugador[1][i]];
			if(elm == selectedElm) continue;
			new jobObj({
				elm: elm,
				props: ['left','top','width','height','rotateZ','grayscale','padding','borderRadius'],
				startValues: [ elm.left, elm.top, elm.width, elm.height, elm.rotateZ, elm.grayscale, elm.padding, elm.borderRadius ],
				endValues: [ distLeft, tmpTop, tmpSizeW, tmpSizeH, tmpDeg, tmpGrayscale, tmpPadding, tmpBorderRadius ],
				duration: 0.1
			});

		}

	}


}

// Ordenar las cartas

function ordenarCartas(){

	if(!ordenar) return; // Si ordenar es false significa que el jugador lo ha desactivado y no se continúa.

	var cards = new Array();
	for(i=0;i<cartasOrdenadas[pinte].length;i++){
		if(cartasJugador[1].indexOf(cartasOrdenadas[pinte][i]) != -1) cards.push(cartasOrdenadas[pinte][i]);
	}
	cartasJugador[1] = cards;
	console.log(cartasJugador[1]);
	orderCards(1);

}


/* AUDIO */
var mJuego;

function setAudio(){
    mJuego = new Audio("audio/tuteacuatro_soundtrack.mp3");
    mJuego.loop = true;
}

function setMedia(){
    mJuego = new Media(getMediaURL('tuteacuatro_soundtrack.mp3'), null, mediaError, mediaStatus);
}

function musicPlay() {
    if(music == 1){ mJuego.play(); }
    else{ musicStop(); }
}

function getMediaURL(s) {
    if(device.platform.toLowerCase() === "android") return "/android_asset/www/audio/" + s;
    else if(device.platform.toLowerCase() === "ios") return "audio/" + s;
    return s;
}

function mediaError(e) {
    console.log('mediaError', e);
}

function mediaStatus(status) {
    if(status === Media.MEDIA_STOPPED) {
        mJuego.seekTo(0);
        mJuego.play();
    }
    console.log('status', JSON.stringify(arguments));
}

function musicStop(){
    if(!window.cordova) {
        mJuego.pause();
        mJuego.currentTime = 0;
    }else{
        mJuego.pause();
        mJuego.seekTo(0);
    }
}

function musicPause(){
    mJuego.pause();
}


/*-------------------------------------------------------------------------------*/


function setPage(page){

    var pages = ["menu","mesa","options"];
    for(i=0;i<pages.length;i++){
        document.getElementById(pages[i]).style.display = "none";
    }
    document.getElementById(page).style.display = "block";

}

function pulsar(div,event){
	console.log(event);
	
    if(event == true){
        div.style.boxShadow = 'inset 0 0 '+vu(2)+'px black';
    }else{
        div.style.boxShadow = '0 0 '+vu(2)+'px black';
    }
}
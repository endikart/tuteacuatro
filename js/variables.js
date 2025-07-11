// Variables Globales
// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// Creamos los contextos necesarios
var canvasList = ["Barridas","J4","J2","J3","J1","Jugada","Selected","Testing"];
var canvas = [];
var ctx = [];
for(i=0; i<canvasList.length; i++){
    canvas[canvasList[i]] = document.getElementById(canvasList[i]);
    ctx[canvasList[i]] = canvas[canvasList[i]].getContext("2d");
}

// Variables de tamaño
var wWidth;
var wHeight;
var sizeH;
var sizeW;

// Variables del juego
var baraja = []; //Baraja de 40 cartas
var cartasIds = []; //Cartas barajadas
var cartasBarajadas = []; //Cartas barajadas para guardar
var cartasJugador = []; //Array que guardará las cartas de todos los jugadores
cartasJugador[1] = [];
cartasJugador[2] = [];
cartasJugador[3] = [];
cartasJugador[4] = [];

var cartasJugada  = [];
cartasJugada[1] = 0;
cartasJugada[2] = 0;
cartasJugada[3] = 0;
cartasJugada[4] = 0;

var equipo = [];
equipo[1] = [1,3];
equipo[2] = [2,4];

var cartasEquipo = [];
cartasEquipo[1] = [];
cartasEquipo[2] = [];

var palos = [];
palos = ['oros','copas','espadas','bastos'];
palos.oros = [1,3,10,9,8,7,6,5,4,2];
palos.copas = [11,13,20,19,18,17,16,15,14,12];
palos.espadas = [21,23,30,29,28,27,26,25,24,22];
palos.bastos = [31,33,40,39,38,37,36,35,34,32];

var pinte; //Saves the main suit in each game
var roundPinte = false; //El pinte de cada ronda
var roundPriorities = [];
var cardsToUse = [];

// localStorage.removeItem("turn");
//Se recupera el turno de la partida anterior
var turn = localStorage.getItem("turn");
if(turn == null){ turn = 1; localStorage.setItem("turn",1); }
else{ turn = parseInt(turn); }
console.log("Turno "+turn);

// localStorage.removeItem("saque");
//Se recupera el saque de la partida anterior
var saque = localStorage.getItem("saque");
if(saque == null){ saque = 1; localStorage.setItem("saque",1); }
else{ saque = parseInt(saque); }
console.log("Saque "+saque);

var highestCard = 0;
var highestPlayer = 0;

//Valor de puntuación de las cartas
var values = [0,11,0,10,0,0,0,0,2,3,4,11,0,10,0,0,0,0,2,3,4,11,0,10,0,0,0,0,2,3,4,11,0,10,0,0,0,0,2,3,4];

//Cartas con las que se puede cantar
var cantes = [];
cantes.oros = [9,10];
cantes.copas = [19,20];
cantes.espadas = [29,30];
cantes.bastos = [39,40];

//Determina si se puede cantar o ya se pasó la ronda
var cantar = [];
cantar[1] = [];
cantar[1][0] = true; //Definirá si se puede cantar o noz
cantar[1][1] = []; //Guardará los cantes del jugador 1
cantar[1][3] = []; //Guardará los cantes del jugador 3
cantar[2] = [];
cantar[2][0] = true; //Definirá si se puede cantar o no
cantar[2][2] = []; //Guardará los cantes del jugador 2
cantar[2][4] = []; //Guardará los cantes del jugador 4

// Cante
var puntosCante = [];
puntosCante[1] = [];
puntosCante[2] = [];

//Puntuación
var puntos = [];
puntos[1] = 0;
puntos[2] = 0;

// Bazas que se han ganado
var garbanzos = [];
garbanzos[1] = 0;
garbanzos[2] = 0;

var cartasOrdenadas = [];
cartasOrdenadas.oros = [1,3,10,9,8,7,6,5,4,2,11,13,20,19,18,17,16,15,14,12,21,23,30,29,28,27,26,25,24,22,31,33,40,39,38,37,36,35,34,32];
cartasOrdenadas.copas = [11,13,20,19,18,17,16,15,14,12,1,3,10,9,8,7,6,5,4,2,21,23,30,29,28,27,26,25,24,22,31,33,40,39,38,37,36,35,34,32];
cartasOrdenadas.espadas = [21,23,30,29,28,27,26,25,24,22,1,3,10,9,8,7,6,5,4,2,11,13,20,19,18,17,16,15,14,12,31,33,40,39,38,37,36,35,34,32];
cartasOrdenadas.bastos = [31,33,40,39,38,37,36,35,34,32,1,3,10,9,8,7,6,5,4,2,11,13,20,19,18,17,16,15,14,12,21,23,30,29,28,27,26,25,24,22];

var highlight = localStorage.getItem("highlight");
if(highlight == "false"){ highlight = false; }else{ highlight = true; }

var music = localStorage.getItem("music");
if(music == "true"){ music = true; }else{ music = false; }

var ordenar = localStorage.getItem("ordenar");
if(ordenar == "false"){ ordenar = false; }else{ ordenar = true; }

var reversedCards = false; // Establecerá el orden de dibujado de las cartas del jugador 1

// Objetos
var cartas = []; // Objetos de las cartas

// GUI
const backButton = document.getElementById("backButton");
const monton = document.getElementById("monton");
const botonCante = document.getElementById("botonCante");
const marcador = document.getElementById("marcador");
const pinteMarcador = document.getElementById("pinteMarcador");
const mensajes = document.getElementById("mensajes");
const tantos = []; // Objetos que muestran los tantos en el marcador
tantos[1] = document.getElementById("tantos1");
tantos[2] = document.getElementById("tantos2");
const notificationBackground = document.getElementById("notificationBackground");

//Determinando si hay partida guardad o no
var savedGame = localStorage.getItem("savedGame");
if(savedGame == null) document.getElementById("btnReanudar").style.opacity = 0.5;
// localStorage.removeItem("savedGame");

setOptInf();


/*--------------------------------------------------------------------------------------*/

// Styles

const defaultJob = {
    id:'default', elm:null, props:[], startValues:[], endValues:[],
    duration:0, animation:'linearTween', action:null, args:'',
    delay:0, delayAction:null, repeat:false, enabled:true,
    timerStart:0, currentTime:0, elapsedTime:0, t:-1
};

const defaultElement = {
    left:0, top:0, width:0, height:0, padding:0,
    borderWidth:0, borderColor:'#000', borderRadius:0,
    boxShadowBlur:0, boxShadowColor:'#000', boxShadowOffsetX:0, boxShadowOffsetY:0, boxOuterShadow:false, boxInnerShadow:false,
    backgroundColor:'none', backgroundImage:null, backgroundBack:null,
    textFont:'Arial', textSize:16, textAlign:'center', textBaseline:'middle',
    textStyle:'normal', textColor:'black', textBorderWidth:0, textBorderColor:'#000',
    textShadowBlur:0, textShadowColor:'#000', textShadowOffsetX:0, textShadowOffsetY:0,
    rotateZ:0, rotateY:0, rotateX:0, scaleX:1, scaleY:1, zIndex:0, display: true,
    id:null, txt:'', type:'default', style:'default', hoverStyle:null, activeStyle:null,
    onMouseDown:null, onMouseUp:null, onMouseMove:null, onMouseHover:null, args:null,
    clickable:false, draggable:false, pressed:false, action:null, cursor:'default',
    imageSmoothingEnabled: true, imageSmoothingQuality: 'high',
    // Filters
    brightness:1, contrast:1, grayscale:0, opacity:1, saturate:1, sepia:0, invert:0,
    hueRotate:0, url:'', blur:0, dropShadow:0
};

const styles = {
    carta: {
        style: 'carta',
        borderWidth:1,
        backgroundColor:'white',
        draggable: true,
        boxShadowBlur:vh(0.7), boxShadowColor: 'rgba(0,0,0,0.5)',
        hoverStyle:'buttonHover',
    },
};


/*--------------------------------------------------------------------------------------*/

// Constructors

function cartaObj (elm){  
    Object.assign(this, defaultElement, styles[elm.style], elm);
    this.resize = function(pos){
        Object.assign(this, pos);        
        this.padding = this.height*0.09;
        this.borderRadius = this.height*0.04;
        console.log("RESIZING");
    }
}
function elmObj (elm){
    Object.assign(this, defaultElement, styles[elm.style], elm);
    this.resize = function(pos){
        Object.assign(this, pos);        
        this.padding = this.height*0.09;
        this.borderRadius = vh(1);
        console.log("RESIZING");    
    }
}
function jobObj(job) {
    Object.assign(this, defaultJob, job);
    if (this.delay == 0) { this.delaying = false; } else { this.delaying = true; }
    jobs.push(this);
    // console.log(jobs);
    this.remove = function(t) { jobs.splice(t, 1); }; // Delete Job
}

/*
Assign Alternative

	this.assign = function(newObjs){
		for(o=0; o<newObjs.length; o++){
			for (var attrname in newObjs[o]) { this[attrname] = newObjs[o][attrname]; }
		}
	}
	this.assign([defaultElement, styles[elm.style], elm]);
*/


/*--------------------------------------------------------------------------------------*/

// Size and position variables
var magicRadius;
var catetoB;
var posCartas = [];
var posInicial;
var posJugador = [];
var posCante = [];
var posBotonCante;
var posMarcador;
var posTantos = [];
var posPinte;
var posGarbanzos = [];
var posMensajes;
var posTurno = [];
var posMonton;
var posCartasBarridas = [];
var posNotificationBackground;
var posBackButton;
var relativeHeight;

function setPositions(){

    // Calculamos las medidas del marcador
    if(wHeight > wWidth){ posMarcadorHeight = vh(6);
    }else{ posMarcadorHeight = vw(6); }
    posMarcador = {
        width: wWidth,
        height: posMarcadorHeight,
        left: wWidth/2,
        top: posMarcadorHeight / 2
    };

    // Es el espacio en el que los jugadores 2 y 4 tendrán sus cartas ya que las del jugador uno ocuparán parte de la pantalla
    // relativeHeight = wHeight - ((wHeight / 4.3) * 1.4) - posMarcador.height; // <-- Se le resta la cabecera (el 1% de momento).
    relativeHeight = wHeight - ((wHeight / 5.7) * 1.5) - posMarcador.height; // <-- Se le resta la cabecera (el 1% de momento).

    // Tamaño de los tantos
    posTantos[1] = {
        width: vw(15),
        height: posMarcador.height,
        left: vw(2),
		top:  posMarcador.top*1.2,
		textAlign: 'left',
        textSize: posMarcador.height*0.65
    };
    posTantos[2] = {
        width: vw(15),
        height: posMarcador.height,
        left: vw(98),
        top:  posMarcador.top*1.2,
		textAlign: 'right',
        textSize: posMarcador.height*0.65
    };
    posMensajes = {
        width: vw(70),
        height: posMarcador.height,
        left: posMarcador.left,
        top: posMarcador.top*1.1,
        textSize: posMarcador.height * 0.3
    };
    posPinte = {
        width: vw(10),
        height: posMarcador.height,
        left: posMarcador.left,
        top: posMarcador.top
	};
	posGarbanzos[1] = [];
	for(g=1; g<=7; g++){
		posGarbanzos[1][g] = {
			width: (vw(50) - posTantos[1].width - (posPinte.width) ) / 7,
			height: (vw(50) - posTantos[1].width - (posPinte.width) ) / 7,
			left: vw(50) - (posPinte.width/2) - ( (vw(50) - posTantos[1].width - (posPinte.width) ) / 7 ) * g,
			top: posMarcador.top
		};
	}
	posGarbanzos[2] = [];
	for(g=1; g<=7; g++){
		posGarbanzos[2][g] = {
			width: (vw(50) - posTantos[1].width - (posPinte.width) ) / 7,
			height: (vw(50) - posTantos[1].width - (posPinte.width) ) / 7,
			left: vw(50) + (posPinte.width/2) + ( (vw(50) - posTantos[1].width - (posPinte.width) ) / 7 ) * g,
			top: posMarcador.top
		};
	}
	
	posNotificationBackground = {
		width: wWidth, height:wHeight,
		left: vw(50), top: vh(50)
	};
	posBackButton = new function() {
		this.width = ((wWidth+wHeight)/2)*0.09;
        this.height = ((wWidth+wHeight)/2)*0.09;
		this.left = vw(92) - ((this.width)/2);
        this.top = vh(75) - (this.height/2);
        if(wHeight < wWidth){
            this.left = vw(95) - (this.width/2);
            this.top = vh(86) - (this.height/2);
        };
	};

    // Calculamos el tamaño de las cartas
    // sizeH = wHeight / 4.3;
    // sizeW = sizeH / 1.618;
    sizeH = wHeight / 5.7;
    sizeW = sizeH / 1.618;

    // Calculamos la posición del montón
    posMonton = new function(){
        this.width = (wWidth * 0.7);
        this.height = (relativeHeight * 0.8);
        this.top = (relativeHeight / 2) - (this.height/2) + posMarcador.height*1.5; // <-- Le restamos el marcador
        this.left = (wWidth/2) - (this.width/2);
	};
	
    posBotonCante = {
		width: vw(36),
		height: vw(14),
        top: posMonton.top + posMonton.height/2 - vh(7),
		left: vw(50)
	};
	if(wHeight < wWidth){
		posBotonCante.width = vw(18);
		posBotonCante.height = vw(7);
	}

	// Posiciones de los resaltados del turno
	posTurno[1] = {
        width: wWidth,
        height: (wHeight+wHeight) * 0.035,
        top: wHeight - ( (wHeight+wHeight) * 0.035) / 2 , // <-- Le restamos el marcador
        left: 0
	};
	posTurno[2] = {
        width: (wHeight+wHeight) * 0.035,
        height: relativeHeight,
        top: posMarcador.height*1.5 /*+ (relativeHeight/2)*/, // <-- Le restamos el marcador
		left: wWidth - (((wHeight+wHeight) * 0.035) / 2)
	};
	posTurno[3] = {
        width: wWidth,
        height: (wHeight+wHeight) * 0.035,
        top: posMarcador.height - ( (wHeight+wHeight) * 0.035) / 2 , // <-- Le restamos el marcador
        left: 0
	};
	posTurno[4] = {
        width: (wHeight+wHeight) * 0.035,
        height: relativeHeight,
        top: posMarcador.height*1.5/* + (relativeHeight/2)*/, // <-- Le restamos el marcador
		left: -((wHeight+wHeight) * 0.035) / 2
	};

    // Posición de las cartas sobre la mesa
    posInicial = {
        top: posMonton.top + (posMonton.height/2), // <-- Le restamos el marcador
        left: posMonton.left + (posMonton.width/2),
        width: sizeW,
        height: sizeH
    };

	// Posición de las cartas que lanzan los jugadores
    posJugador[1] = {
        top: posMonton.top + (posMonton.height/2) + (posMonton.height/3.3),
        left: posMonton.left + (posMonton.width/2),
        width: sizeW*0.8, height: sizeH*0.8
    };
    posJugador[2] = {
        top: posMonton.top + (posMonton.height/2),
        left: posMonton.left + (posMonton.width/2) + (posMonton.width/3),
        width: sizeW*0.8, height: sizeH*0.8
    };
    posJugador[3] = {
        top: posMonton.top + (posMonton.height/2) - (posMonton.height/3.3),
        left: posMonton.left + (posMonton.width/2),
        width: sizeW*0.8, height: sizeH*0.8
    };
    posJugador[4] = {
        top: posMonton.top + (posMonton.height/2),
        left: posMonton.left + (posMonton.width/2) - (posMonton.width/3),
        width: sizeW*0.8, height: sizeH*0.8
    };

	// Posoción que tomarán las cartas que se muestran en el cante
    posCante[1] = {
        top: posJugador[1].top - (sizeW / 2),
        left: [(posJugador[1].left - ((sizeW*0.67) / 2)) , (posJugador[1].left + ((sizeW*0.67) / 2))],
        deg: [-3,3]
    };
    posCante[2] = {
        top: posJugador[2].top,
		left: [(posJugador[2].left - ((sizeW*0.67) * 0.66)) , (posJugador[2].left + ((sizeW*0.67) * 0.33))],
        deg: [-3,3]
    };
    posCante[3] = {
        top: posJugador[3].top,
        left: [(posJugador[3].left - ((sizeW*0.67) / 2)) , (posJugador[3].left + ((sizeW*0.67) / 2))],
        deg: [-3,3]
    };
    posCante[4] = {
        top: posJugador[4].top,
        left: [(posJugador[4].left - ((sizeW*0.67) * 0.33)) , (posJugador[4].left + ((sizeW*0.67) * 0.66))],
        deg: [-363,-357]
    };


    // Calculamos la posición de las cartas barridas por cada equipo
    posCartasBarridas[1] = {
        top: wHeight * 1.2,
        left: vw(50)
    };
    posCartasBarridas[2] = {
        top: posMonton.top + (posMonton.height/2),
        left: wWidth * 1.2
    };

    // Pasamos los cuatro jugadores
    for(j=1;j<=4;j++){

        posCartas[j] = [];

        for(l=1;l<=10;l++){

            posCartas[j][l] = [];

            for(i=0; i<l; i++){

                posCartas[j][l][i] = [];

                // Definimos los datos para el jugador que corresponda
                var tmpLeft;
                var tmpTop;
                var tmpDeg;
                var tmpSizeW;
                var tmpSizeH;
                var catetoA;
                var catetoB;
                //Radio del arco sobre el que van colocadas las cartas. Será hipotenusa.
                var magicRadius = Math.round((wWidth + (wWidth * (wWidth/wHeight))) * 1.618);
                // catetoRef se toma como referencia para la altura de las cartas. Se restará a catetoB después de calcular su distancia con catetoA y magicRadius
                var catetoRef = Math.round(Math.sqrt( Math.pow(magicRadius,2) - Math.pow((wWidth / 2),2) ));

                if(j == 1){

                    tmpSizeH = sizeH;
                    tmpSizeW = sizeW;
                    // tmpSizeH = sizeH * 0.76;
                    // tmpSizeW = sizeW * 0.76;

                    // Distancia left a la que va el centro de la carta. (l+1) y (i+1) son necesarios para calcular el centro
                    // tmpLeft = (((wWidth * 0.8) / (l+1)) * (i+1)) + (wWidth * 0.1);
                    tmpLeft = (((wWidth * 0.86) / (l+1)) * (i+1)) + (wWidth * 0.07);


                    // Distancia desde el centro hasta el centro de la carta
                    catetoA = (wWidth / 2) - (tmpLeft);

                    // Distancia desde el vértice hasta la carta
                    catetoB = Math.round(Math.sqrt( Math.pow(magicRadius,2) - Math.pow(catetoA,2) ) * 100) / 100;

                    // Distancia top de la carta
                    tmpTop = wHeight - (catetoB-catetoRef) - (tmpSizeH/2);

                    //Calculando Ángulo
                    tmpDeg = catetoB / magicRadius;
                    tmpDeg = Math.acos(tmpDeg) * 180/Math.PI;
                    if( tmpLeft < (wWidth/2) ) tmpDeg = tmpDeg*-1;

                }
                else if(j == 2){

                    // tmpSizeH = sizeH * 0.67;
                    // tmpSizeW = sizeW * 0.67;
                    tmpSizeH = sizeH * 0.8;
                    tmpSizeW = sizeW * 0.8;

                    // Distancia left a la que va el centro de la carta. (l+1) y (i+1) son necesarios para calcular el centro
                    if(wHeight > wWidth){ tmpTop = (((relativeHeight*0.8) / (l+1)) * (i+1));
                    }else{ tmpTop = ((relativeHeight / (l+1)) * (i+1)); }                  

                    // Distancia desde el centro hasta el centro de la carta
                    catetoA = ((relativeHeight*0.8) / 2) - (tmpTop);

                    // Distancia desde el vértice hasta la carta
                    catetoB = Math.round(Math.sqrt( Math.pow(magicRadius,2) - Math.pow(catetoA,2) ) * 100) / 100;

                    // Distancia top de la carta
                    tmpLeft = wWidth - (catetoB - catetoRef) + (tmpSizeH*0.4);

                    //Calculando Ángulo
                    tmpDeg = catetoB / magicRadius;
                    tmpDeg = Math.acos(tmpDeg) * 180/Math.PI;
                    if( tmpTop < ((relativeHeight*0.8)/2) ) tmpDeg = tmpDeg*-1;

                    tmpDeg = -90 - tmpDeg; // Corregimos la inclinación para que se ajuste al lateral derecho.
                    if(wHeight > wWidth){  tmpTop += (relativeHeight*0.1) + posMarcador.height*1.5; // Se salva la distancia del marcador.
                    }else{  tmpTop += posMarcador.height*1.5; } // Se salva la distancia del marcador.

                }

                else if(j == 3){

                    // tmpSizeH = sizeH * 0.67;
                    // tmpSizeW = sizeW * 0.67;
                    tmpSizeH = sizeH * 0.8;
                    tmpSizeW = sizeW * 0.8;

                    // Distancia left a la que va el centro de la carta. (l+1) y (i+1) son necesarios para calcular el centro
                    if(wHeight > wWidth){ tmpLeft = (((wWidth * 0.8) / (l+1)) * (i+1)) + (wWidth * 0.1);
                    }else{  tmpLeft = (((wWidth * 0.6) / (l+1)) * (i+1)) + (wWidth * 0.2); }
                    
                    // Distancia desde el centro hasta el centro de la carta
                    catetoA = (wWidth / 2) - (tmpLeft);

                    // Distancia desde el vértice hasta la carta
                    catetoB = Math.round(Math.sqrt( Math.pow(magicRadius,2) - Math.pow(catetoA,2) ) * 100) / 100;

                    // Distancia top de la carta
                    if(wHeight > wWidth){  tmpTop = catetoB - catetoRef;
                    }else{  tmpTop = catetoB - catetoRef + wWidth*0.01; }

                    //Calculando Ángulo
                    tmpDeg = catetoB / magicRadius;
                    tmpDeg = Math.acos(tmpDeg) * 180/Math.PI;
                    if( tmpLeft < ((wWidth)/2) ) tmpDeg = tmpDeg*-1;

                    tmpDeg = 360 - (tmpDeg + 180);

                }
                else if(j == 4){
                    // tmpSizeH = sizeH * 0.67;
                    // tmpSizeW = sizeW * 0.67;
                    tmpSizeH = sizeH * 0.8;
                    tmpSizeW = sizeW * 0.8;

                    // Distancia left a la que va el centro de la carta. (l+1) y (i+1) son necesarios para calcular el centro
                    if(wHeight > wWidth){ tmpTop = (((relativeHeight*0.8) / (l+1)) * (i+1));
                    }else{ tmpTop = ((relativeHeight / (l+1)) * (i+1)); }                  

                    // Distancia desde el centro hasta el centro de la carta
                    catetoA = ((relativeHeight*0.8) / 2) - (tmpTop);

                    // Distancia desde el vértice hasta la carta
                    catetoB = Math.round(Math.sqrt( Math.pow(magicRadius,2) - Math.pow(catetoA,2) ) * 100) / 100;

                    // Distancia top de la carta
                    tmpLeft = catetoB - catetoRef - (tmpSizeH*0.4);

                    //Calculando Ángulo
                    tmpDeg = catetoB / magicRadius;
                    tmpDeg = Math.acos(tmpDeg) * 180/Math.PI;
                    if( tmpTop < ((relativeHeight*0.8)/2) ) tmpDeg = tmpDeg*-1;

                    tmpDeg = tmpDeg - 270; // Corregimos la inclinación para que se ajuste al lateral izquierdo.
                    if(wHeight > wWidth){  tmpTop += (relativeHeight*0.1) + posMarcador.height*1.5; // Se salva la distancia del marcador.
                    }else{  tmpTop += posMarcador.height*1.5; } // Se salva la distancia del marcador.
                   

                }

                posCartas[j][l][i].top = Math.round( tmpTop * 100) / 100;
                posCartas[j][l][i].left = Math.round( tmpLeft * 100) / 100;
                posCartas[j][l][i].width = Math.round( tmpSizeW * 100) / 100;
                posCartas[j][l][i].height = Math.round( tmpSizeH * 100) / 100;
                posCartas[j][l][i].rotateZ = tmpDeg;

            }
        }
    }

    console.log(posCartas);
    setResizedValues();

}

function setResizedValues(){

    // Resize cards
    for(i=1;i<=40;i++){

        // Si la carta está en el mazo
        if(cartasIds.indexOf(i) != -1){

            if(cartas[i]) cartas[i].resize(posInicial);
            continue;
        }

        // Si la carta está en las barridas
        for(b=1; b<=2; b++){
            if(cartasEquipo[b].indexOf(i) != -1){

                if(cartas[i]) cartas[i].resize(posCartasBarridas[b]);
                continue;
            }
        }

        // Si la carta está entre las del jugador
        for(j=1; j<=4; j++){
        	var index = cartasJugador[j].indexOf(i);
            if(index != -1){

                if(cartas[i]) cartas[i].resize(posCartas[j][cartasJugador[j].length][index]);
                continue;
            }
        }

        // Si la cartas está en la mesa
        for(j=1; j<=4; j++){
            if(cartasJugada[j] == i){
                if(cartas[i]) cartas[i].resize(posJugador[j]);
                continue;
            }
        }
    }


    // GUI

    backButton.style.width = posBackButton.width + "px";
    backButton.style.height = posBackButton.height + "px";
    backButton.style.left = posBackButton.left + "px";
    backButton.style.top = posBackButton.top + "px";

    monton.style.width = posMonton.width + "px";
    monton.style.height = posMonton.height + "px";
    monton.style.left = posMonton.left + "px";
    monton.style.top = posMonton.top + "px";

    for(j=1; j<=2;j++){
        for(i=1; i<=7; i++){
            document.getElementById("garbanzo"+j+i).style.width = posGarbanzos[j][i].width + 'px';
            document.getElementById("garbanzo"+j+i).style.height = posGarbanzos[j][i].height + 'px';
            document.getElementById("garbanzo"+j+i).style.top = posGarbanzos[j][i].top + 'px';
            document.getElementById("garbanzo"+j+i).style.left = posGarbanzos[j][i].left + 'px';
        }

        tantos[j].style.fontSize = posTantos[j].textSize + 'px';
        tantos[j].style.lineHeight = posMarcador.height*1.05 + "px";

    }

    for(i=1; i<=4; i++){
        document.getElementById("turno"+i).style.width = posTurno[i].width + 'px';
        document.getElementById("turno"+i).style.height = posTurno[i].height + 'px';
        document.getElementById("turno"+i).style.top = posTurno[i].top + 'px';
        document.getElementById("turno"+i).style.left = posTurno[i].left + 'px';
    }

    // document.getElementById("notificationBackground").style.paddingTop = posMarcador.height * 2.3 + 'px';
    document.getElementById("notifGanadorRonda").style.fontSize = vh(3) + 'px';
    document.getElementById("notifGanadorRonda").style.lineHeight = vh(3)*1.5 + 'px';
    document.getElementById("notifPuntos").style.fontSize = vh(3)*2 + 'px';
    document.getElementById("notifPuntos").style.lineHeight = vh(3)*2*1.5 + 'px';
    document.getElementById("notifSumar").style.fontSize = vh(3) + 'px';
    document.getElementById("notifSumar").style.lineHeight = vh(3)*1.5 + 'px';
    document.getElementById("notifGanadorGeneral").style.fontSize = vh(3) + 'px';
    document.getElementById("notifGanadorGeneral").style.lineHeight = vh(3)*1.5 + 'px';
    document.getElementById("notifGarbanzos").style.fontSize = vh(3)*2 + 'px';
    document.getElementById("notifGarbanzos").style.lineHeight = vh(3)*2*1.5 + 'px';
    document.getElementById("notifTocar").style.fontSize = vh(3)*0.7 + 'px';
    document.getElementById("notifTocar").style.lineHeight = vh(3)*0.7*1.5 + 'px';
    

    // Menús

    // Si se ejecuta en iOS no se muestra el botón salir y se reajustan el resto de botones
    // if(window.cordova){
        
    //     if (typeof device !== 'undefined') { // Parece que en android no da tiempo a inicializar la variable device
    //         if(device.platform == "iOS") {
    //             var btns = ['btnReanudar','btnNuevaPartida','btnOpciones'];
    //             document.getElementById('btnSalir').style.display = 'none';
    //             if(document.getElementById("btnReanudar")){
    //                 for(i=0; i<btns.length; i++){
    //                     document.getElementById(btns[i]).style.top = (vh(15)*i) + 'px';
    //                     document.getElementById(btns[i]).style.fontSize = vh(3.2)+'px';
    //                     document.getElementById(btns[i]).style.lineHeight = vh(8)+'px';
    //                     document.getElementById(btns[i]).style.borderRadius = vu(2)+'px';
    //                     document.getElementById(btns[i]).style.borderWidth = vu(0.2)+'px';
    //                     document.getElementById(btns[i]).style.boxShadow = '0 0 '+vu(2)+'px black';
    //                 }
    //             }
    //         }else if(device.platform == "Android"){
                
    //             var btns = ['btnReanudar','btnNuevaPartida','btnOpciones','btnSalir'];
    //             document.getElementById('btnSalir').style.display = 'block';
    //             if(document.getElementById("btnReanudar")){
    //                 for(i=0; i<btns.length; i++){
    //                     document.getElementById(btns[i]).style.fontSize = vh(3.2)+'px';
    //                     document.getElementById(btns[i]).style.lineHeight = vh(7)+'px';
    //                     document.getElementById(btns[i]).style.borderRadius = vu(2)+'px';
    //                     document.getElementById(btns[i]).style.borderWidth = vu(0.2)+'px';
    //                     document.getElementById(btns[i]).style.boxShadow = '0 0 '+vu(2)+'px black';
    //                 }
    //             }
                
    //         }
    //     }
        
    // }else{
        
        // var btns = ['btnReanudar','btnNuevaPartida','btnOpciones','btnSalir'];
        // // document.getElementById('btnSalir').style.display = 'block';
        // if(document.getElementById("btnReanudar")){
        //     for(i=0; i<btns.length; i++){
        //         document.getElementById(btns[i]).style.fontSize = vh(3.2)+'px';
        //         document.getElementById(btns[i]).style.lineHeight = vh(7)+'px';
        //         document.getElementById(btns[i]).style.borderRadius = vu(2)+'px';
        //         document.getElementById(btns[i]).style.borderWidth = vu(0.2)+'px';
        //         document.getElementById(btns[i]).style.boxShadow = '0 0 '+vu(2)+'px black';
        //     }
        // }
        
    // }

// 	// Ocultar botón salir
//  if(window.cordova && device.platform == 'iOS'){
// 	 ocultarBtnSalir();
//  }

//	var btns = ['opt_mus','opt_resaltar','opt_ordenar','opt_volver'];
//	if(document.getElementById("opt_mus")){
//		for(i=0; i<btns.length; i++){
//			document.getElementById(btns[i]).style.fontSize = vh(2.5)+'px';
//			document.getElementById(btns[i]).style.lineHeight = vh(5)+'px';
//			document.getElementById(btns[i]).style.paddingTop = vh(0.5)+'px';
//			document.getElementById(btns[i]).style.borderRadius = vu(2)+'px';
//			document.getElementById(btns[i]).style.borderWidth = vu(0.2)+'px';
//			document.getElementById(btns[i]).style.boxShadow = '0 0 '+vu(2)+'px black';
//			}
//	}
//	if(document.getElementById("tit_options")){
//		document.getElementById('tit_options').style.fontSize = vh(6)+'px';
//		document.getElementById('tit_options').style.lineHeight = vh(9.5)+'px';
//	}
//	if(document.getElementById("version")){
//		document.getElementById('version').style.fontSize = vh(3)+'px';
//		document.getElementById('version').style.bottom = vh(1.5)+'px';
//	}


    // Hay que redibujar todos los canvas para que se puedan ver los cambios realizados.
    // Reset MustBeRendered Variables
    for(i=0; i<canvasList.length; i++){
        canvasMustBeRendered[canvasList[i]] = true;    
    }
    

}

function ocultarBtnSalir(){

    document.getElementById('btnSalir').style.display = 'none';
    document.getElementById('btnNuevaPartida').style.top = '33%';
    document.getElementById('btnOpciones').style.top = '66%';
//    resize();
}

function getDeg(tmpLeft){

    // Radio del arco sobre el que van colocadas las cartas
    var magicRadius = Math.round((wWidth + (wWidth * (wWidth/wHeight))) * 1.618);

    // Distancia desde el centro hasta el centro de la carta
    catetoA = (wWidth / 2) - (tmpLeft);

    // Distancia desde el vértice hasta la carta
    catetoB = Math.round(Math.sqrt( Math.pow(magicRadius,2) - Math.pow(catetoA,2) ));

    //Calculando Ángulo
    tmpDeg = Math.acos(catetoB / magicRadius) * 180/Math.PI;
    if( tmpLeft < (wWidth/2) ) tmpDeg = tmpDeg*-1;

    return tmpDeg;

}

/*--------------------------------------------------------------------------------------*/

function vw(x){	return (x/100 * wWidth); }
function vh(x){	return (x/100 * wHeight); }
function vu(x){	return (x/100 * ((wWidth+wHeight)/2)); }

/*--------------------------------------------------------------------------------------*/


function saveGame(){

	// La partida se guardará en un ÚNICO localStorage en una ÚNICA cadena de texto JSON.
	var obj = {
		cartas: cartasBarajadas,
		cartasJugador: cartasJugador,
		cartasJugada: cartasJugada,
		cartasEquipo: cartasEquipo,
		pinte: pinte,
		roundPinte: roundPinte,
		roundPriorities: roundPriorities,
		cardsToUse: cardsToUse,
		turn: turn,
		saque: saque,
		highestCard: highestCard,
		highestPlayer: highestPlayer,
		cantar: cantar,
		puntosCante: puntosCante,
		puntos: puntos,
		garbanzos: garbanzos
	}

	var JSONobj = JSON.stringify(obj);
	localStorage.setItem("savedGame",JSONobj);
	console.log(JSONobj);

	// Se muestra el botón del menú opaco
	document.getElementById("btnReanudar").style.opacity = 1;
}


function reanudarPartida(){

	// La partida se guardará en un ÚNICO localStorage en una ÚNICA cadena de texto JSON.
	var JSONobj = localStorage.getItem("savedGame");
	if(JSONobj == null){ console.log("No hay partida guardada"); return; }

	// Obtenemos las variables del objeto JSON
	var obj = JSON.parse(JSONobj);
	console.log(obj);

	cartasIds = [];
	cartasBarajadas = obj.cartas;
	cartasJugador = obj.cartasJugador;
	cartasJugada = obj.cartasJugada;
	cartasEquipo = obj.cartasEquipo;
	pinte = obj.pinte;
	roundPinte = obj.roundPinte;
	roundPriorities = obj.roundPriorities;
	cardsToUse = obj.cardsToUse;
	turn = obj.turn;
	saque = obj.saque;
	highestCard = obj.highestCard;
	highestPlayer = obj.highestPlayer;
	cantar = obj.cantar;
	puntosCante = obj.puntosCante;
	puntos = obj.puntos;
	garbanzos = obj.garbanzos;

	setPositions();
	
	reversedCards = true;

	// Colocamos las cartas de los jugadores en su sitio
	orderCards(1), orderCards(2), orderCards(3), orderCards(4);

	// Colocamos las cartas que se están jugando
	for(i=1;i<=4;i++){
		c = cartas[cartasJugada[i]];
		if(!c) continue;
		c.resize(posJugador[i]);
		c.rotateY = 0;
	}
    canvasMustBeRendered["Jugada"] = true;

	// // Colocamos las cartas barridas en su sitio
	for(i=1;i<=2;i++){
		for(e=0;e<cartasEquipo[i].length;e++){
			c = cartas[cartasEquipo[i][e]];
			c.resize(posCartasBarridas[i]);
		}
	}

	// Actualizamos el marcador con las puntuaciones
    tantos[1].innerHTML = puntos[1];
    tantos[2].innerHTML = puntos[2];

    // Actualizamos los garbanzos
	mostrarGarbanzos();

	setTimeout(function(){

		// Eliminamos el mensaje de notificación de la partida anterior y la pantalla del menú
		notificationBackground.style.display = 'none';
		// Se muestra el pinte del encabezado
		mostrarPinte();
		// Ocultamos el botón de cante y mensajes por si entuvieran activos
		mensajes.style.opacity = 0;
		botonCante.style.display = "none";
		botonCante.onmouseup = false;

		setPage('mesa');

		//Si la música está activada, la reproducimos
		musicPlay(); // Se reproducirá la música desde donde la habíamos dejado.

		if((cartasJugador[1].length==0) && (cartasJugador[2].length==0) && (cartasJugador[3].length==0) && (cartasJugador[4].length==0) &&
		(cartasJugada[1]==0) && (cartasJugada[2]==0) && (cartasJugada[3]==0) && (cartasJugada[4]==0)){
			reiniciarPartida();
		}else{
			getCardsToUse();
			resaltarJugador();
			if(turn != 1){
				jugar();
			}else if(turn == 1){
				highlightPosibles(); // Si highlight está desactivado se comprueba en la función highlightPosibles()
			}
		}

        // // Redraw every MustBeRendered Variables
        // for(i=0; i<canvasList.length; i++){
        //     canvasMustBeRendered[canvasList[i]] = true;    
        // }

	},250);

}

function setOption(div){

    if(div.id == "opt_mus"){
        music = !music;
        localStorage.setItem("music",music);
    }else if(div.id == "opt_resaltar"){
        highlight = !highlight;
        localStorage.setItem("highlight",highlight);
    }else if(div.id == "opt_ordenar"){
        ordenar = !ordenar;
        localStorage.setItem("ordenar",ordenar);
    }
    setOptInf();

}

function setOptInf(){

    //Opción mesanjes
    var inf;
    inf = (music == true) ? "ON" : "OFF";
    document.getElementById("opt_mus_inf").innerHTML = inf;
    inf = (highlight == true) ? "ON" : "OFF";
    document.getElementById("opt_resaltar_inf").innerHTML = inf;
    inf = (ordenar == true) ? "ON" : "OFF";
    document.getElementById("opt_ordenar_inf").innerHTML = inf;

}

/* Plugins
admob-plus-cordova 1.28.0 "admob-plus-cordova"
cordova-admobsdk 8.13.0 "Google Mobile Ads SDK for Cordova"
cordova-plugin-app-version 0.1.14 "AppVersion"
cordova-plugin-apprate 1.7.2 "AppRate"
cordova-plugin-device 2.1.0 "Device"
cordova-plugin-dialogs 2.0.2 "Notification"
cordova-plugin-file 7.0.0 "File"
cordova-plugin-inappbrowser 5.0.0 "InAppBrowser"
cordova-plugin-media 6.1.0 "Media"
cordova-plugin-nativestorage 2.3.2 "NativeStorage"
cordova-plugin-statusbar 3.0.0 "StatusBar"
cordova-plugin-viewport 1.0.5 "Viewport"
cordova-plugin-x-socialsharing 6.0.4 "SocialSharing"
cordova-plugin-x-toast 2.7.3 "Toast"
es6-promise-plugin 4.2.2 "Promise"
*/

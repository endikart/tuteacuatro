document.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

document.ondragstart = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

window.onerror = function (msg, url, lineNo, columnNo, error) {
//    alert(msg + "*-*" + url + "*-*lineNo:" + lineNo + "*-*columnNo:" + columnNo + "*-*" + error + "*-*");
    return false;
}

window.onload = function(){

   resize();

   var events;
   if ("ontouchstart" in document.documentElement)	{ 
       events = [ 'touchstart', 'touchend', 'touchmove' ];
   } else {
       events = [ 'mousedown', 'mouseup', 'mousemove' ];
   }

   var mesa = document.getElementById('mesa');
   //Creando eventos de ratón y táctiles
   mesa.addEventListener(events[0], function(event) {
//			event.preventDefault();
       selectElement(event);
   }, {passive: true});


   mesa.addEventListener(events[1], unselectElement, {passive: true});

   mesa.addEventListener(events[2], function(event) {
//			event.preventDefault();
       moveElement(event);
   }, {passive: true});

   // Set menu style to 'block'
   document.getElementById("menu").style.display = "block";

   // AUDIO
   if(!window.cordova) { setAudio(); } // Se ejecuta si no estamos corriendo cordova

   // Lanzar init()
   init();
   
};

window.onresize = function(){
    setTimeout(function(){ resize(); }, 200); // Si no se hace con un poco de retardo los textos no se redimensionarán.
};

// window.onorientationchange = function(){
//    // alert("the orientation of the device is now " + screen.orientation.angle);
//    if(window.cordova){
//        AdMob.hideBanner();
//        setTimeout(function(){
//            AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
//        },3000);
//    }
// }

function record(){
   var videoStream = canvas.captureStream(30);
   var mediaRecorder = new MediaRecorder(videoStream);

   var chunks = [];

   mediaRecorder.ondataavailable = function(e) {
       chunks.push(e.data);
   };

   mediaRecorder.onstop = function(e) {
       var blob = new Blob(chunks, { 'type' : 'video/mp4' });
       chunks = [];
       var videoURL = URL.createObjectURL(blob);
       //   video.src = videoURL;
       const a = document.createElement('a');
       a.style.display = 'none';
       a.href = videoURL;
       a.download = 'test.mp4';
       document.body.appendChild(a);
       a.click();
       setTimeout(() => {
           document.body.removeChild(a);
           window.URL.revokeObjectURL(videoURL);
       }, 100);
   };

   mediaRecorder.start();
   setTimeout(function (){ mediaRecorder.stop(); }, 10000);
}

/*--------------------------------------------------------------------------------------*/

function init(){

   // Cargar imágenes
   loadAssets();

   // Creamos los elementos
   crearCartas();
   
   // Establecemos las medidas y posiciones de los elementos
   resize();

   // Start the main animation loop
   setTimeout( function(){ main();} , 500 );
   
}

function resize(){

   console.log("Window resizing!");
   
   // changeRes();

   // Establecemos los valores por defecto
   wWidth = window.innerWidth;
   wHeight = window.innerHeight;

   //alert(window.innerWidth + " - " + window.innerHeight);
    setTimeout(function(){ // Se necesita un poco de tiempo para tomar las nuevas medidas wWidth y wHeight
        
        // Redimensionamos los canvas
        for(i=0; i<canvasList.length; i++){
            canvas[canvasList[i]].width = wWidth+2; // Por alguna razón queda un margen de unos dos px que hay que compensar
            canvas[canvasList[i]].height = wHeight+2; // Por alguna razón queda un margen de unos dos px que hay que compensar
            
        }
//        document.getElementById("manu").
        
        // Reposicionamos todos los elementos
        setPositions();
    },200);
}

function crearCartas(){

   for(i=1;i<=40;i++){

       cartas[i] = new cartaObj({
           type: 'carta',
           style: 'carta',
           id: i,
           backgroundImage: imgs[i],
           backgroundBack: imgs[0],
           rotateY: 180
       });
       cartas[i].resize();

   }
}


function barajar(){

   // Se crea el array de una baraja con valores del 1 al 40
   baraja.length = 0;
   for(i=1;i<=40;i++) baraja.push(i);
   console.log("Baraja creada: "+baraja);

   // Resetear cartas
   cartasBarajadas.length = 0;
   cartasIds.length = 0;

   // Se van añadiendo valores aleatoriamente al array cartas
   while(baraja.length>0){
       n = baraja.length; // Longitud del array baraja
       b = Math.floor(Math.random() * n); // Obtenemos un índice aleatorio de 0 a n
       c = baraja[b]; // el valor que le corresponde a ese índice

       cartasIds.push(c); // Añadimos ese valor al array aleatorio
       cartasBarajadas.push(c); // Añadimos ese valor al array aleatorio cartasBarajadas
       baraja.splice(b,1); // Lo quitamos del array baraja para que no se repita
   }

// cartasIds = [9,18,29,16,10,33,30,17,19,14,13,6,20,24,12,5,1,27,7,26,3,23,4,11,31,32,34,25,22,2,39,15,37,38,40,36,28,21,8,35];
   // cartasIds = [23,31,12,20,5,13,14,40,21,30,33,39,36,24,10,35,18,27,7,3,17,19,4,11,16,32,34,25,6,2,22,15,26,38,37,1,28,9,8,29];
   // cartasIds = [1,11,21,31,2,12,22,32,3,13,23,33,4,14,24,34,5,15,25,35,6,16,26,36,7,17,27,37,8,18,28,38,9,19,29,39,10,20,30,40];
//	cartas = [11,21,31,1,12,22,32,2,13,23,33,3,14,24,34,4,15,25,35,5,16,26,36,6,17,27,37,7,18,28,38,8,19,29,39,9,20,30,40,10];
   console.log("Cartas barajadas: "+cartasIds);

   //Lets see wich is the last card and which is the main suit
   pinte = cartasIds[cartasIds.length-1];
   if(pinte < 11) pinte = 'oros';
   else if(pinte < 21) pinte = 'copas';
   else if(pinte < 31) pinte = 'espadas';
   else if(pinte < 41) pinte = 'bastos';

   console.log("Pintan " + pinte);

   // repartirCartas();
   new jobObj({
       delay: 0.5,
       action: repartirCartas
   });
}

function repartirCartas(){

   var j=turn-1;
   if(j==0) j=4;
   for(i=0;i<cartasIds.length;i++){

       j++;
       if(j > 4) j=1;
       cartasJugador[j].push(cartasIds[i]);
       if((j==1) || (j==2)){ // Las del jugador 3 tienen otro ángulo para que la animación incial nos encaje
           cartas[cartasIds[i]].rotateZ = -180;
       }else if(j==4){ // Las del jugador 4 tienen otro ángulo para que la animación incial nos encaje
           cartas[cartasIds[i]].rotateZ = -360;
       }

   }

   console.log(cartasJugador);

   new jobObj({
       delay: 0.5,
       action: repartirCartasAnim
   });

}

/*--------------------------------------------------------------------------------------*/

function jugar(x){

//	console.log(x);
   if(turn != 1) { // <-- Cambiar a 0 para juego automático -- 1
       x = think();
   }else{
       if(x == undefined) return;
       if(_listener != false){ _listener.action(); console.warn("SE PODÍA CANTAR Y NO SE HA CANTADO!!")} 
   }
   var t = 1; // <-- Cambiar a 0 para juego automático -- 1
   if( (turn == 4) && (cartasJugada[1]==0) ) t=0; // <-- Conviene para poder echar la carta más rápido?
   console.log("Card number "+x+" was selected.");

   //Comprobamos que la carta clicada pertenece al jugador
   var pos = cartasJugador[turn].indexOf(x);
   if(pos==-1) { console.log("Selected card isn't into players card array."); rejectMonton(); return; }

   // Comprobamos si se está cantando. Si es así no se puede seguir
   if(_cantando) { console.warn("Se está cantado y carta "+x+" no será jugada. Cancelando..."); rejectMonton(); return; }

   //Check if the card is allowed to be used
   var posUse = cardsToUse.indexOf(x);
   if((posUse==-1) && (cardsToUse.length!=0)){
       showMsg("¡No puedes hacer renuncio!");
       rejectMonton(); // rejectMonton se encarga de desactivar isDown, selectedElm, de ordenar las cartas y resaltar el montón de rojo
       console.log("Selected card is not allowed to be used.");
       new jobObj({
           duration: 1, // Antes era 0.5 pero se ha cambiado porque no daba tiempo a hacer el highlight
           action: highlightPosibles
       });
       return;
   }

   //Adding card to cartasJugada[1]
   cartasJugada[turn] = x;
   //Removing the card from player's cards array
   cartasJugador[turn].splice(cartasJugador[turn].indexOf(cartasJugada[turn]),1);
   // console.log(cartas[cartasJugada[turn]]);

   // Animations
   echarCarta(x);
   orderCards(turn);

   if(roundPinte == false) getRoundPriorities(x); //Only runs with the first card of the round

   manoRank(x); //Lets see wich is the highest card
   
   // Next Turn
   new jobObj({
       delay: t,
       action: nextTurn
   });

}

function getRoundPriorities(x){

   //Lets see wich is the main suit of the round
   if(x < 11) x = 'oros';
   else if(x < 21) x = 'copas';
   else if(x < 31) x = 'espadas';
   else if(x < 41) x = 'bastos';

   roundPinte = x;
   console.log("La ronda va a " + x);

   //Setting roundPrior length to 0
   roundPriorities.length = 0;

   for(i=0;i<palos[pinte].length;i++) roundPriorities.push(palos[pinte][i]);
   for(i=0;i<palos[x].length;i++) roundPriorities.push(palos[x][i]);

   console.log("The round priorities are " + roundPriorities);

}

function manoRank(x){

   if(highestCard == 0){ highestCard = x; highestPlayer = turn; }
   else{

       var highestPos = roundPriorities.indexOf(highestCard);
       var currentPos = roundPriorities.indexOf(x);

       //Si la carta no está en roundPriorities, currentPos es -1 y pasa a ser highestCard, lo que es incorrecto.
       if((currentPos != -1) && (currentPos < highestPos)) { highestCard = x; highestPlayer = turn; }

   }

   console.log("The highest card is " + highestCard);
   console.log("The player with highest card is " + highestPlayer);

}


function getCardsToUse(){

   cardsToUse.length = 0;

   if((cartasJugada[1]==0) && (cartasJugada[2]==0) && (cartasJugada[3]==0) && (cartasJugada[4]==0)) return; //Se determina si es el principio de la ronda

   //Repasamos todas las cartas del jugador
   for(i=0;i<cartasJugador[turn].length;i++){

       //Comprobamos si el jugador tiene cartas del palo al que va la baza que puedan matar
       if(palos[roundPinte].indexOf(cartasJugador[turn][i]) !== -1){

           var cPos = roundPriorities.indexOf(cartasJugador[turn][i]);
           var hPos = roundPriorities.indexOf(highestCard);
           if(cPos<hPos){
               cardsToUse.push(cartasJugador[turn][i]);
           }

       }

   }


   //Si no hubo cartas disponibles para matar buscamos cartas cualesquiera que sean del mismo palo al que va la baza.
   if(cardsToUse.length == 0){

       for(i=0;i<cartasJugador[turn].length;i++){

           if(palos[roundPinte].indexOf(cartasJugador[turn][i]) !== -1){
               cardsToUse.push(cartasJugador[turn][i]);
           }

       }

   }

   //Si tampoco hubo cartas del palo al que va la baza, entonces se buscan triunfos con los que matar
   if(cardsToUse.length == 0){

       for(i=0;i<cartasJugador[turn].length;i++){

           if(palos[pinte].indexOf(cartasJugador[turn][i]) !== -1){

               var cPos = roundPriorities.indexOf(cartasJugador[turn][i]);
               var hPos = roundPriorities.indexOf(highestCard);
               if(cPos<hPos){
                   cardsToUse.push(cartasJugador[turn][i]);
               }

           }

       }

   }

   //Si no hay cartas con las que matar se puede echar cualquiera
   if(cardsToUse.length == 0){

       for(i=0;i<cartasJugador[turn].length;i++){
           cardsToUse.push(cartasJugador[turn][i]);
       }

   }

   console.log("Possible cards to be used should be: " + cardsToUse);

}

function nextTurn(){

   // Definimos el retraso de la tirada si es que se acaba la ronda
   var timeout = 0;

   console.log("Cartas Jugadas:\nCarta J1: "+cartasJugada[1]+"\nCarta J2: "+cartasJugada[2]+"\nCarta J3: "+cartasJugada[3]+"\nCarta J4: "+cartasJugada[4]);

   //Quitamos las cartas jugadas
   if((cartasJugada[1]!=0) && (cartasJugada[2]!=0) && (cartasJugada[3]!=0) && (cartasJugada[4]!=0)){

       if((highestPlayer == 1) || (highestPlayer == 3)){ team=1; }else{ team=2; }

       var puntosParaAnadir = []; // Esta variable recogerá todos los puntos a sumar al equipo para la posterior animación.

       for(i=1;i<5;i++){
           //Adding won cards
           cartasEquipo[team].push(cartasJugada[i]);
           // Se añaden lospuntos al equipo
           puntos[team] += values[cartasJugada[i]];
           if(values[cartasJugada[i]] != 0) puntosParaAnadir.push(values[cartasJugada[i]]); // si el valos no es 0 se añade para la animación
           // Se barren las cartas de la mesa
           barrerCartasMesa(cartasJugada[i],team);
           //Deleting played cards
           cartasJugada[i]=0; //Reseting player's selected card
       }
       
       anadirPuntos(team,puntosParaAnadir); // Animación de cómo se añaden los puntos.

       turn = highestPlayer;

       highestCard = 0; //Reseting the selected highest card
       highestPlayer = 0; //Reseting the player with the highest card
       roundPinte = false; //Reseting the main suite of the round

       // Retrasamos la siguiente tirada.
       timeout = 1;

       //Comprobación de cante
       var seVaACantar = checkCante(team);
       if(seVaACantar == true){
           timeout = 3;
           console.log("Sa han comprobado los cantes y se va a retrasar el cambio de turno para cantar.");
       }

   }else{

       turn++;
       if(turn == 5) turn=1;

   }

   // Resaltado del jugador al que le toque
   resaltarJugador(turn);


   console.log("Turno "+turn);
   console.log("Puntos Cante 1: "+puntosCante[1])
   console.log("Puntos Cante 2: "+puntosCante[2])

   //Guardamos la partida
   saveGame();

   // Get Usable Cards
   getCardsToUse();

   // Si a nadie le quedan cartas se acaba la partida
   if((cartasJugador[1].length==0) && (cartasJugador[2].length==0) && (cartasJugador[3].length==0) && (cartasJugador[4].length==0)){

       // Quitamos todos los resaltados de turno
       resaltarJugador();

       //Añadimos las 10 de últimas
       var puntosUltimas; // Guardamos qué equipo se lleva las diez de últimas para declarar el ganador en caso de empate.
       if((turn==1) || (turn==3)){
           puntos[1] += 10; puntosUltimas = 1;
           showMsg("Equipo 1 suma las 10 de últimas");
           new jobObj({
               duration: 1,
               action: function(){ anadirPuntos(1,[10]); }
           });
       }else{
           puntos[2] += 10; puntosUltimas = 2;
           showMsg("Equipo 2 suma las 10 de últimas");
           new jobObj({
               duration: 1,
               action: function(){ anadirPuntos(2,[10]); }
           });
       }

       console.log("SE ACABO LA RONDA\n* Puntos T1: " + puntos[1] + "\n* Puntos T2: " + puntos[2]);
       saque++;
       if(saque==5) saque=1;
       localStorage.setItem("saque",saque);

       // Añadimos la partida al recuento de garbanzos
       if( puntos[1] > puntos[2] ){
           if(puntos[1] > 100){
               garbanzos[1] += 2;
           }else{ garbanzos[1] += 1; }
       }else if( puntos[2] > puntos[1] ){
               if(puntos[2] > 100){
               garbanzos[2] += 2;
           }else{ garbanzos[2] += 1; }
       }else{
           console.log('EMPATE!');
           garbanzos[puntosUltimas] += 1; // Se lleva el punto el que se llevó las 10 de últimas.
       }

       // >>>>> Para jugar con puntuación doble a partir de 120
       // // Añadimos la partida al recuento de garbanzos
       // if(puntos[1] > puntos[2]){
       //     if( (puntos[1] > 120) || ((puntos[1] > 100) && (puntosCante[1].length == 0)) ){
       //         garbanzos[1] += 2;
       //     }else{ garbanzos[1] += 1; }
       // }else if(puntos[2] > puntos[1]){
       //         if( (puntos[2] > 120) || ((puntos[2] > 100) && (puntosCante[2].length == 0)) ){
       //         garbanzos[2] += 2;
       //     }else{ garbanzos[2] += 1; }
       // }else{
       //     console.log('EMPATE!');
       //     garbanzos[puntosUltimas] += 1; // Se lleva el punto el que se llevó las 10 de últimas.
       // }

       //Guardamos la partida
       saveGame();

       // En caso de que la partida se haya acabado borramos la partida guardada y desactivamos el botón btnReanudar
       if((garbanzos[1] > garbanzos[2]) && (garbanzos[1] > 5) || (garbanzos[2] > garbanzos[1]) && (garbanzos[2] > 5)){
           // Se actualiza el saque que viene guardado
           localStorage.setItem("saque",saque);
           // Borramos el juego guardado
           localStorage.removeItem("savedGame");
           document.getElementById("btnReanudar").style.opacity = 0.5;
       }
       
       new jobObj({
           delay: 1,
           delayAction: mostrarGarbanzos,
           duration: 0.5,
           action: function(){ mostrarResumenPartida(puntosUltimas); }
       });

   }else if(turn != 1){ // <-- Cambiar a 0 para el juego automático -- 1
       new jobObj({
           duration: timeout,  // <-- Cambiar a 0 para juego automático <-- timeout
           action: jugar
       });
   }else if(turn == 1){
       highlightPosibles(); // Si highlight está desactivado se comprueba en la función highlightPosibles()
   }

}

function mostrarResumenPartida(puntosUltimas){

   // Quitamos todos los resaltados de turno
   resaltarJugador(false);

   // Se preparan los mensajes para mostrar las puntuaciones.
   var ganadorRonda, sumar, ganadorGeneral, tocar, boton;
   if(puntos[1] > puntos[2]){

       ganadorRonda = "El equipo " + 1 + "<br/>gana la ronda por";
       // if( (puntos[1] > 120) || ((puntos[1] > 100) && (puntosCante[1].length == 0)) ){
       if(puntos[1] > 100){
           sumar = 'y suma 2 puntos';
       }else{ sumar = 'y suma 1 punto'; }

   }else if(puntos[2] > puntos[1]){

       ganadorRonda = "El equipo " + 2 + "<br/>gana la ronda por";
       // if( (puntos[2] > 120) || ((puntos[2] > 100) && (puntosCante[2].length == 0)) ){
       if(puntos[2] > 100){
           sumar = 'y suma 2 puntos';
       }else{ sumar = 'y suma 1 punto'; }

   }else if(puntos[1] == puntos[2]){

       ganadorRonda = "Hay un empate.<br/>El equipo " + puntosUltimas + " gana por";
       sumar = "haberse llevado las 10 de últimas.";
       
   }

   if((garbanzos[1] > garbanzos[2]) && (garbanzos[1] > 5)){
       ganadorGeneral = "El equipo " + 1 + "<br/>ha ganado por";
       tocar = 'Toca la pantalla para terminar la partida.';
       boton = terminarPartida;
   }else if((garbanzos[2] > garbanzos[1]) && (garbanzos[2] > 5)){
       ganadorGeneral = "El equipo " + 2 + "<br/>ha ganado por";
       tocar = 'Toca la pantalla para terminar la partida.';
       boton = terminarPartida;
   }else if(garbanzos[1] == garbanzos[2]){
       ganadorGeneral = "Hay un empate por";
       tocar = 'Toca la pantalla para continuar.';
       boton = reiniciarPartida;
    //    boton = terminarPartida;
   }else if(garbanzos[1] > garbanzos[2]){
       ganadorGeneral = "El equipo " + 1 + "<br/>va ganando por";
       tocar = 'Toca la pantalla para continuar.';
       boton = reiniciarPartida;
    //    boton = terminarPartida;
   }else if(garbanzos[2] > garbanzos[1]){
       ganadorGeneral = "El equipo " + 2 + "<br/>va ganando por";
       tocar = 'Toca la pantalla para continuar.';
       boton = reiniciarPartida;
    //    boton = terminarPartida;
   }

   document.getElementById("notifGanadorRonda").innerHTML = ganadorRonda;
   document.getElementById("notifPuntos").innerHTML = puntos[1] + ' a ' + puntos[2];
   document.getElementById("notifSumar").innerHTML = sumar + '.<br/><br/>';
   document.getElementById("notifGanadorGeneral").innerHTML = ganadorGeneral;
   document.getElementById("notifGarbanzos").innerHTML = garbanzos[1] + ' a ' + garbanzos[2] + '<br/><br/>';
   document.getElementById("notifTocar").innerHTML = tocar;

   notificationBackground.style.display = "block";
   notificationBackground.onclick = boton;
//    notificationBackground.ontouchend = boton;

}

function reiniciarPartida(){
// saque=1;
   // Tomamos el turno
   turn = saque; //saque
   
   console.log('Es el turno del jugador ' + turn);
   
   // Orden de las cartas del jugador 1
   reversedCards = false;

   // Se elimina el pinte del encabezado
   pinteMarcador.style.backgroundImage = 'none';
   pinteMarcador.style.opacity = 0;

   // Ocultamos el botón de cante y mensajes por si entuvieran activos
   mensajes.style.opacity = 0;
   botonCante.style.display = "none";
   botonCante.onmouseup = false;
   notificationBackground.style.display = "none";
   resaltarJugador(false);

   // Reset MustBeRendered Variables
   for(i=0; i<canvasList.length; i++){
       canvasMustBeRendered[canvasList[i]] = true;    
   }
   

   setPage('mesa');

   //Si la música está activada, la reproducimos
//    musicStop(); // Como reiniciamos una partida, debemos resetar la música al principio.
   musicPlay();

   // Se restaura la posición incial de las cartas para volver a repartir y empezar la partida
   for(i=1; i<=40; i++){
       cartas[i].resize(posInicial);
       cartas[i].rotateY = 180;
       cartas[i].rotateZ = 0;
       cartas[i].grayscale = 0;
   }
   cartasJugador[1] = [];	cartasJugador[2] = [];	cartasJugador[3] = [];	cartasJugador[4] = [];
   cartasJugada[1] = 0; cartasJugada[2] = 0; cartasJugada[3] = 0; cartasJugada[4] = 0;
   cartasEquipo[1] = []; cartasEquipo[2] = [];
   cantar[1] = []; cantar[1][0] = true; cantar[1][1] = []; cantar[1][3] = [];
   cantar[2] = []; cantar[2][0] = true; cantar[2][2] = []; cantar[2][4] = [];
   puntosCante[1] = []; puntosCante[2] = [];
   puntos[1] = 0; puntos[2] = 0;
   roundPinte = false;
   roundPriorities = [];
   cardsToUse = [];
   
   // Hay que ponerlas a cero pues parece que si no se pasan a la siguiente partida a veces.
   highestCard = 0;
   highestPlayer = 0;

   // Para que no se guarden los cantes de una partida a otra hay que resetear las siguientes variables
   // ¡¡¡No está claro que funcione!!!
   if (typeof _listener.remove === "function") { 
       // safe to use the function
       _listener.remove(_listener.t);
   }
   _listener = false;
   _cantando = false;

   tantos[1].innerHTML = '0';
   tantos[2].innerHTML = '0';

   mostrarGarbanzos();

   new jobObj({
       duration: 1,
       action: barajar
   });
   
}

function terminarPartida(){

    // Admob interstitial
    if( ((garbanzos[1] > garbanzos[2]) && (garbanzos[1] > 5)) || ((garbanzos[2] > garbanzos[1]) && (garbanzos[2] > 5)) ){
        onGameOver();
    }

    setPage('menu');
    musicPause();
    // musicStop();
    jobs = [];

    notificationBackground.style.display = "none";
    for(i=1; i<=40; i++){
        cartas[i].resize(posInicial);
        cartas[i].rotateY = 180;
        cartas[i].rotateZ = 0;
    }
    cartasJugador[1] = [];	cartasJugador[2] = [];	cartasJugador[3] = [];	cartasJugador[4] = [];
    cartasJugada[1] = 0; cartasJugada[2] = 0; cartasJugada[3] = 0; cartasJugada[4] = 0;
    cartasEquipo[1] = []; cartasEquipo[2] = [];
    cantar[1] = []; cantar[1][0] = true; cantar[1][1] = []; cantar[1][3] = [];
    cantar[2] = []; cantar[2][0] = true; cantar[2][2] = []; cantar[2][4] = [];
    puntosCante[1] = []; puntosCante[2] = [];
    puntos[1] = 0; puntos[2] = 0;
    garbanzos[1] = 0; garbanzos[2] = 0;

    roundPinte = false;
    roundPriorities = [];
    cardsToUse = [];

    // Hay que ponerlas a cero pues parece que si no se pasan a la siguiente partida a veces.
    highestCard = 0;
    highestPlayer = 0;

    // Para que no se guarden los cantes de una partida a otra hay que resetear las siguientes variables
    // ¡¡¡No está claro que funcione!!!
    if (typeof _listener.remove === "function") { 
        // safe to use the function
        _listener.remove(_listener.t);
    }
    _listener = false;
    _cantando = false;

    tantos[1].innerHTML = '0';
    tantos[2].innerHTML = '0';

    pinteMarcador.style.backgroundImage = "none";

    resaltarJugador(false);

}

function mostrarGarbanzos(){

   for(i=1;i<=2;i++){

       for(g=1; g<=7; g++){

           if(g<=garbanzos[i]){
               document.getElementById("garbanzo"+i+g).style.display = "block";
           }else{
               document.getElementById("garbanzo"+i+g).style.display = "none";
           }

       }

   }

}

//Funciones para el cante
function checkCante(team){

   //Comprobamos si se puede cantar o no
   if(cantar[team][0] == false){ cantico(team); return; }

   for(i=0;i<equipo[team].length;i++){ //Comprobamos las cartas de los dos jugadores que ganan la mano

       if(cantar[team][equipo[team][i]] == -1) continue;
       cantar[team][equipo[team][i]].length = 0; //Reseteamos los cantes del jugador por si se los han quitado

       for(p=0;p<palos.length;p++){ //Recorremos los cuatro palos palos del cante

           var cont = 0; //Se cuentan el número de coincidencias. Si son dos será que puede cantar

           for(c=0;c<cantes[palos[p]].length;c++){ //Recorremos las dos cartas del cante en cuestión buscándolas entre las cartas del jugador

               var pos = cartasJugador[equipo[team][i]].indexOf(cantes[palos[p]][c]); //Buscamos la canta del cante
               if(pos != -1){
                   cont++; // Si está sumamos 1 a las coincidencias

                   if(cont == 2){ // Si hay dos coincidencias es que hay cante en ese palo

                       if(puntosCante[team].indexOf(palos[p]) == -1){ //Comprobamos si no se ha cantado ya con estas cartas
                           console.log("El jugador " + equipo[team][i] + " puede cantar en " + palos[p]);
                           cantar[team][equipo[team][i]].push(palos[p]);
                       }

                   }

               }

           }

       }

       console.log("Cantes jugador " + equipo[team][i] + ": " + cantar[team][equipo[team][i]]);

   }

   return(cantico(team));


}

var _listener = false; // _listener es público porque ha de ser llamado y eliminado públicamente cuando se echa carta en vez de cantar.
function cantico(team){

   seVaACantar = false;

   var canteFalse = 0;
   //Miramos en los jugadores a ver qué cante tienen
   for(i=0;i<equipo[team].length;i++){

       if(cantar[team][equipo[team][i]].length > 0){  // Si se cumple es que el jugador puede cantar

           var pos = cantar[team][equipo[team][i]].indexOf(pinte);
           //console.log(pos);
           if(pos != -1){ // El pinte son las 40

               seVaACantar = true;

               if(equipo[team][i] == 1) // Si el jugador que va a cantar es el 1, se muestra un botón para que lo haga. Si no, se canta automáticamente.
               {
                   var jugadorCantar = equipo[team][i]; // <-- Es el jugador que va cantar
                   puntosCante[team].push(pinte);
                   cantar[team][jugadorCantar].splice(pos,1);
                   
                   botonCante.onmouseup = function(){
                       _listener.remove(_listener.t);
                       botonCante.style.display = "none";
                       mostrarCante(jugadorCantar,pinte,team);
                       console.log("El jugador " + jugadorCantar + " canta las 40");
                       puntos[team] += 40;
                       botonCante.onmouseup = false;
                       _listener = false;
                   };
                   botonCante.style.display = "block";
                   botonCante.style.opacity = 1;
                   
                   // Se hace parpadear el botón
                   for(p=0; p<12; p++){
                       new jobObj({
                           delay: p*0.6,
                           delayAction: function(){ botonCante.style.opacity = 0; },
                           duration: 0.3,
                           action: function(){ botonCante.style.opacity = 1; }
                       });
                   }
                   _listener = new jobObj({
                       // elm: botonCante,
                       duration: 3.5,
                       action: function(){
                           botonCante.style.display = "none"; // Se oculta el botón
                           botonCante.onmouseup = false; // YA no hay función al clicar
                           cantar[team][jugadorCantar] = -1; // Si no se canta se perderá la opción a volver a cantar.
                           console.warn("Este jugador ya no podrá cantar");
                           _listener.remove(_listener.t);
                           _listener = false;
                       }
                   });
                   console.log(botonCante);

               }else{
                   mostrarCante(equipo[team][i],pinte,team);
                   console.log("El jugador " + equipo[team][i] + " canta las 40 en " + pinte);
                   puntosCante[team].push(pinte);
                   cantar[team][equipo[team][i]].splice(pos,1);
                   puntos[team] += 40;
               }

           }else{

               // Se cantan unas 20
               seVaACantar = true;

               if(equipo[team][i] == 1) // Si el jugador que va a cantar es el 1, se muestra un botón para que lo haga. Si no, se canta automáticamente.
               {
                   var paloCantar = cantar[team][equipo[team][i]][0]; // <-- Es el palo en el que se va a cantar al pulsar el botón
                   var jugadorCantar = equipo[team][i]; // <-- Es el jugador que va cantar
                   puntosCante[team].push(paloCantar);
                   cantar[team][jugadorCantar].splice(0,1);
                   
                   botonCante.onmouseup = function(){
                       _listener.remove(_listener.t);
                       botonCante.style.display = "none";
                       mostrarCante(jugadorCantar,paloCantar,team);
                       console.log("El jugador " + jugadorCantar + " canta 20 en " + paloCantar);
                       puntos[team] += 20;
                       botonCante.onmouseup = false;
                       _listener = false;
                   };
                   botonCante.style.display = "block";
                   botonCante.style.opacity = 1;
                   
                   // Se hace parpadear el pinte
                   for(p=0; p<12; p++){
                       new jobObj({
                           delay: p*0.6,
                           delayAction: function(){ botonCante.style.opacity = 0; },
                           duration: 0.3,
                           action: function(){ botonCante.style.opacity = 1; }
                       });
                   }
                   _listener = new jobObj({
                       // elm: botonCante,
                       duration: 3.5,
                       action: function(){
                           botonCante.style.display = "none"; // Se oculta el botón
                           botonCante.onmouseup = false; // YA no hay función al clicar
                           cantar[team][jugadorCantar] = -1; // Si no se canta se perderá la opción a volver a cantar.
                           console.warn("Este jugador ya no podrá cantar");
                           _listener.remove(_listener.t);
                           _listener = false;
                       }
                   });
                   // console.log(botonCante);
                   
               }else{
                   mostrarCante(equipo[team][i],cantar[team][equipo[team][i]][0],team);
                   console.log("El jugador " + equipo[team][i] + " canta 20 en " + cantar[team][equipo[team][i]][0]);
                   puntosCante[team].push(cantar[team][equipo[team][i]][0]);
                   cantar[team][equipo[team][i]].splice(0,1);
                   puntos[team] += 20;
               }
           }

       canteFalse += cantar[team][equipo[team][i]].length;

       }

   }

   console.log("canteFalse: " + canteFalse);
   if(canteFalse == 0) cantar[team][0] = false;

   return(seVaACantar);

}

function think(){

   //Primero vamos a contemplar las posibilidades si se es el primero de la ronda
   if((cartasJugada[1]==0) && (cartasJugada[2]==0) && (cartasJugada[3]==0) && (cartasJugada[4]==0)){

       /* Vamos a buscar a ver qué cantes han salido ya
       * Para ello añadiremos a un array "cantados" los palos que ya se hayan cantado
       * Después buscaremos entre las cartas jugadas los cavallos y los relles para incluir sus palos también
       */

       // INICIO BUSQUEDA ASES
       //Lo primero buscamos los ases
       var ases = [1,11,21,31];
       var asesPosibles = [];
       var continuar = false;

       for(i=0;i<ases.length;i++){
           if(cartasJugador[turn].indexOf(ases[i]) != -1){
               console.log("La carta " + ases[i] + " está en entre las cartas del jugador " + turn);

               if((cantar[1][0] == true) || (cantar[2][0] == true)){

                   //Si encontramos un as miramos si es de un palo que ya se ha cantado
                   for(t=1;t<=2;t++){

                       for(c=0;c<puntosCante[t].length;c++){

                           if(palos[puntosCante[t][c]].indexOf(ases[i]) != -1){
                               //Si lo encontramos en un palo que ya se ha cantado lo añadimos a la lista de ases posibles por la cola
                               console.log("Lo metemos por la cola porque ya se ha cantado");
                               asesPosibles.push(ases[i]);
                               continuar = true;
                           }

                       }

                   }
                   if(continuar == true) continue;


                   //Si encontramos cavallos o reyes entre nuestras cartas del mismo palo que el as tampoco será prioritario
                   //Recorremos entonces todas las cartas del jugador en busca de cavallos o reyes
                   for(p=0;p<palos.length;p++){
   //					console.log(cantes[palos[p]][0]);
                       if( (cartasJugador[turn].indexOf(cantes[palos[p]][0]) != -1) || (cartasJugador[turn].indexOf(cantes[palos[p]][1]) != -1) ){
   //						console.log("Se ha encontrado la carta " + cantes[palos[p]][0] + " o " + cantes[palos[p]][1]);
                           if(palos[palos[p]].indexOf(ases[i]) != -1){
                               //Si lo encontramos en un palo del que tenemos reyes o cavallos lo añadimos a la lista de ases posibles por la cola
                               console.log("Lo metemos por la cola porque tenemos el rey o cavallo");
                               asesPosibles.push(ases[i]);
                               continuar = true;
                           }

                       }

                   }
                   if(continuar == true) continue;

               }

               asesPosibles.unshift(ases[i]);

           }

       }

       console.log("Los ases encontrados son: ");
       console.log(asesPosibles);
       if(asesPosibles.length > 0) return asesPosibles[0];

       // FIN BUSQUEDA ASES


       // INICIO BUSQUEDA TRESES
       //Lo segundo buscamos los treses y los echamos si es que no han salido aun sus 20 o 40
       var treses = [3,13,23,33];
       var tresesPosibles = [];
       for(i=0;i<treses.length;i++){

           if(cartasJugador[turn].indexOf(treses[i]) != -1){
               console.log("La carta " + treses[i] + " está en entre las cartas del jugador " + turn);

               if((cantar[1][0] == true) || (cantar[2][0] == true)){

                   //Si encontramos un tres miramos si es de un palo que ya se ha cantado
                   for(t=1;t<=2;t++){

                       for(c=0;c<puntosCante[t].length;c++){

                           if(palos[puntosCante[t][c]].indexOf(treses[i]) != -1){
                               //Si lo encontramos en un palo que ya se ha cantado lo añadimos a la lista de treses posibles por la cola
                               //Pero en este caso solo lo podremos meter si el as del mismo palo ya ha salido

                               if((cartasEquipo[1].indexOf(ases[i]) != -1) || (cartasEquipo[2].indexOf(ases[i]) != -1)){
                                   console.log("Lo metemos por la cola porque ya se ha cantado en este palo");
                                   tresesPosibles.push(treses[i]);
                                   continuar = true;
                               }

                           }

                       }

                   }
                   if(continuar == true) continue;


                   //Si encontramos cavallos o reyes entre nuestras cartas del mismo palo que el tres tampoco será prioritario
                   //Recorremos entonces todas las cartas del jugador en busca de cavallos o reyes
                   for(p=0;p<palos.length;p++){
   //					console.log(cantes[palos[p]][0]);
                       if( (cartasJugador[turn].indexOf(cantes[palos[p]][0]) != -1) || (cartasJugador[turn].indexOf(cantes[palos[p]][1]) != -1) ){
   //						console.log("Se ha encontrado la carta " + cantes[palos[p]][0] + " o " + cantes[palos[p]][1]);
                           if(palos[palos[p]].indexOf(treses[i]) != -1){
                               //Si lo encontramos en un palo del que tenemos reyes o cavallos lo añadimos a la lista de ases posibles por la cola
                               //Pero en este caso solo lo podremos meter si el as del mismo palo ya ha salido

                               if((cartasEquipo[1].indexOf(ases[i]) != -1) || (cartasEquipo[2].indexOf(ases[i]) != -1)){
                                   console.log("Lo metemos por la cola porque tenemos el rey o cavallo");
                                   tresesPosibles.push(treses[i]);
                                   continuar = true;
                               }
                           }

                       }

                   }
                   if(continuar == true) continue;

               }

               if((cartasEquipo[1].indexOf(ases[i]) != -1) || (cartasEquipo[2].indexOf(ases[i]) != -1)){
                   tresesPosibles.unshift(treses[i]);
               }

           }

       }

       console.log("Los treses encontrados son: ");
       console.log(tresesPosibles);
       if(tresesPosibles.length > 0) return tresesPosibles[0];

       // FIN BUSQUEDA TRESES


       // INICIO BUSQUEDA REYES
       //Lo tercero buscamos los reyes
       var reyes = [10,20,30,40];
       var reyesPosibles = [];
       for(i=0;i<reyes.length;i++){

           if(palos[pinte].indexOf(reyes[i]) != -1) continue; //No se contempla si el rey es triunfo

           if(cartasJugador[turn].indexOf(reyes[i]) != -1){
               console.log("La carta " + reyes[i] + " está en entre las cartas del jugador " + turn);

               // Lo añadimos a reyesPosibles si el as y el tres del mismo palo ya han salido
               if( (cartasEquipo[1].indexOf(ases[i]) != -1) || (cartasEquipo[2].indexOf(ases[i]) != -1) &&
               (cartasEquipo[1].indexOf(treses[i]) != -1) || (cartasEquipo[2].indexOf(treses[i]) != -1) ){
                   reyesPosibles.push(reyes[i]);
               }

           }

       }

       console.log("Los reyes encontrados son: ");
       console.log(reyesPosibles);
       if(reyesPosibles.length > 0) return reyesPosibles[0];

       // FIN BUSQUEDA REYES


       //Si no hay ni ases ni treses ni reyes para echar vamos a seleccionar una carta baja
       //Preferiblemente que no sea triunfo para guardarlo para el final

       var cartaBaja = 0;
       var tempIndex = -1;
       for(i=0;i<cartasJugador[turn].length;i++){
           console.log(cartasJugador[turn][i]);
           var paloTemp;
           if(cartasJugador[turn][i] < 11){ paloTemp = "oros"; }
           else if(cartasJugador[turn][i] < 21){ paloTemp = "copas"; }
           else if(cartasJugador[turn][i] < 31){ paloTemp = "espadas"; }
           else if(cartasJugador[turn][i] < 41){ paloTemp = "bastos"; }

           if(cartaBaja == 0){
               cartaBaja = cartasJugador[turn][i];
               tempIndex = palos[paloTemp].indexOf(cartasJugador[turn][i]);
               console.log("Nueva cartaBaja con index " + tempIndex);
           }else if((palos[paloTemp].indexOf(cartasJugador[turn][i]) > tempIndex) && (paloTemp != pinte)){
               cartaBaja = cartasJugador[turn][i];
               tempIndex = palos[paloTemp].indexOf(cartasJugador[turn][i]);
               console.log("Cambiada la carta Baja con index " + tempIndex);
           }else if(palos[paloTemp].indexOf(cartasJugador[turn][i]) > tempIndex){
               cartaBaja = cartasJugador[turn][i];
               tempIndex = palos[paloTemp].indexOf(cartasJugador[turn][i]);
               console.log("Cambiada la carta Baja con index " + tempIndex);
           }
       }

       if(cartaBaja != 0) return cartaBaja;


   }else{

       //Se contemplan las posibilidades si no se es el primero de la ronda

       console.log(cardsToUse);

       var mejorCarta;

       if(cardsToUse.length == 1){ //Solo se tiene una carta para echar
           console.log("Solo hay una opcion: " + cardsToUse[0]);
           mejorCarta = cardsToUse[0];
       }else{
           var highestPos = roundPriorities.indexOf(highestCard);
           var currentPos = roundPriorities.indexOf(cardsToUse[0]);
           if((currentPos < highestPos) && (currentPos != -1)){ // Si se tiene carta para matar

               console.log("Sí se tiene carta para matar");

               if(cartasJugador[turn].indexOf(palos[roundPinte][0]) != -1){ //Si se tiene el as, se tira el as
                   mejorCarta = palos[roundPinte][0];
               }else if( (cartasEquipo[1].indexOf(palos[roundPinte][0]) == -1) || (cartasEquipo[2].indexOf(palos[roundPinte][0]) == -1)){ //Si no se ha usado el as todavía se es cauto al echar carta
                   mejorCarta = cardsToUse[cardsToUse.length-1];
               }else{ // Si no se cumple lo anterior se va saco
                   mejorCarta = cardsToUse[0];
               }

           }else{ //Si no se tiene carta para matar

               console.log("NO se tiene carta para matar");

               //Vamos a ver de qué equipo es la ronda para actuar en función de ello
               var highestTeam;
               if(highestPlayer == 1 || highestPlayer == 3){ highestTeam = 1; }else{ highestTeam = 2; }
               var currentTeam;
               if(turn == 1 || turn == 3){ currentTeam = 1; }else{ currentTeam = 2; }

               if(highestTeam == currentTeam){

                   //Se echa una carta teniendo en cuenta que la baza es del compañero
                   console.log("La baza es del compañero");

                   //Recorremos las cartas cardToUse para encontrar la que valga más
                   for(i=0;i<cardsToUse.length;i++){ //Si no se ha escogido una carta
                       if(mejorCarta == undefined){
                           mejorCarta = cardsToUse[i];
                       }else if(values[mejorCarta] < values[cardsToUse[i]]){ //Si el valor es más alto
                           mejorCarta = cardsToUse[i];
                       }
                   }
               }else{
                   //Se echa una carta teniendo en cuenta que la baza es del contrincante
                   //Se echará la carta de menor puntuación
                   console.log("La baza es del contrincante");

                   //Recorremos las cartas cardsToUse para ver cual es la más baja
                   for(i=0;i<cardsToUse.length;i++){ //Si no se ha escogido una carta
                       if(mejorCarta == undefined){
                           mejorCarta = cardsToUse[i];
                       }else if(values[mejorCarta] > values[cardsToUse[i]]){ //Si el valor es más bajo
                           mejorCarta = cardsToUse[i];
                       }else if(values[mejorCarta] == values[cardsToUse[i]]){ //Si el número de carta es también más bajo
                           var fin1 = mejorCarta.toString().split('').pop();
                           var fin2 = cardsToUse[i].toString().split('').pop();
                           if(fin1 > fin2){
                               mejorCarta = cardsToUse[i];
                           }
                       }
                   }

               }

           }

       }

       console.log("MEJOR CARTA A SELECCIONAR: " + mejorCarta);
       return mejorCarta;

   }

}

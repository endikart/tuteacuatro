//ADMOB
var admobid = {};

// TODO: replace the following ad units with your own
if( /(android)/i.test(navigator.userAgent) ) {
  admobid = {
    banner: 'ca-app-pub-3940256099942544/6300978111', // for testing

    interstitial: 'ca-app-pub-3940256099942544/1033173712', // for testing

    rewardvideo: 'ca-app-pub-3940256099942544/5224354917', // for testing
  };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid = {
       banner: 'ca-app-pub-3940256099942544/2934735716', // for testing

       interstitial: 'ca-app-pub-3940256099942544/4411468910', // for testing

      rewardvideo: 'ca-app-pub-3940256099942544/1712485313', // for testing
    };
} else {
  admobid = { // for Windows Phone, deprecated
    banner: '',
    interstitial: '',
    rewardvideo: '',
  };
}

// let banner
let interstitial

document.addEventListener('deviceready', async () => {

    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    
    // Mostrar la versión actual
    cordova.getAppVersion.getVersionNumber(function (version) {
        document.getElementById("version").innerHTML = version;
    });
    // alert(device.platform);

    // Media
    if((device.platform == "Android") || (device.platform == "iOS")) setMedia();

    // StatusBar
    if(device.platform == "iOS"){
        // En iOS no se pone en pantalla completa para que no interfiera el notch
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByName("black");
    }else if(device.platform == "Android"){
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByName("black");
        /* Nothing to do */
    }

    // Ocultamos el SplashScreen
//    navigator.splashscreen.hide();

    // Ocultar botón salir
    if(window.cordova && device.platform == 'iOS'){
        ocultarBtnSalir();
    }


    // ADMOB
	// Pedimos autorización ipda??
	if(window.cordova && device.platform == 'iOS'){
		admob.requestTrackingAuthorization()
	}

    admob.configure({
        testDeviceIds: [],
    })

    // Banner
    banner = new admob.BannerAd({
        adUnitId: admobid.banner,
        position: 'top',  // display banner at the top of screen
        backgroundColor: 'black'
    })

    // banner.on('impression', async (evt) => {
    //     await banner.hide()
    // })

    await banner.show()

    // Interstitial
    interstitial = new admob.InterstitialAd({
        adUnitId: admobid.interstitial,
    })

    interstitial.on('load', (evt) => {
        console.log("Admob Interstitial Ad Loaded!");
    })

    await interstitial.load()
    
}, false);

document.addEventListener('admob.ad.dismiss', async () => {
/*
    banner.hide()
    setTimeout(function(){
        banner.show();
        resize();
    }, 1000);
*/  
    // Once a interstitial ad is shown, it cannot be shown again.
   // Starts loading the next interstitial ad as soon as it is dismissed.
   await interstitial.load()
})

async function onGameOver(){ //call this fun to show when game over

    if(window.cordova){ await interstitial.show() }

}

function onPause() {
    // Handle the pause event
    mJuego.pause();
}

function onResume() {
    // Handle the resume event
    if(mJuego == '') setMedia();
    if(document.getElementById('mesa').style.display == "block") musicPlay();
/*
	setTimeout(function() {
		banner.hide()
		setTimeout(function(){
			banner.show();
			resize();
		}, 1000);
	}, 0);
*/
}

function backButtonPressed(){
    onBackKeyDown();
}

function onAppQuit(){
    musicStop();
    mJuego = '';
    navigator.app.exitApp();
}

function onBackKeyDown() {

    if(document.getElementById("menu").style.display == "block" && window.cordova){
        document.removeEventListener("backbutton", onBackKeyDown, false);
        document.addEventListener("backbutton", quitApp, false);
        window.plugins.toast.show("Presiona de nuevo para salir.", 2000, 'bottom', function(a){console.log('toast success: ' + a);}, function(b){alert('toast error: ' + b);});

        setTimeout(function(){
            document.removeEventListener("backbutton", quitApp, false);
            document.addEventListener("backbutton", onBackKeyDown, false);
        },2000);
    }else{
        setPage("menu");
    }

    // Music stops anyway
    // musicPause();
    // musicStop();

}

 

/* Funciones de los botones que dependen de la plataforma */

function quitApp(){
    if(window.cordova){
        if(device.platform == "Android") { onAppQuit(); }
    }else{
        window.location.href="https://brucomis.github.io/";
    }
}
function rateApp(){
    if(window.cordova){
        AppRate.setPreferences({
          storeAppURL: {
              ios: '6448667427',
              android: 'market://details?id=com.aurumque.tuteacuatro'
          }
        });
        AppRate.promptForRating();
    }else{
        window.location.href="https://play.google.com/store/apps/details?id=com.aurumque.tuteacuatro";
    }
}
function shareApp(){
    if(window.cordova){
        if(device.platform == "Android"){
            window.plugins.socialsharing.share("Ey!! Descárgate el Tute a Cuatro para Android. Está GENIAL!!!", 'Tute A Cuatro', 'www/img/tuteacuatro_sharing.png', 'https://play.google.com/store/apps/details?id=com.aurumque.tuteacuatro');
        }else if(device.platform == "iOS"){
            window.plugins.socialsharing.share("Ey!! Descárgate el Tute a Cuatro para iOS. Está GENIAL!!!", 'Tute A Cuatro', 'www/img/tuteacuatro_sharing.png', 'https://apps.apple.com/us/app/tute-a-cuatro/id6448667427');
        }
    }else{
        window.location.href="https://api.whatsapp.com/send?text=http://www.aurumlinux.com/tuteacuatro/ - El juego de cartas Tute a Cuatro ahora para el móvil. Está GENIAL!!!";
    }
}
function twitter(){
    if(window.cordova){
        if(device.platform == "Android"){ navigator.app.loadUrl('https://twitter.com/brucomis', { openExternal:true });
        }else if(device.platform == "iOS"){
            cordova.InAppBrowser.open('https://twitter.com/brucomis', '_system', 'location=yes');
            // window.open('https://twitter.com/brucomis', '_system');
        }
    }else{
        window.location.href="https://twitter.com/brucomis";
    }

}

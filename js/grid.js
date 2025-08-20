function grid(){

    var steps = 100;
    var hStep = window.innerHeight / steps;
    var wStep = window.innerWidth / steps;

    ctx.save();
    ctx.translate(0,0);
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.font = vh(1.5)+"px Arial";

    for(i=0; i<=steps; i++){
        ctx.beginPath();
        ctx.moveTo(0,hStep*i);
        ctx.lineTo(wWidth,hStep*i);
        ctx.closePath();
        if(i%5 == 0){
            ctx.fillText((100/steps)*i, 5, hStep*i-5);
            ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        }else{
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        }
        ctx.stroke();

    }
    for(i=0; i<=steps; i++){
        ctx.beginPath();
        ctx.moveTo(wStep*i,0);
        ctx.lineTo(wStep*i,wHeight);
        ctx.closePath();
        if(i%5 == 0){
            ctx.fillText((100/steps)*i, wStep*i+5, 25);
            ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        }else{
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        }
        ctx.stroke();

    }
    ctx.restore();
}

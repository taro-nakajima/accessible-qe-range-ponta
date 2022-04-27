var version = "1.0";
var Ei_numMax=1;
var Ei = new Array(Ei_numMax);
var decimal_digit = 1000;
var isOptimumEi= (new Array(Ei_numMax)).fill(true);

var DetBankNum = 1;
var tth_Max = new Array(DetBankNum);
var tth_Min = new Array(DetBankNum);

var eps=1e-6;

var T0_Chop_Const = 77.0/(2.0*Math.PI*300.0)*1000;     // (ms/Hz) cited from S. Itoh et al. Nuc. Inst. Methods in Phys. Research A61 86-92 (2012).

var Al_d=[2.338124,2.024875,1.431803,1.221046,1.169062,1.012437, 0.929076,0.905552 ];

var RefCon="none";

function draw() {
    document.getElementById("verNum").innerHTML=version;
    document.getElementById("verNum2").innerHTML=version;

    set_ReflectionCondition();

    draw_Qxy();

}


function draw_Qxy(){

    let canvas3 = new Array(Ei_numMax);
    let context3 = new Array(Ei_numMax);

    let scale0 = 1;   // 2ki = canvas.width/2 when scale0=1.0

    let scale = new Array(Ei_numMax);
    let frac_hbw = new Array(Ei_numMax);

    let radius = 3; // radius for each reciprocal lattice point

    let Ef= Number(document.getElementById('Ef').value);
    let kf=Math.sqrt(Ef/2.072);

    for (let j=0;j<Ei_numMax;j+=1){
        let labelCanvasQxy='CanvasQxy'+(Math.round(j+1));
        canvas3[j] = document.getElementById(labelCanvasQxy);
        context3[j] = canvas3[j].getContext('2d');
        scale[j] = canvas3[0].width/2.0/(2.0*kf)*scale0;

//        var labelFrac_hbw='frac_hbw'+(Math.round(j+1));
//        frac_hbw[j] = Number(document.getElementById(labelFrac_hbw).value);

//        var labelHbw='hbw'+(Math.round(j+1));
//        document.getElementById(labelHbw).value = Math.round(Ef*frac_hbw[j]*decimal_digit)/decimal_digit;

    }

    var originX = canvas3[0].width/2.0;
    var originY = canvas3[0].height/2.0;
   
    var omg_1 = Number(document.getElementById('omega1').value);
    var omg_2 = Number(document.getElementById('omega2').value);
    var omg_ofst = Number(document.getElementById('omg_ofst').value);

    var psi1 = -(omg_1-omg_ofst);
    var psi2 = -(omg_2-omg_ofst);

    if (psi2 < psi1){
        var temp_psi2 = psi2;
        psi2=psi1;
        psi1=temp_psi2;
    }

    let a_star = Number(document.getElementById('a_star').value);
    let b_star = Number(document.getElementById('b_star').value);
    let gamma = Number(document.getElementById('gamma').value);


    let qh = new Array(3);
    let qk = new Array(3);
    qh[0] = Number(document.getElementById('qh1').value);
    qk[0] = Number(document.getElementById('qk1').value);
    qh[1] = Number(document.getElementById('qh2').value);
    qk[1] = Number(document.getElementById('qk2').value);
    qh[2] = Number(document.getElementById('qh3').value);
    qk[2] = Number(document.getElementById('qk3').value);


    for (var j=0;j<DetBankNum;j+=1){
        var labelTThMax='D'+(Math.round(j+1))+'_tth_max';
        tth_Max[j] = Number(document.getElementById(labelTThMax).value);
        var labelTThMin='D'+(Math.round(j+1))+'_tth_min';
        tth_Min[j] = Number(document.getElementById(labelTThMin).value);    
    }


    //accessible area
    //CCW rotation of sample -> CW rotation of accessible range (omg -> -omg)
    var cospsi1 = Math.cos(-Math.PI/180.0*psi1);
    var sinpsi1 = Math.sin(-Math.PI/180.0*psi1);

    var cospsi2 = Math.cos(-Math.PI/180.0*psi2);
    var sinpsi2 = Math.sin(-Math.PI/180.0*psi2);


    for(var p=0;p<Ei_numMax;p+=1){

        //refresh
        context3[p].clearRect(0, 0, canvas3[p].width, canvas3[p].height);
        context3[p].strokeStyle = "rgb(0, 0, 0)";
        context3[p].lineWidth=1;

//        let ki = Math.sqrt(Ef*(1.0+frac_hbw[p])/2.072);
        let ki=kf;

        for(let i_tth=0;i_tth<DetBankNum;i_tth+=1){

            context3[p].beginPath();
            context3[p].lineWidth=1;

            var dX=-(Math.cos(Math.PI/180.0*tth_Min[i_tth])*kf-1.0*ki)*scale[p];
            var dY=(Math.sin(Math.PI/180.0*tth_Min[i_tth]))*kf*scale[p];

            var tempX = cospsi1*dX - sinpsi1*dY;
            var tempY = sinpsi1*dX + cospsi1*dY;

            var dX = tempX;
            var dY = tempY;


            context3[p].moveTo(originX+dX, originY-dY);
            for (var tth= tth_Min[i_tth]; tth <= tth_Max[i_tth]; tth += 0.5) {
                var dX=-(Math.cos(Math.PI/180.0*tth)*kf-1.0*ki)*scale[p];
                var dY=(Math.sin(Math.PI/180.0*tth))*kf*scale[p];

                var tempX = cospsi1*dX - sinpsi1*dY;
                var tempY = sinpsi1*dX + cospsi1*dY;

                var dX = tempX;
                var dY = tempY;

                context3[p].lineTo(originX+dX , originY - dY);
            }
            for (var psi= psi1; psi < psi2; psi += 0.5) {
                var dX=-(Math.cos(Math.PI/180.0*tth_Max[i_tth])*kf-1.0*ki)*scale[p];
                var dY=(Math.sin(Math.PI/180.0*tth_Max[i_tth]))*kf*scale[p];

                var tempX = Math.cos(-Math.PI/180.0*psi)*dX - Math.sin(-Math.PI/180.0*psi)*dY;
                var tempY = Math.sin(-Math.PI/180.0*psi)*dX + Math.cos(-Math.PI/180.0*psi)*dY;

                var dX = tempX;
                var dY = tempY;

                context3[p].lineTo(originX+dX , originY - dY);
            }
            for (var i= tth_Max[i_tth]; i >= tth_Min[i_tth]; i -= 0.5) {
                var dX=-(Math.cos(Math.PI/180.0*i)*kf-1.0*ki)*scale[p];
                var dY=(Math.sin(Math.PI/180.0*i))*kf*scale[p];

                var tempX = cospsi2*dX - sinpsi2*dY;
                var tempY = sinpsi2*dX + cospsi2*dY;

                var dX = tempX;
                var dY = tempY;
                context3[p].lineTo(originX+dX , originY - dY);
            }
            for (var psi= psi2; psi > psi1; psi -= 0.5) {
                var dX=-(Math.cos(Math.PI/180.0*tth_Min[i_tth])*kf-1.0*ki)*scale[p];
                var dY=(Math.sin(Math.PI/180.0*tth_Min[i_tth]))*kf*scale[p];

                var tempX = Math.cos(-Math.PI/180.0*psi)*dX - Math.sin(-Math.PI/180.0*psi)*dY;
                var tempY = Math.sin(-Math.PI/180.0*psi)*dX + Math.cos(-Math.PI/180.0*psi)*dY;

                var dX = tempX;
                var dY = tempY;

                context3[p].lineTo(originX+dX , originY - dY);
            }
            context3[p].fillStyle="rgb(220, 230, 250)";
            context3[p].fill();
            context3[p].strokeStyle="rgb(0, 0, 250)";
            context3[p].stroke();

        }

        //R-lattice
        var cosGamma = Math.cos(Math.PI/180.0*gamma);
        var sinGamma = Math.sin(Math.PI/180.0*gamma);

        var Hmax = parseInt(2.0*kf/a_star*2);
        var Kmax = parseInt(2.0*kf/b_star*2);

        //q-vector 1
        context3[p].fillStyle="rgb(50, 220, 50)";
        for (var h=-Hmax;h<=Hmax;h+=1){
            for (var k=-Kmax;k<=Kmax;k+=1){
                if(check_ReflectionCondition(RefCon,h,k)){
                    //hkl+q
                    var PosY = originY-((h+qh[0])*a_star+(k+qk[0])*b_star*cosGamma)*scale[p];
                    var PosX = originX-((k+qk[0])*b_star*sinGamma)*scale[p];
                    if ((Math.abs(PosX-originX)<canvas3[p].width/2.0)&&(Math.abs(PosY-originY)<canvas3[p].height/2.0)){
                        context3[p].beginPath();
                        context3[p].arc(PosX,PosY, radius, 0, 2 * Math.PI);
                        context3[p].fill();
                    }
                    //hkl-q
                    PosY = originY-((h-qh[0])*a_star+(k-qk[0])*b_star*cosGamma)*scale[p];
                    PosX = originX-((k-qk[0])*b_star*sinGamma)*scale[p];
                    if ((Math.abs(PosX-originX)<canvas3[p].width/2.0)&&(Math.abs(PosY-originY)<canvas3[p].height/2.0)){
                        context3[p].beginPath();
                        context3[p].arc(PosX,PosY, radius, 0, 2 * Math.PI);
                        context3[p].fill();
                    }
                }
            }
        }

        //q-vector 2
        context3[p].fillStyle="rgb(50, 150, 250)";
        for (var h=-Hmax;h<=Hmax;h+=1){
            for (var k=-Kmax;k<=Kmax;k+=1){
                if(check_ReflectionCondition(RefCon,h,k)){
                    //hkl+q
                    var PosY = originY-((h+qh[1])*a_star+(k+qk[1])*b_star*cosGamma)*scale[p];
                    var PosX = originX-((k+qk[1])*b_star*sinGamma)*scale[p];
                    if ((Math.abs(PosX-originX)<canvas3[p].width/2.0)&&(Math.abs(PosY-originY)<canvas3[p].height/2.0)){
                        context3[p].beginPath();
                        context3[p].arc(PosX,PosY, radius, 0, 2 * Math.PI);
                        context3[p].fill();
                    }
                    //hkl-q
                    PosY = originY-((h-qh[1])*a_star+(k-qk[1])*b_star*cosGamma)*scale[p];
                    PosX = originX-((k-qk[1])*b_star*sinGamma)*scale[p];
                    if ((Math.abs(PosX-originX)<canvas3[p].width/2.0)&&(Math.abs(PosY-originY)<canvas3[p].height/2.0)){
                        context3[p].beginPath();
                        context3[p].arc(PosX,PosY, radius, 0, 2 * Math.PI);
                        context3[p].fill();
                    }
                }
            }
        }

        //q-vector 3
        context3[p].fillStyle="rgb(250, 150, 100)";
        for (var h=-Hmax;h<=Hmax;h+=1){
            for (var k=-Kmax;k<=Kmax;k+=1){
                if(check_ReflectionCondition(RefCon,h,k)){
                    //hkl+q
                    var PosY = originY-((h+qh[2])*a_star+(k+qk[2])*b_star*cosGamma)*scale[p];
                    var PosX = originX-((k+qk[2])*b_star*sinGamma)*scale[p];
                    if ((Math.abs(PosX-originX)<canvas3[p].width/2.0)&&(Math.abs(PosY-originY)<canvas3[p].height/2.0)){
                        context3[p].beginPath();
                        context3[p].arc(PosX,PosY, radius, 0, 2 * Math.PI);
                        context3[p].fill();
                    }
                    //hkl-q
                    PosY = originY-((h-qh[2])*a_star+(k-qk[2])*b_star*cosGamma)*scale[p];
                    PosX = originX-((k-qk[2])*b_star*sinGamma)*scale[p];
                    if ((Math.abs(PosX-originX)<canvas3[p].width/2.0)&&(Math.abs(PosY-originY)<canvas3[p].height/2.0)){
                        context3[p].beginPath();
                        context3[p].arc(PosX,PosY, radius, 0, 2 * Math.PI);
                        context3[p].fill();
                    }
                }
            }
        }

        //Al peaks
        for (let al=0;al<Al_d.length;al+=1){
            context3[p].strokeStyle="rgb(180, 180, 180)";
            context3[p].beginPath();
            context3[p].arc(originX,originY, 2.0*Math.PI/Al_d[al]*scale[p], 0, 2 * Math.PI);
            context3[p].stroke();
   
        }


        //R-lattice
        context3[p].fillStyle="rgb(150, 150, 150)";

        for (var h=-Hmax;h<=Hmax;h+=1){
            for (var k=-Kmax;k<=Kmax;k+=1){
                if(check_ReflectionCondition(RefCon,h,k)){
                    var PosY = originY-(h*a_star+k*b_star*cosGamma)*scale[p];
                    var PosX = originX-(k*b_star*sinGamma)*scale[p];
                    if ((Math.abs(PosX-originX)<canvas3[p].width/2.0)&&(Math.abs(PosY-originY)<canvas3[p].height/2.0)){
                        context3[p].beginPath();
                        context3[p].arc(PosX,PosY, radius, 0, 2 * Math.PI);
                        context3[p].fill();
                    }    
                }
            }
        }

        // draw a star
        context3[p].beginPath();
        context3[p].strokeStyle="rgb(250, 100, 100)";
        context3[p].lineWidth=2;
        context3[p].moveTo(originX,originY);
        context3[p].lineTo(originX, originY-a_star*scale[p] );
        context3[p].stroke();

        let arrow_head = 12;
        let font_size = 14;
        context3[p].beginPath();
        context3[p].lineWidth=1;
        context3[p].fillStyle="rgb(250, 100, 100)";
        context3[p].moveTo(originX-arrow_head/2, originY-a_star*scale[p] );
        context3[p].lineTo(originX, originY-a_star*scale[p]-arrow_head*0.7 );
        context3[p].lineTo(originX+arrow_head/2, originY-a_star*scale[p] );
        context3[p].fill();
        context3[p].font = "italic 14px sans-serif";
        context3[p].fillText("a*", originX+font_size*0.5 , originY-a_star*scale[p]/2-font_size )

        // draw b star
        context3[p].beginPath();
        context3[p].strokeStyle="rgb(250, 100, 100)";
        context3[p].lineWidth=2;
        context3[p].moveTo(originX,originY);
        context3[p].lineTo(originX-b_star*sinGamma*scale[p], originY-b_star*cosGamma*scale[p]);
        context3[p].stroke();

        context3[p].beginPath();
        context3[p].lineWidth=1;
        context3[p].fillStyle="rgb(250, 100, 100)";

        var arrow_head_X = Array(3);
        var arrow_head_Y = Array(3);
        arrow_head_X[0]=arrow_head/2.0;
        arrow_head_Y[0]=b_star*scale[p];

        arrow_head_X[1]=0.0;
        arrow_head_Y[1]=b_star*scale[p]+arrow_head*0.7;

        arrow_head_X[2]=-arrow_head/2.0;
        arrow_head_Y[2]=b_star*scale[p];

        for (var l=0;l<3;l+=1){
            var tempX=cosGamma*arrow_head_X[l]-sinGamma*arrow_head_Y[l];
            var tempY=sinGamma*arrow_head_X[l]+cosGamma*arrow_head_Y[l];
            arrow_head_X[l]=tempX;
            arrow_head_Y[l]=tempY;

        }
        context3[p].moveTo(originX+arrow_head_X[0] , originY-arrow_head_Y[0]);
        context3[p].lineTo(originX+arrow_head_X[1] , originY-arrow_head_Y[1]);
        context3[p].lineTo(originX+arrow_head_X[2] , originY-arrow_head_Y[2]);
        context3[p].fill();
        context3[p].font = "italic 14px sans-serif";
        context3[p].fillText("b*", originX+arrow_head_X[1]/2-font_size/2, originY-arrow_head_Y[1]/2+font_size*1.5 );

        //Q-vector
        let Ht = Number(document.getElementById('Ht').value);
        let Kt = Number(document.getElementById('Kt').value);
        if((Ht==0) && (Kt==0)){
            console.log("zero");
            document.getElementById("Q_tgt").innerHTML="none";
            document.getElementById("tth_tgt").innerHTML="none";
        }
        else{
            context3[p].beginPath();
            context3[p].strokeStyle="rgb(100, 200, 100)";
            context3[p].lineWidth=2;
            context3[p].moveTo(originX,originY);
            context3[p].lineTo(originX-Kt*b_star*sinGamma*scale[p], originY-(Ht*a_star+Kt*b_star*cosGamma)*scale[p]);
            context3[p].stroke();

            let Qx=Kt*b_star*sinGamma;
            let Qy=Ht*a_star+Kt*b_star*cosGamma;
            let Qlen=Math.sqrt(Qx**2.0+Qy**2.0);

            let Q_arrow_head_X = Array(3);
            let Q_arrow_head_Y = Array(3);
            Q_arrow_head_X[0]=arrow_head/2.0;
            Q_arrow_head_Y[0]=Qlen*scale[p];

            Q_arrow_head_X[1]=0.0;
            Q_arrow_head_Y[1]=Qlen*scale[p]+arrow_head*0.7;

            Q_arrow_head_X[2]=-arrow_head/2.0;
            Q_arrow_head_Y[2]=Qlen*scale[p];

            let cosAlpha=Qy/Qlen;
            let sinAlpha=Qx/Qlen;
            let alpha=Math.atan(sinAlpha/cosAlpha)/Math.PI*180.0;

            for (let l=0;l<3;l+=1){
                let tempX=cosAlpha*Q_arrow_head_X[l]-sinAlpha*Q_arrow_head_Y[l];
                let tempY=sinAlpha*Q_arrow_head_X[l]+cosAlpha*Q_arrow_head_Y[l];
                Q_arrow_head_X[l]=tempX;
                Q_arrow_head_Y[l]=tempY;

            }
            context3[p].fillStyle="rgb(100, 200, 100)";
            context3[p].moveTo(originX+Q_arrow_head_X[0] , originY-Q_arrow_head_Y[0]);
            context3[p].lineTo(originX+Q_arrow_head_X[1] , originY-Q_arrow_head_Y[1]);
            context3[p].lineTo(originX+Q_arrow_head_X[2] , originY-Q_arrow_head_Y[2]);
            context3[p].fill();    

            let tth_tgt = Math.asin(Qlen/2.0/ki)*2.0/Math.PI*180.0;

            document.getElementById("Q_tgt").innerHTML=Math.round(Qlen*decimal_digit)/decimal_digit;
            document.getElementById("tth_tgt").innerHTML=Math.round(tth_tgt*decimal_digit)/decimal_digit;

            // ki-vector
            let cosRot_ki=Math.cos((alpha+90.0+tth_tgt/2.0)/180.0*Math.PI);
            let sinRot_ki=Math.sin((alpha+90.0+tth_tgt/2.0)/180.0*Math.PI);

            let ki_X=ki*sinRot_ki;
            let ki_Y=ki*cosRot_ki;

            context3[p].beginPath();
            context3[p].strokeStyle="rgb(250, 200, 120)";
            context3[p].lineWidth=2;
            context3[p].moveTo(originX,originY);
            context3[p].lineTo(originX-ki_X*scale[p], originY-ki_Y*scale[p]);
            context3[p].stroke();

            let ki_arrow_head_X = Array(3);
            let ki_arrow_head_Y = Array(3);
            ki_arrow_head_X[0]=arrow_head/2.0;
            ki_arrow_head_Y[0]=arrow_head*0.7;

            ki_arrow_head_X[1]=0.0;
            ki_arrow_head_Y[1]=0.0;

            ki_arrow_head_X[2]=-arrow_head/2.0;
            ki_arrow_head_Y[2]=arrow_head*0.7;

            for (let l=0;l<3;l+=1){
                let tempX=cosRot_ki*ki_arrow_head_X[l]-sinRot_ki*ki_arrow_head_Y[l];
                let tempY=sinRot_ki*ki_arrow_head_X[l]+cosRot_ki*ki_arrow_head_Y[l];
                ki_arrow_head_X[l]=tempX;
                ki_arrow_head_Y[l]=tempY;

            }
            context3[p].fillStyle="rgb(250, 200, 120)";
            context3[p].moveTo(originX+ki_arrow_head_X[0] , originY-ki_arrow_head_Y[0]);
            context3[p].lineTo(originX+ki_arrow_head_X[1] , originY-ki_arrow_head_Y[1]);
            context3[p].lineTo(originX+ki_arrow_head_X[2] , originY-ki_arrow_head_Y[2]);
            context3[p].fill();    

            // kf-vector
            let cosRot_kf=Math.cos((alpha-90.0-tth_tgt/2.0)/180.0*Math.PI);
            let sinRot_kf=Math.sin((alpha-90.0-tth_tgt/2.0)/180.0*Math.PI);

            let kf_X=ki*sinRot_kf;
            let kf_Y=ki*cosRot_kf;

            context3[p].beginPath();
            context3[p].strokeStyle="rgb(200, 150, 100)";
            context3[p].lineWidth=2;
            context3[p].moveTo(originX,originY);
            context3[p].lineTo(originX-kf_X*scale[p], originY-kf_Y*scale[p]);
            context3[p].stroke();

            let kf_arrow_head_X = Array(3);
            let kf_arrow_head_Y = Array(3);
            kf_arrow_head_X[0]=arrow_head/2.0;
            kf_arrow_head_Y[0]=ki*scale[p];

            kf_arrow_head_X[1]=0.0;
            kf_arrow_head_Y[1]=ki*scale[p]+arrow_head*0.7;

            kf_arrow_head_X[2]=-arrow_head/2.0;
            kf_arrow_head_Y[2]=ki*scale[p];

            for (let l=0;l<3;l+=1){
                let tempX=cosRot_kf*kf_arrow_head_X[l]-sinRot_kf*kf_arrow_head_Y[l];
                let tempY=sinRot_kf*kf_arrow_head_X[l]+cosRot_kf*kf_arrow_head_Y[l];
                kf_arrow_head_X[l]=tempX;
                kf_arrow_head_Y[l]=tempY;

            }
            context3[p].fillStyle="rgb(200, 150, 100)";
            context3[p].moveTo(originX+kf_arrow_head_X[0] , originY-kf_arrow_head_Y[0]);
            context3[p].lineTo(originX+kf_arrow_head_X[1] , originY-kf_arrow_head_Y[1]);
            context3[p].lineTo(originX+kf_arrow_head_X[2] , originY-kf_arrow_head_Y[2]);
            context3[p].fill();   

        }

    }

}

function set_ReflectionCondition(){
    RefCon = document.getElementById("RefCon").value;
}

function check_ReflectionCondition(RefCon,H,K){
    var retstr=false;

    switch(RefCon){
        case 'none':
            retstr=true;
            break;
        case 'H+K=2n':
            if((H+K)%2==0){
                retstr=true;
            }
            break;
        case 'H=2n':
            if((H)%2==0){
                retstr=true;
            }
            break;
        case 'K=2n':
            if((K)%2==0){
                retstr=true;
            }
            break;
        case 'H,K all even or all odd':
            let hklsp = Math.abs(H%2)+Math.abs(K%2);
            if(hklsp==0||hklsp==3){
                retstr=true;
            }
            break;
        case '-H+K=3n':
            if((-H+K)%3==0){
                retstr=true;
            }
            break;
        default:
            retstr=true;
    }
    return retstr;
}


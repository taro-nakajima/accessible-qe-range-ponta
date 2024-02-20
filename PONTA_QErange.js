const version = "1.4";
const decimal_digit = 1000;

let DetBankNum = 1;
let tth_Max = new Array(DetBankNum);
let tth_Min = new Array(DetBankNum);

// d-values of Al peaks.
const Al_d=[2.338124,2.024875,1.431803,1.221046,1.169062,1.012437, 0.929076,0.905552,0.826652,0.779375, 0.779375,0.715901];

// d-values of PG002 and Heusler111
const d_mono = [3.35416,3.435];

let RefCon="none";

let canvas3;
let context3;

const scale0 = 1;   // 2ki = canvas.width/2 when scale0=1.0
let scale;
let frac_hbws;

const radius = 3; // radius for each reciprocal lattice point
const arrow_head = 12;
const font_size = 14;

window.addEventListener('load', () => {

    // buttons etc. in the main panel ================================================
    document.getElementById('inst_parameters_button').addEventListener('click', (evt) => {
        draw();
    });

    document.getElementById('sample_parameters_button').addEventListener('click', (evt) => {
        draw();
    });

    document.getElementById('q-vec_parameters_button').addEventListener('click', (evt) => {
        draw();
    });

    document.getElementById('target_ref_set_button').addEventListener('click', (evt) => {
        draw();
    });

    document.getElementById('Mono').addEventListener('change', (evt) => {     
        draw();
    });

    document.getElementById('cb_fix_ki_dir').addEventListener('change', (evt) => {     
        draw();
    });

    // end of buttons etc. in the main panel============================================

});
//====== end of window.addEventListener=====================================================================



function draw() {
    document.getElementById("verNum").innerHTML=version;
    document.getElementById("verNum2").innerHTML=version;

    set_ReflectionCondition();

    draw_Qxy();

}


function draw_Qxy(){

    let Ef= Number(document.getElementById('Ef').value);
    let kf=Math.sqrt(Ef/2.072);
    let ki=kf;
    let Q_mono = 2.0*Math.PI/d_mono[0];

    document.getElementById("lambda").innerHTML=Math.round((2.0*Math.PI/kf)*decimal_digit)/decimal_digit;
    document.getElementById("k_len").innerHTML=Math.round((kf)*decimal_digit)/decimal_digit;

    if (document.getElementById('Mono').value == "PG"){
        Q_mono = 2.0*Math.PI/d_mono[0];
    }
    else if(document.getElementById('Mono').value == "Heusler"){
        Q_mono = 2.0*Math.PI/d_mono[1];
    }

    let A1 = Math.asin(Q_mono/2.0/ki)/Math.PI*180.0*2.0;
    let C1 = A1/2.0;

    document.getElementById("A1").innerHTML=Math.round(A1*decimal_digit)/decimal_digit;
    document.getElementById("C1").innerHTML=Math.round(C1*decimal_digit)/decimal_digit;


    let labelCanvasQxy='CanvasQxy1';
    canvas3 = document.getElementById(labelCanvasQxy);
    context3 = canvas3.getContext('2d');
    scale = canvas3.width/2.0/(2.0*kf)*scale0;


    let originX = canvas3.width/2.0;
    let originY = canvas3.height/2.0;
   
    let omg_1 = Number(document.getElementById('omega1').value);
    let omg_2 = Number(document.getElementById('omega2').value);
    let omg_ofst = Number(document.getElementById('omg_ofst').value);

    let psi1 = -(omg_1-omg_ofst);
    let psi2 = -(omg_2-omg_ofst);

    if (psi2 < psi1){
        let temp_psi2 = psi2;
        psi2=psi1;
        psi1=temp_psi2;
    }

    //get Lattice info.
    let a_star = Number(document.getElementById('a_star').value);
    let b_star = Number(document.getElementById('b_star').value);
    let gamma = Number(document.getElementById('gamma').value);
    let cosGamma = Math.cos(Math.PI/180.0*gamma);
    let sinGamma = Math.sin(Math.PI/180.0*gamma);

    let Hmax = parseInt(2.0*kf/a_star*2);
    let Kmax = parseInt(2.0*kf/b_star*2);


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

    //Q-vector info
    let Ht = Number(document.getElementById('Ht').value);
    let Kt = Number(document.getElementById('Kt').value);
    let Qx = 0.0;
    let Qy = 0.0;
    let Qlen= 0.0;
    let cosAlpha=1.0;
    let sinAlpha=0.0;
    let alpha=0.0;
    let wholeRot=0.0;
    let tth_tgt = 0.0;

    if((Ht==0) && (Kt==0)){
//            console.log("zero");
        document.getElementById("Q_tgt").innerHTML="none";
        document.getElementById("tth_tgt").innerHTML="none";
    }
    else{
        Qx=Kt*b_star*sinGamma;
        Qy=Ht*a_star+Kt*b_star*cosGamma;
        Qlen=Math.sqrt(Qx**2.0+Qy**2.0);
        cosAlpha=Qy/Qlen;
        sinAlpha=Qx/Qlen;
        alpha=Math.atan2(Qx,Qy);
        console.log(alpha);
        tth_tgt = Math.asin(Qlen/2.0/ki)*2.0;
        if(document.getElementById("cb_fix_ki_dir").checked){
            wholeRot=(alpha+tth_tgt/2.0);
        }
        else{
            wholeRot=0.0;
        }
        document.getElementById("Q_tgt").innerHTML=Math.round(Qlen*decimal_digit)/decimal_digit;
        document.getElementById("tth_tgt").innerHTML=Math.round((tth_tgt/Math.PI*180.0)*decimal_digit)/decimal_digit;

        document.getElementById("A2").innerHTML=Math.round((-tth_tgt/Math.PI*180.0)*decimal_digit)/decimal_digit;
        document.getElementById("C2").innerHTML=Math.round(((-tth_tgt/2.0-alpha)/Math.PI*180.0-omg_ofst)*decimal_digit)/decimal_digit;

    }
        

    //accessible area
    //CCW rotation of sample -> CW rotation of accessible range (omg -> -omg)
    var cospsi1 = Math.cos(-Math.PI/180.0*psi1);
    var sinpsi1 = Math.sin(-Math.PI/180.0*psi1);

    var cospsi2 = Math.cos(-Math.PI/180.0*psi2);
    var sinpsi2 = Math.sin(-Math.PI/180.0*psi2);



    //refresh
    context3.clearRect(0, 0, canvas3.width, canvas3.height);
    context3.strokeStyle = "rgb(0, 0, 0)";
    context3.lineWidth=1;

//        let ki = Math.sqrt(Ef*(1.0+frac_hbw[p])/2.072);

    //draw accressible region.
    for(let i_tth=0;i_tth<DetBankNum;i_tth+=1){

        context3.beginPath();
        context3.lineWidth=1;

        let dX=-(Math.cos(Math.PI/180.0*tth_Min[i_tth])*kf-1.0*ki)*scale;
        let dY=(Math.sin(Math.PI/180.0*tth_Min[i_tth]))*kf*scale;

        [dX,dY]=rotation2D_cos_sin(dX,dY,cospsi1,sinpsi1);
        [dX,dY]=rotation2D_rad(dX,dY,-wholeRot);

        context3.moveTo(originX+dX, originY-dY);
        for (let tth= tth_Min[i_tth]; tth <= tth_Max[i_tth]; tth += 0.5) {
            let dX=-(Math.cos(Math.PI/180.0*tth)*kf-1.0*ki)*scale;
            let dY=(Math.sin(Math.PI/180.0*tth))*kf*scale;

            [dX,dY]=rotation2D_cos_sin(dX,dY,cospsi1,sinpsi1);
            [dX,dY]=rotation2D_rad(dX,dY,-wholeRot);
            
            context3.lineTo(originX+dX , originY - dY);
        }
        for (let psi= psi1; psi < psi2; psi += 0.5) {
            let dX=-(Math.cos(Math.PI/180.0*tth_Max[i_tth])*kf-1.0*ki)*scale;
            let dY=(Math.sin(Math.PI/180.0*tth_Max[i_tth]))*kf*scale;

            [dX,dY]=rotation2D_rad(dX,dY,-Math.PI/180.0*psi);
            [dX,dY]=rotation2D_rad(dX,dY,-wholeRot);

            context3.lineTo(originX+dX , originY - dY);
        }
        for (let i= tth_Max[i_tth]; i >= tth_Min[i_tth]; i -= 0.5) {
            let dX=-(Math.cos(Math.PI/180.0*i)*kf-1.0*ki)*scale;
            let dY=(Math.sin(Math.PI/180.0*i))*kf*scale;

            [dX,dY]=rotation2D_cos_sin(dX,dY,cospsi2,sinpsi2);
            [dX,dY]=rotation2D_rad(dX,dY,-wholeRot);

            context3.lineTo(originX+dX , originY - dY);
        }
        for (let psi= psi2; psi > psi1; psi -= 0.5) {
            let dX=-(Math.cos(Math.PI/180.0*tth_Min[i_tth])*kf-1.0*ki)*scale;
            let dY=(Math.sin(Math.PI/180.0*tth_Min[i_tth]))*kf*scale;

            [dX,dY]=rotation2D_rad(dX,dY,-Math.PI/180.0*psi);
            [dX,dY]=rotation2D_rad(dX,dY,-wholeRot);

            context3.lineTo(originX+dX , originY - dY);
        }
        context3.fillStyle="rgb(220, 230, 250)";
        context3.fill();
        context3.strokeStyle="rgb(0, 0, 250)";
        context3.stroke();

    }


    //q-vector 1
    context3.fillStyle="rgb(80, 180, 250)";
    for (let h=-Hmax;h<=Hmax;h+=1){
        for (let k=-Kmax;k<=Kmax;k+=1){
            if(check_ReflectionCondition(RefCon,h,k)){
                //hkl+q
                let PosY = ((h+qh[0])*a_star+(k+qk[0])*b_star*cosGamma)*scale;
                let PosX = ((k+qk[0])*b_star*sinGamma)*scale;
                [PosX,PosY]=rotation2D_rad(PosX,PosY,wholeRot);

                if ((Math.abs(PosX)<canvas3.width/2.0)&&(Math.abs(PosY)<canvas3.height/2.0)){
                    context3.beginPath();
                    context3.arc(originX-PosX,originY-PosY, radius, 0, 2 * Math.PI);
                    context3.fill();
                }
                //hkl-q
                PosY = ((h-qh[0])*a_star+(k-qk[0])*b_star*cosGamma)*scale;
                PosX = ((k-qk[0])*b_star*sinGamma)*scale;
                [PosX,PosY]=rotation2D_rad(PosX,PosY,wholeRot);

                if ((Math.abs(PosX)<canvas3.width/2.0)&&(Math.abs(PosY)<canvas3.height/2.0)){
                    context3.beginPath();
                    context3.arc(originX-PosX,originY-PosY, radius, 0, 2 * Math.PI);
                    context3.fill();
                }
            }
        }
    }

    //q-vector 2
    context3.fillStyle="rgb(250, 150, 100)";
    for (let h=-Hmax;h<=Hmax;h+=1){
        for (let k=-Kmax;k<=Kmax;k+=1){
            if(check_ReflectionCondition(RefCon,h,k)){
                //hkl+q
                let PosY = ((h+qh[1])*a_star+(k+qk[1])*b_star*cosGamma)*scale;
                let PosX = ((k+qk[1])*b_star*sinGamma)*scale;
                [PosX,PosY]=rotation2D_rad(PosX,PosY,wholeRot);
                if ((Math.abs(PosX)<canvas3.width/2.0)&&(Math.abs(PosY)<canvas3.height/2.0)){
                    context3.beginPath();
                    context3.arc(originX-PosX,originY-PosY, radius, 0, 2 * Math.PI);
                    context3.fill();
                }
                //hkl-q
                PosY = originY-((h-qh[1])*a_star+(k-qk[1])*b_star*cosGamma)*scale;
                PosX = originX-((k-qk[1])*b_star*sinGamma)*scale;
                [PosX,PosY]=rotation2D_rad(originX-PosX,originY-PosY,wholeRot);
                if ((Math.abs(PosX)<canvas3.width/2.0)&&(Math.abs(PosY)<canvas3.height/2.0)){
                    context3.beginPath();
                    context3.arc(originX-PosX,originY-PosY, radius, 0, 2 * Math.PI);
                    context3.fill();
                }
            }
        }
    }

    //q-vector 3
    context3.fillStyle="rgb(50, 170, 50)";
    for (let h=-Hmax;h<=Hmax;h+=1){
        for (let k=-Kmax;k<=Kmax;k+=1){
            if(check_ReflectionCondition(RefCon,h,k)){
                //hkl+q
                let PosY = ((h+qh[2])*a_star+(k+qk[2])*b_star*cosGamma)*scale;
                let PosX = ((k+qk[2])*b_star*sinGamma)*scale;
                [PosX,PosY]=rotation2D_rad(PosX,PosY,wholeRot);
                if ((Math.abs(PosX)<canvas3.width/2.0)&&(Math.abs(PosY)<canvas3.height/2.0)){
                    context3.beginPath();
                    context3.arc(originX-PosX,originY-PosY, radius, 0, 2 * Math.PI);
                    context3.fill();
                }
                //hkl-q
                PosY = ((h-qh[2])*a_star+(k-qk[2])*b_star*cosGamma)*scale;
                PosX = ((k-qk[2])*b_star*sinGamma)*scale;
                [PosX,PosY]=rotation2D_rad(PosX,PosY,wholeRot);
                if ((Math.abs(PosX)<canvas3.width/2.0)&&(Math.abs(PosY)<canvas3.height/2.0)){
                    context3.beginPath();
                    context3.arc(originX-PosX,originY-PosY, radius, 0, 2 * Math.PI);
                    context3.fill();
                }
            }
        }
    }

    //Al peaks
    for (let al=0;al<Al_d.length;al+=1){
        context3.strokeStyle="rgb(180, 180, 180)";
        context3.beginPath();
        context3.arc(originX,originY, 2.0*Math.PI/Al_d[al]*scale, 0, 2 * Math.PI);
        context3.stroke();

    }


    //R-lattice
    context3.fillStyle="rgb(150, 150, 150)";

    for (let h=-Hmax;h<=Hmax;h+=1){
        for (let k=-Kmax;k<=Kmax;k+=1){
            if(check_ReflectionCondition(RefCon,h,k)){
                let PosY = (h*a_star+k*b_star*cosGamma)*scale;
                let PosX = (k*b_star*sinGamma)*scale;
                [PosX,PosY]=rotation2D_rad(PosX,PosY,wholeRot);
                if ((Math.abs(PosX)<canvas3.width/2.0)&&(Math.abs(PosY)<canvas3.height/2.0)){
                    context3.beginPath();
                    context3.arc(originX-PosX,originY-PosY, radius, 0, 2 * Math.PI);
                    context3.fill();
                }    
            }
        }
    }

    // draw a star
    // line for a*
    context3.beginPath();
    context3.strokeStyle="rgb(250, 100, 100)";
    context3.lineWidth=2;
    context3.moveTo(originX,originY);
    let a_star_line_XY = [0.0,a_star*scale];
    a_star_line_XY=rotation2D_rad(a_star_line_XY[0],a_star_line_XY[1],wholeRot);
    context3.lineTo(originX-a_star_line_XY[0], originY-a_star_line_XY[1] );
    context3.stroke();

    //arrow head for a star
    let a_star_arrow_head_X = Array(3);
    let a_star_arrow_head_Y = Array(3);
    a_star_arrow_head_X[0]=arrow_head/2.0;
    a_star_arrow_head_Y[0]=a_star*scale;

    a_star_arrow_head_X[1]=0.0;
    a_star_arrow_head_Y[1]=a_star*scale+arrow_head*0.7;

    a_star_arrow_head_X[2]=-arrow_head/2.0;
    a_star_arrow_head_Y[2]=a_star*scale;

    for (let l=0;l<3;l+=1){
        [a_star_arrow_head_X[l],a_star_arrow_head_Y[l]]=rotation2D_rad(a_star_arrow_head_X[l],a_star_arrow_head_Y[l],wholeRot);
    }
    context3.beginPath();
    context3.lineWidth=1;
    context3.fillStyle="rgb(250, 100, 100)";
    context3.moveTo(originX-a_star_arrow_head_X[0] , originY-a_star_arrow_head_Y[0]);
    context3.lineTo(originX-a_star_arrow_head_X[1] , originY-a_star_arrow_head_Y[1]);
    context3.lineTo(originX-a_star_arrow_head_X[2] , originY-a_star_arrow_head_Y[2]);
    context3.fill();
    context3.font = "italic 14px sans-serif";
    context3.fillText("a*", originX-a_star_arrow_head_X[1]/2+font_size/2, originY-a_star_arrow_head_Y[1]/2-font_size );


    // draw b star
    // line for b star
    context3.beginPath();
    context3.strokeStyle="rgb(250, 100, 100)";
    context3.lineWidth=2;
    context3.moveTo(originX,originY);
    let b_star_line_XY=[b_star*sinGamma*scale,b_star*cosGamma*scale];
    b_star_line_XY=rotation2D_rad(b_star_line_XY[0],b_star_line_XY[1],wholeRot);
    context3.lineTo(originX-b_star_line_XY[0], originY-b_star_line_XY[1]);
    context3.stroke();

    context3.beginPath();
    context3.lineWidth=1;
    context3.fillStyle="rgb(250, 100, 100)";

    //arrow head for b star
    let b_star_arrow_head_X = Array(3);
    let b_star_arrow_head_Y = Array(3);
    b_star_arrow_head_X[0]=arrow_head/2.0;
    b_star_arrow_head_Y[0]=b_star*scale;

    b_star_arrow_head_X[1]=0.0;
    b_star_arrow_head_Y[1]=b_star*scale+arrow_head*0.7;

    b_star_arrow_head_X[2]=-arrow_head/2.0;
    b_star_arrow_head_Y[2]=b_star*scale;

    for (let l=0;l<3;l+=1){
        [b_star_arrow_head_X[l],b_star_arrow_head_Y[l]]=rotation2D_cos_sin(b_star_arrow_head_X[l],b_star_arrow_head_Y[l],cosGamma,-sinGamma);
        [b_star_arrow_head_X[l],b_star_arrow_head_Y[l]]=rotation2D_rad(b_star_arrow_head_X[l],b_star_arrow_head_Y[l],wholeRot);
    }
    context3.moveTo(originX-b_star_arrow_head_X[0] , originY-b_star_arrow_head_Y[0]);
    context3.lineTo(originX-b_star_arrow_head_X[1] , originY-b_star_arrow_head_Y[1]);
    context3.lineTo(originX-b_star_arrow_head_X[2] , originY-b_star_arrow_head_Y[2]);
    context3.fill();
    context3.font = "italic 14px sans-serif";
    context3.fillText("b*", originX-b_star_arrow_head_X[1]/2-font_size/2, originY-b_star_arrow_head_Y[1]/2+font_size*1.5 );

    //Q-vector
    if((Ht==0) && (Kt==0)){
//            console.log("zero");
        document.getElementById("Q_tgt").innerHTML="none";
        document.getElementById("tth_tgt").innerHTML="none";
    }
    else{
        //line for Q-vector
        context3.beginPath();
        context3.strokeStyle="rgb(100, 200, 100)";
        context3.lineWidth=2;
        context3.moveTo(originX,originY);
        let Q_line_XY=[Kt*b_star*sinGamma*scale,(Ht*a_star+Kt*b_star*cosGamma)*scale];
        Q_line_XY=rotation2D_rad(Q_line_XY[0],Q_line_XY[1],wholeRot);
        context3.lineTo(originX-Q_line_XY[0], originY-Q_line_XY[1]);
        context3.stroke();


        let Q_arrow_head_X = Array(3);
        let Q_arrow_head_Y = Array(3);
        Q_arrow_head_X[0]=arrow_head/2.0;
        Q_arrow_head_Y[0]=Qlen*scale;

        Q_arrow_head_X[1]=0.0;
        Q_arrow_head_Y[1]=Qlen*scale+arrow_head*0.7;

        Q_arrow_head_X[2]=-arrow_head/2.0;
        Q_arrow_head_Y[2]=Qlen*scale;

        //alpha is an angle between the Q-vector and the vertical axis (a* axis)

        for (let l=0;l<3;l+=1){
            [Q_arrow_head_X[l],Q_arrow_head_Y[l]]=rotation2D_cos_sin(Q_arrow_head_X[l],Q_arrow_head_Y[l],cosAlpha,-sinAlpha);
            [Q_arrow_head_X[l],Q_arrow_head_Y[l]]=rotation2D_rad(Q_arrow_head_X[l],Q_arrow_head_Y[l],wholeRot);

        }
        context3.fillStyle="rgb(100, 200, 100)";
        context3.moveTo(originX-Q_arrow_head_X[0] , originY-Q_arrow_head_Y[0]);
        context3.lineTo(originX-Q_arrow_head_X[1] , originY-Q_arrow_head_Y[1]);
        context3.lineTo(originX-Q_arrow_head_X[2] , originY-Q_arrow_head_Y[2]);
        context3.fill();    



        // ki-vector
        let cosRot_ki=Math.cos((alpha+Math.PI/2.0+tth_tgt/2.0));
        let sinRot_ki=Math.sin((alpha+Math.PI/2.0+tth_tgt/2.0));

        let ki_X=ki*sinRot_ki*scale;
        let ki_Y=ki*cosRot_ki*scale;
        [ki_X,ki_Y]=rotation2D_rad(ki_X,ki_Y,wholeRot);

        context3.beginPath();
        context3.strokeStyle="rgb(250, 200, 120)";
        context3.lineWidth=2;
        context3.moveTo(originX,originY);
        context3.lineTo(originX-ki_X, originY-ki_Y);
        context3.stroke();

        let ki_arrow_head_X = Array(3);
        let ki_arrow_head_Y = Array(3);
        ki_arrow_head_X[0]=arrow_head/2.0;
        ki_arrow_head_Y[0]=arrow_head*0.7;

        ki_arrow_head_X[1]=0.0;
        ki_arrow_head_Y[1]=0.0;

        ki_arrow_head_X[2]=-arrow_head/2.0;
        ki_arrow_head_Y[2]=arrow_head*0.7;

        for (let l=0;l<3;l+=1){
            [ki_arrow_head_X[l],ki_arrow_head_Y[l]]=rotation2D_cos_sin(ki_arrow_head_X[l],ki_arrow_head_Y[l],cosRot_ki,sinRot_ki);
            [ki_arrow_head_X[l],ki_arrow_head_Y[l]]=rotation2D_rad(ki_arrow_head_X[l],ki_arrow_head_Y[l],-wholeRot);

        }
        context3.fillStyle="rgb(250, 200, 120)";
        context3.moveTo(originX+ki_arrow_head_X[0] , originY-ki_arrow_head_Y[0]);
        context3.lineTo(originX+ki_arrow_head_X[1] , originY-ki_arrow_head_Y[1]);
        context3.lineTo(originX+ki_arrow_head_X[2] , originY-ki_arrow_head_Y[2]);
        context3.fill();    

        // kf-vector
        let cosRot_kf=Math.cos((alpha-Math.PI/2.0-tth_tgt/2.0));
        let sinRot_kf=Math.sin((alpha-Math.PI/2.0-tth_tgt/2.0));

        let kf_X=ki*sinRot_kf*scale;
        let kf_Y=ki*cosRot_kf*scale;
        [kf_X,kf_Y]=rotation2D_rad(kf_X,kf_Y,wholeRot);

        context3.beginPath();
        context3.strokeStyle="rgb(200, 150, 100)";
        context3.lineWidth=2;
        context3.moveTo(originX,originY);
        context3.lineTo(originX-kf_X, originY-kf_Y);
        context3.stroke();

        let kf_arrow_head_X = Array(3);
        let kf_arrow_head_Y = Array(3);
        kf_arrow_head_X[0]=arrow_head/2.0;
        kf_arrow_head_Y[0]=ki*scale;

        kf_arrow_head_X[1]=0.0;
        kf_arrow_head_Y[1]=ki*scale+arrow_head*0.7;

        kf_arrow_head_X[2]=-arrow_head/2.0;
        kf_arrow_head_Y[2]=ki*scale;

        for (let l=0;l<3;l+=1){
            [kf_arrow_head_X[l],kf_arrow_head_Y[l]]=rotation2D_cos_sin(kf_arrow_head_X[l],kf_arrow_head_Y[l],cosRot_kf,-sinRot_kf);
            [kf_arrow_head_X[l],kf_arrow_head_Y[l]]=rotation2D_rad(kf_arrow_head_X[l],kf_arrow_head_Y[l],wholeRot);

        }
        context3.fillStyle="rgb(200, 150, 100)";
        context3.moveTo(originX-kf_arrow_head_X[0] , originY-kf_arrow_head_Y[0]);
        context3.lineTo(originX-kf_arrow_head_X[1] , originY-kf_arrow_head_Y[1]);
        context3.lineTo(originX-kf_arrow_head_X[2] , originY-kf_arrow_head_Y[2]);
        context3.fill();   

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

function rotation2D_rad(X,Y,phi){
    let sinPhi=Math.sin(phi);
    let cosPhi=Math.cos(phi);

    let rotated_XY=new Array(2);

    rotated_XY[0]=cosPhi*X-sinPhi*Y;
    rotated_XY[1]=sinPhi*X+cosPhi*Y;

    return rotated_XY;

}

function rotation2D_cos_sin(X,Y,cosPhi,sinPhi){

    let rotated_XY=new Array(2);

    rotated_XY[0]=cosPhi*X-sinPhi*Y;
    rotated_XY[1]=sinPhi*X+cosPhi*Y;

    return rotated_XY;

}
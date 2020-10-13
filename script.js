window.onload = preload;

const framerate = 10;

let resultCanvas, resultCtx;
let width = 500;
let height = 500;

let img,img2;

let texts = [
  ["The Living Planet ","Report"],
  ['stated that,','Between','1970 and 2020,'],
  ["68% of the world's","wildlife population","has disappeared"],
  ["It's not just","data"]
]

let canvas = {
  width: window.innerWidth-20,
  height: window.innerHeight-20
}
let preloadInterval;
let img1loaded =false;
let img2loaded=false;
let img3loaded=false;

function preload(){

  img = new Image();
  img.src="shape.png";
  img.onload = function(){ img1loaded = true; }

  img2 = new Image();
  img2.src="shape2.png";
  img2.onload = function(){ img2loaded = true; }

  img3 = new Image();
  img3.src="shape3.png";
  img3.onload = function(){ img3loaded = true; }

  preloadInterval=setInterval(waitForPreload, 100);
}

function waitForPreload(){
  if(img1loaded&&img2loaded&&img3loaded){
    start();
    clearInterval(preloadInterval);
  }

}

let objects = [];
let halfWidth;
function start(){

  halfWidth = canvas.width/2;
  document.body.style.backgroundColor ='black';
  setInterval(run, framerate);

  // create analysis ctx
  c=document.createElement("canvas");
  c.setAttribute("width", width);
  c.setAttribute("height", height);
  //document.body.appendChild(c);
  ctx = c.getContext("2d");

  //create result ctx
  resultCanvas=document.createElement("canvas");
  resultCanvas.setAttribute("width", canvas.width);
  resultCanvas.setAttribute("height", canvas.height);
  document.body.appendChild(resultCanvas);


  resultCtx = resultCanvas.getContext("2d");
  resultCtx.fillStyle="white";
  resultCtx.fillRect(0,0,canvas.width,canvas.height);

  setInterval(run,framerate);

}

let scale;
let frameCount=0;
let maxObjects = 10;

let objectsAdded = 0;
let textAdded =0;
let triggerInterval = 4;
let nextTrigger = triggerInterval;

let rate1 = 700;
let rate2 = 340;
let randompicks = [];
//let offset;
function run(){
  console.log(window.innerWidth,window.innerHeight);
  resultCtx.fillStyle="white";
  resultCtx.fillRect(0,0,canvas.width,canvas.height);

  if(textAdded<texts.length){

    if(textAdded>2&&randompicks.length==0){
      rate1 = 3600;
      rate2 = 1500;
      triggerInterval = 4;

      for(let i=0; i<6; i++){
        let rIndex=randInt(0,10);
        for(let j=0; j<objects[rIndex].length; j++){
          objects[rIndex][j].fading=true;
        }
      }
    }

    if(frameCount%rate1==0)
      objects.push( [ new LetterObj(img,treeNames[randInt(0,treeNames.length)], randInt(150,canvas.width-150), 300, 50, 130, 50 ) ] );
    else if(frameCount%rate2==0){
      let x = randInt(350,canvas.width-350);
      //console.log()
      if(objectsAdded>nextTrigger){
      //  console.log("YOOOO")
        objects.push([{
          type:'text',
          x:x,
          y:300,
          z:1.6,
          scale:1,
          txt: texts[textAdded]
        }]);

        objectsAdded++;
        nextTrigger = objectsAdded+triggerInterval;
        textAdded++;

      }
      else {
        let x = randInt(350,canvas.width-350);
        let name = birdNames[randInt(0,birdNames.length)];
        objects.push( [ new LetterObj(img2,name, x, 300, 130, 50, 50 ),
                        new LetterObj(img3,name, x, 300, 130, 50, 50 ) ] );
      }

    }
  }




  if(objects.length>maxObjects){
    objects.shift();
  }
//  console.log(maxIndex);
  let a;

  for(let i=0; i<objects.length; i++){
    if(objects[i][0].type=='text'){

      if(textAdded!=texts.length||objects[i][0].z>1){
        objects[i][0].z *= 0.9994;
        objects[i][0].x += (halfWidth-objects[i][0].x)/6000;
      }


      resultCtx.save();

      resultCtx.translate(objects[i][0].x , objects[i][0].y + objects[i][0].z * 500 - 300 );
      scale = objects[i][0].scale*objects[i][0].z;
      resultCtx.scale( scale,scale );
      resultCtx.translate(-250,-250);
      a = objects.length - i;

      let alpha = (maxObjects-a)/maxObjects;
      if(objects[i][0].fading){
        objects[i][0].fadeCount++;

        alpha = Math.max(0, alpha-objects[i][0].fadeCount/100);
      }

      resultCtx.globalAlpha = alpha;
      resultCtx.fillStyle='black';
      resultCtx.font='40px Arial';

      for(let j=0; j<objects[i][0].txt.length; j++){
        resultCtx.fillText( objects[i][0].txt[j], 0,j*40 );
      }


      resultCtx.restore();


    }
    else {
      let frame2=false;
      if(objects[i].length==2){
        objects[i][1].update();
        objects[i][1].z *= 0.9994;
        objects[i][1].x += (halfWidth-objects[i][1].x)/6000

        if(objects[i][1].happy&&frameCount%120>60){
          resultCtx.save();


          // offset towards the center

          resultCtx.translate(objects[i][1].x , objects[i][1].y + objects[i][1].z * 500 - 300 );
          scale = objects[i][1].scale*objects[i][1].z;
          resultCtx.scale( scale,scale );
          resultCtx.translate(-250,-250);
          a = objects.length - i;
          resultCtx.globalAlpha = (maxObjects-a)/maxObjects;

          resultCtx.drawImage( objects[i][1].d, 0,0 );
          frame2=true;
          resultCtx.restore();
        }
      }

      objects[i][0].z *= 0.9994;

      // offset towards the center
      objects[i][0].x += (halfWidth-objects[i][0].x)/6000;
      objects[i][0].update();

      if(!frame2) {

        resultCtx.save();

        resultCtx.translate(objects[i][0].x , objects[i][0].y + objects[i][0].z * 500 - 300 );
        scale = objects[i][0].scale*objects[i][0].z;
        resultCtx.scale( scale,scale );
        resultCtx.translate(-250,-250);
        a = objects.length - i;
        resultCtx.globalAlpha = (maxObjects-a)/maxObjects;

        resultCtx.drawImage( objects[i][0].d, 0,0 );

        resultCtx.restore();
      }
    }



  }

frameCount++;
}

function randomCharPos () {
  return {
    x: randInt(0,width),
    y: randInt(0,height),
    size: randInt(18,35)
  };
}

function randInt(min,plus){
  return Math.floor(min+Math.random()*plus);
}

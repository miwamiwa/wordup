
class LetterObj{

  constructor(image,text,x,y,r,g,b){

    objectsAdded ++;

    this.x=x;
    this.y=y;
    this.z=1.5;
    this.type='img';
    this.r=r;
    this.g=g;
    this.b=b;

    this.scale=1;
    // create analysis context

    this.c=document.createElement("canvas");
    this.c.setAttribute("width", width);
    this.c.setAttribute("height", height);
    this.ctx = this.c.getContext("2d");
    this.fading=false;
    this.fadeCount=0;
    // create display context
    this.d=document.createElement("canvas");
    this.d.setAttribute("width", width);
    this.d.setAttribute("height", height);
    this.dctx = this.d.getContext("2d");
    //document.body.appendChild(this.d);
    this.happy=false;
    this.testChar = randomCharPos();
    this.appendedChars = [];

    this.placementAttempts =0;

    this.txt = text;
    this.txtCounter=0;

    this.redCounter=0;
    this.blueCounter=0;

    this.img = image;
  }

  update(){

    //  this.scale -= 0.001;
      if(this.redCounter==0||this.blueCounter<0.4*this.redCounter){

        // re-draw image
        this.ctx.fillStyle='black';
        this.ctx.fillRect(0,0,width,height);
        this.ctx.drawImage(this.img, 0, 0);

        // re-draw already placed characters (SOLID BLUE)
        this.ctx.fillStyle='rgba(0,0,255,1)';
        for(let i=0; i<this.appendedChars.length; i++){
          this.ctx.font=this.appendedChars[i].size+"px Arial";
          this.ctx.fillText( this.appendedChars[i].char, this.appendedChars[i].x, this.appendedChars[i].y );
        }

        // draw character we're currently placing (TRANSPARENT GREEN)
        this.ctx.fillStyle='rgba(0,255,0,0.5)';
        this.ctx.font=this.testChar.size+"px Arial";
        this.ctx.fillText(this.txt[this.txtCounter], this.testChar.x, this.testChar.y );

        // get pixel data
        let pixels = this.ctx.getImageData(0,0,width,height);
        let data = pixels.data;

        // check overlaps
        let imgOverlap=0;
        let otherCharsOverlap=0;
        let reds =0;
        let index=0;
        for(let y=0; y<width; y++){
          for(let x=0; x<height; x++){

            if(data[index]>0 && data[index+1]>0) imgOverlap++;
            if(data[index+1]>0 &&data[index+2]>0) otherCharsOverlap++;

            if(this.redCounter==0&&data[index]>0) reds++;
            index+=4;
          }
        }

        if(this.redCounter==0) this.redCounter=reds;

        //console.log(imgOverlap, otherCharsOverlap);


        // if overlaps acceptable, move on
        if( imgOverlap > this.testChar.size *2 && otherCharsOverlap < this.testChar.size *1 ){

          this.appendedChars.push({
            x: this.testChar.x,
            y: this.testChar.y,
            size: this.testChar.size,
            char: this.txt[this.txtCounter]
          });

          this.blueCounter += imgOverlap;

          let color = {
            r: this.r + randInt(0,50),
            g: this.g + randInt(0,50),
            b: this.b + randInt(0,50)
          }
          // draw result
          this.dctx.fillStyle= `rgb(${color.r},${color.g},${color.b})`;
          this.dctx.font=this.testChar.size+"px Arial";
          this.dctx.fillText(this.txt[this.txtCounter], this.testChar.x, this.testChar.y );

          this.nextChar();

          while(this.txt[this.txtCounter]==" ") this.nextChar();
          this.testChar.x += randInt(-30,60);
          this.testChar.y += randInt(-30,60);
          this.placementAttempts =0;
        }

        // otherwise if overlaps aren't workin' out
        else {

          this.placementAttempts++;

          if(this.placementAttempts>32&&imgOverlap<10){
            this.testChar = randomCharPos();
          }
          if(this.placementAttempts%16==0) this.testChar = randomCharPos();
          else {
            this.testChar.x += randInt(2,4);
            this.testChar.y += randInt(2,4);
          }

          if(this.testChar.x>=width||this.testChar.y>=height) this.testChar = randomCharPos();
        }
      }

      else if(!this.happy){

        this.happy=true;
      //  console.log("happy! ", this.redCounter)
      }


  }

  nextChar(){
    this.txtCounter = ( this.txtCounter+1 ) % this.txt.length;
  }
}

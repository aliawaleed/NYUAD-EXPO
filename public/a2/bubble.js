class bubble {
    constructor(major, x, y, speed, din, r, g, b) {
       //x-position 
       this.x = x;
       //y-position 
       this.y = y;
 
       //
       this.m = major;
       //speed of x and y
       this.xspeed = speed;
       this.yspeed = speed;
       this.diameter = din;
       this.r = r;
       this.g = g;
       this.b = b;
    }
 
    //display bubble
    display() {
       noStroke();
 
       fill(this.r, this.g, this.b);
       //Create ellipse at the position r
       ellipse(this.x, this.y, this.diameter, this.diameter);
       fill(0);
       //write major
       textSize(this.diameter / 8);
       textAlign(CENTER);
       //write name
       text(this.m, this.x, this.y);
       //radius of ellipse change according to the value of age
    }
    //Animate Bubbles
    move() {
       //When bump into wall, change direction
       if (this.x > (width - this.diameter / 2)) {
          this.xspeed = this.xspeed * -1;
       }
       else if (this.x < this.diameter / 2) {
          this.xspeed = this.xspeed * -1;
       }
 
       if (this.y > (height - this.diameter / 2)) {
          this.yspeed = this.yspeed * -1;
       }
       else if (this.y < this.diameter / 2) {
          this.yspeed = this.yspeed * -1;
       }
 
       this.x = this.x + this.xspeed;
       this.y = this.y + this.yspeed;
 
    }
 }
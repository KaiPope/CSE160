class Camera{
   constructor(){
      this.eye = new Vector3([4.65,.5,-4.42]);
      this.at  = new Vector3([-4,0,80]);
      this.up  = new Vector3([0,1,0]);
      this.viewMat = new Matrix4();
      
      this.viewMat = new Matrix4();
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
                           this.at.elements[0], this.at.elements[1], this.at.elements[2],
                           this.up.elements[0], this.up.elements[1], this.up.elements[2]); 
      this.projMat = new Matrix4();
      this.projMat.setPerspective(60, 1*canvas.width/canvas.height, .1, 100);
   }
   
   moveForward(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      d.normalize();
      this.eye = this.eye.add(d.mul(.3));
      this.at = this.at.add(d.mul(.3));
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
         this.at.elements[0], this.at.elements[1], this.at.elements[2],
         this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }

   back(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      d.normalize();
      this.eye = this.eye.sub(d.mul(.3));
      this.at = this.at.sub(d.mul(.3));
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
         this.at.elements[0], this.at.elements[1], this.at.elements[2],
         this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }

   left(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      d = d.normalize();
      var l = new Vector3([0,0,0]);
      l.set(d);
      console.log(this.up);
      console.log(d);
      l.Vector3.cross(this.up, d);
      l = l.normalize();
      this.eye.add(l);
      this.at = this.at.add(l);
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
         this.at.elements[0], this.at.elements[1], this.at.elements[2],
         this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }

   right(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      d = d.normalize();
      // var r = new Vector3([0,0,0]);
      // //r.set(d);
      // r.Vector3.cross(this.up, d);
      var r = Vector3.cross(d, this.up);
      r = r.normalize();
      this.eye.add(r);
      this.at = this.at.add(r);
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
         this.at.elements[0], this.at.elements[1], this.at.elements[2],
         this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }

   panLeft(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      var l = Math.sqrt(d.elements[0]*d.elements[0] + d.elements[2]*d.elements[2]);
      var theta = Math.atan2(d.elements[2], d.elements[0]);
      theta -= (3 * Math.PI / 180);
      d.elements[0] = l * Math.cos(theta);
      d.elements[2] = l * Math.sin(theta);
      this.at.set(d);
      this.at.add(this.eye);
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);

      // let f = new Vector3;
      // f.set(this.at);
      // f.sub(this.eye);
      // let rotationMatrix = new Matrix4();
      // rotationMatrix.setIdentity();
      // rotationMatrix.setRotate(1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      // let pear = rotationMatrix.multiplyVector3(f);
      // this.at = pear.add(this.eye);
      // this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
      //             this.at.elements[0], this.at.elements[1], this.at.elements[2],
      //             this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }


   panRight(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      var r = Math.sqrt(d.elements[0]*d.elements[0] + d.elements[2]*d.elements[2]);
      var theta = Math.atan2(d.elements[2], d.elements[0]);
      theta += (3 * Math.PI / 180);
      d.elements[0] = r * Math.cos(theta);
      d.elements[2] = r * Math.sin(theta);
      this.at.set(d);
      this.at.add(this.eye);
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }

   // moveUp() {
   //    this.eye.add(this.up);
   // }

   // moveDown() {
   //    this.eye.sub(this.up);
   // }

   rotateCameraUp() {
      this.at.elements[1] += 5; 
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }

   rotateCameraDown() {
      this.at.elements[1] -= 5;
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }
  
}

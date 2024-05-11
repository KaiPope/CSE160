class Camera{
   constructor(){
      this.fov = 60;
      this.eye = new Vector3([0,.5,3]);
      this.at  = new Vector3([0,0,-100]);
      this.up  = new Vector3([0,1,0]);
      this.viewMat = new Matrix4();
      
      this.viewMat = new Matrix4();
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
                           this.at.elements[0], this.at.elements[1], this.at.elements[2],
                           this.up.elements[0], this.up.elements[1], this.up.elements[2]); 

      this.projMat = new Matrix4();
      this.projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 1000);
   }
   
   moveForward(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      d.normalize();
      this.eye = this.eye.add(d);
      this.at = this.at.add(d);
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
         this.at.elements[0], this.at.elements[1], this.at.elements[2],
         this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }

   moveBackward(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      d.normalize();
      this.eye = this.eye.sub(d);
      this.at = this.at.sub(d);
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
         this.at.elements[0], this.at.elements[1], this.at.elements[2],
         this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }

   moveLeft(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      var l = new Vector3([0,0,0]);
      l.set(d);
      l.Vector3.cross(d, this.up);
      l = l.normalize();
      this.eye.add(l);
      this.at = this.at.add(l);
      this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
         this.at.elements[0], this.at.elements[1], this.at.elements[2],
         this.up.elements[0], this.up.elements[1], this.up.elements[2]);
   }

   moveRight(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      var r = new Vector3([0,0,0]);
      r.set(d);
      r.Vector3.cross(this.up, d);
      //var r = Vector3.cross(d, this.up);
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
      theta -= (5 * Math.PI / 180);
      d.elements[0] = l * Math.cos(theta);
      d.elements[2] = l * Math.sin(theta);
      this.at.set(d);
      this.at.add(this.eye);
   }

   panRight(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      var r = Math.sqrt(d.elements[0]*d.elements[0] + d.elements[2]*d.elements[2]);
      var theta = Math.atan2(d.elements[2], d.elements[0]);
      theta -= (5 * Math.PI / 180);
      d.elements[0] = r * Math.cos(theta);
      d.elements[2] = r * Math.sin(theta);
      this.at.set(d);
      this.at.add(this.eye);
   }

   moveUp() {
      this.eye.add(this.up);
   }

   moveDown() {
      this.eye.sub(this.up);
   }

   rotateCameraUp() {
      this.at.elements[1] += 5;
   }

   rotateCameraDown() {
      this.at.elements[1] -= 5;
   }
  
 }

class Camera{
   constructor(){
      this.eye = new Vector3([4.65,.5,-4.42]);
      this.at  = new Vector3([-4,0,80]);
      this.up  = new Vector3([0,1,0]);
      this.viewMat = new Matrix4();
      this.projMat = new Matrix4();
   }
   
   moveForward(){
      var d = new Vector3();
      d.set(this.at);
      d.sub(this.eye);
      d.normalize();
      d.div(8);
      this.eye.add(d);
      this.at.add(d);

   }

   moveBack(){
      var d = new Vector3();
      d.set(this.at);
      d.sub(this.eye);
      d.normalize();
      d.div(8);
      this.eye.sub(d);
      this.eye.sub(d);
   }

   moveLeft(){
      var d = new Vector3();
      d.set(this.eye);
      d.sub(this.at);
      d.normalize();
      var l = Vector3.cross(d, this.up);
      l.normalize(); 
      l.div(8); 
      this.at.add(l);
      this.eye.add(l);
   }

   moveRight(){
      var d = new Vector3();
      d.set(this.eye);
      d.sub(this.at);
      d.normalize();
      var r = Vector3.cross(d, this.up);
      r.normalize();
      r.div(8);
      r.mul(-1); 
      this.at.add(r);
      this.eye.add(r);
   }

   panLeft(){
      var d = new Vector3([0,0,0]);
      d.set(this.at);
      d.sub(this.eye);
      var l = Math.sqrt(d.elements[0]*d.elements[0] + d.elements[2]*d.elements[2]);
      var theta = Math.atan2(d.elements[2], d.elements[0]);
      theta -= (2 * Math.PI / 180);
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
      theta += (2 * Math.PI / 180);
      d.elements[0] = r * Math.cos(theta);
      d.elements[2] = r * Math.sin(theta);
      this.at.set(d);
      this.at.add(this.eye);
   }

   panUp() {
      this.at.elements[1] += 4; //credit to jbrowne2 (minecraft bee hall of fame)  
   }

   panDown() {
      this.at.elements[1] -= 4;
   }
  
}

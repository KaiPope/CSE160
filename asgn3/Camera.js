class Camera{
    constructor(){
       this.fov = 60;
       this.eye = new Vector3([0,.5,3]);
       this.at  = new Vector3([0,0,-100]);
       this.up  = new Vector3([0,1,0]);
       this.viewMat = new Matrix4();
      
       this.projMat = new Matrix4();
       this.projMat.setPerspective(50, canvas.width/canvas.height, 0.1, 1000);
    }
 
   
 }

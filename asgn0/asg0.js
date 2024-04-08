// DrawRectangle.js
function main() {
    // Retrieve <canvas> element <- (1)
    canvas = document.getElementById('cnv1');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
     
    // Get the rendering context for 2DCG <- (2)
    ctx = canvas.getContext('2d');
     
    // Draw a blue rectangle <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

    var v1 = new Vector3([2.5,2.5,0])
    drawVector(v1, "red")
}  

function drawVector(v, color){
    ctx.strokeStyle = color
    let cx = canvas.width/2;
    let cy = canvas.height/2;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + v.elements[0]*20, cy - v.elements[1]*20);
    ctx.stroke();
}

function handleDrawEvent(){
    let x1 = document.getElementById("x1").value;
    let y1 = document.getElementById("y1").value;
    let x2 = document.getElementById("x2").value;
    let y2 = document.getElementById("y2").value;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let v1 = new Vector3([x1, y1, 0]);
    drawVector(v1, "red");
    let v2= new Vector3([x2, y2, 0]);
    drawVector(v2, "blue");
}

function handleDrawOperationEvent(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x1 = document.getElementById("x1").value;
    let y1 = document.getElementById("y1").value;
    let x2 = document.getElementById("x2").value;
    let y2 = document.getElementById("y2").value;

    let v1 = new Vector3([x1, y1, 0]);
    drawVector(v1, "red");
    let v2= new Vector3([x2, y2, 0]);
    drawVector(v2, "blue");

    let op = document.getElementById('operation').value;
    if(op=="add"){
        v1.add(v2);
        drawVector(v1, "green");
    }else if(op=="subtract"){
        v1.sub(v2);
        drawVector(v1, "green");
    }else if(op=="multiply"){
        let sc = document.getElementById('scalar').value;
        v1.mul(sc);
        drawVector(v1, "green");
        v2.mul(sc);
        drawVector(v2, "green");
    }else if(op=="divide"){
        let sc = document.getElementById('scalar').value;
        v1.div(sc);
        drawVector(v1, "green");
        v2.div(sc);
        drawVector(v2, "green");
    }else if (op=="magnitude"){
        console.log("Magnitude v1:",v1.magnitude());
        console.log("Magnitude v2:",v2.magnitude());
    }else if (op=="normalize"){
        let n1 = v1.normalize();
        drawVector(n1, "green");
        let n2 = v2.normalize();
        drawVector(n2, "green");
    }else if (op=="angle between"){
        console.log("Angle:", (angleBetween(v1, v2)).toFixed(2));
    }else if (op=="area"){
        console.log("Area of this triangle:", (areaTriangle(v1, v2)).toFixed(2));
    }
}

function angleBetween(v1, v2){
    let m1 = v1.magnitude();
    let m2 = v2.magnitude();
    let d = Vector3.dot(v1,v2);

    let angle = Math.acos(d/(m1*m2));
    angle *= 180/Math.PI;
    return angle;
}

function areaTriangle(v1, v2){
    let c = Vector3.cross(v1,v2);
    let v = new Vector3([c[0], c[1], c[2]]);

    let area = v.magnitude()/2;

    return area;
}

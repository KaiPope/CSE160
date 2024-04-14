function painting(){
    
    //gl.uniform4f(u_FragColor, 0.3, .3, .3, 1);
    // point = new Triangle();
    // point.color=[0.3, .3, .3, 1]
    // point.size=g_selectedSize;
    // point.drawing=true;
    // point.drawPosition=[-0.03, 0.55, -0.1, 0.85, -0.05, 0.85];
    // g_shapesList.push(point);

    // point = new Triangle();
    // point.color=[0.3, .3, .3, 1]
    // point.size=g_selectedSize;
    // point.drawing=true;
    // point.drawPosition=[0.03, 0.55, 0.1, 0.85, 0.05, 0.85];
    // g_shapesList.push(point);

    // Antennae
    gl.uniform4f(u_FragColor, 0.3, .3, .3, 1);
    drawTriangle([-0.03, 0.55, -0.1, 0.85, -0.05, 0.85]);
    drawTriangle([0.03, 0.55, 0.1, 0.85, 0.05, 0.85]);
    
    // Body
    gl.uniform4f(u_FragColor, 0.16, .07, .04, 1);
    drawTriangle([-.05, 0.6, -0.05, -0.6, 0.05, -0.6]);
    drawTriangle([-.05, 0.6, 0.05, 0.6, 0.05, -0.6]);
    
    // Left Wings
    gl.uniform4f(u_FragColor, 0.5, .45, .85, 1);
    drawTriangle([-0.05,0.6, -0.05,-0.2, -0.65,-0.2]);
    drawTriangle([-0.05,0.6, -0.65,0.6, -0.65,-0.2]);
    drawTriangle([-0.05,0.6, -0.45,1.0, -0.45,0.6]);
    drawTriangle([-0.25,0.6, -0.45,1.0, -0.85,0.6]);
    drawTriangle([-0.85,1.0, -0.45,1.0, -0.85,0.6]);
    drawTriangle([-0.85,1.0, -1.0,0.80, -0.85,0.80]);
    drawTriangle([-0.85,0.2, -1.0,0.80, -0.85,0.80]);
    drawTriangle([-0.85,0.2, -1.0,0.80, -1.0,0.2]);
    drawTriangle([-0.65,0.2, -0.65,-0.2, -1.0,0.2]);
    drawTriangle([-0.85,0.2, -0.85,0.80, -0.65,0.2]);
    drawTriangle([-0.65,0.80, -0.85,0.80, -0.65,0.2]);
    drawTriangle([-0.05,-0.6, -0.05,-0.2, -0.65,-0.6]);
    drawTriangle([-0.65,-0.6, -0.05,-0.2, -0.65,-0.2]);
    drawTriangle([-0.65,-0.4, -0.85,-0.4, -0.65,-0.2]);
    drawTriangle([-0.65,-0.6, -0.85,-0.4, -0.65,-0.4]);
    drawTriangle([-0.65,-0.6, -0.85,-0.4, -0.85,-0.6]);
    drawTriangle([-0.65,-0.6, -0.65,-0.8, -0.85,-0.6]);
    drawTriangle([-0.65,-0.6, -0.65,-0.8, -0.25,-0.6]);
    drawTriangle([-0.25,-0.8, -0.65,-0.8, -0.25,-0.6]);
    drawTriangle([-0.25,-0.8, -0.05,-0.6, -0.25,-0.6]);

    // Right Wings
    drawTriangle([0.05, 0.6, 0.05, -0.2, 0.65, -0.2]);
    drawTriangle([0.05, 0.6, 0.65, 0.6, 0.65, -0.2]);
    drawTriangle([0.05, 0.6, 0.45, 1.0, 0.45, 0.6]);
    drawTriangle([0.25, 0.6, 0.45, 1.0, 0.85, 0.6]);
    drawTriangle([0.85, 1.0, 0.45, 1.0, 0.85, 0.6]);
    drawTriangle([0.85, 1.0, 1.0, 0.80, 0.85, 0.80]);
    drawTriangle([0.85, 0.2, 1.0, 0.80, 0.85, 0.80]);
    drawTriangle([0.85, 0.2, 1.0, 0.80, 1.0, 0.2]);
    drawTriangle([0.65, 0.2, 0.65, -0.2, 1.0, 0.2]);
    drawTriangle([0.85, 0.2, 0.85, 0.80, 0.65, 0.2]);
    drawTriangle([0.65, 0.80, 0.85, 0.80, 0.65, 0.2]);

    drawTriangle([0.05, -0.6, 0.05, -0.2, 0.65, -0.6]);
    drawTriangle([0.65, -0.6, 0.05, -0.2, 0.65, -0.2]);
    drawTriangle([0.65, -0.4, 0.85, -0.4, 0.65, -0.2]);
    drawTriangle([0.65, -0.6, 0.85, -0.4, 0.65, -0.4]);
    drawTriangle([0.65, -0.6, 0.85, -0.4, 0.85, -0.6]);
    drawTriangle([0.65, -0.6, 0.65, -0.8, 0.85, -0.6]);
    drawTriangle([0.65, -0.6, 0.65, -0.8, 0.25, -0.6]);
    drawTriangle([0.25, -0.8, 0.65, -0.8, 0.25, -0.6]);
    drawTriangle([0.25, -0.8, 0.05, -0.6, 0.25, -0.6]);

}


function painting(){
    
    //gl.uniform4f(u_FragColor, 0.3, .3, .3, 1);
    point = new Triangle();
    point.color=[0.3, .3, .3, 1]
    point.drawing=true;
    point.drawPosition=[-0.03, 0.55, -0.1, 0.85, -0.05, 0.85];
    g_shapesList.push(point);

    point = new Triangle();
    point.color=[0.3, .3, .3, 1]
    point.drawing=true;
    point.drawPosition=[0.03, 0.55, 0.1, 0.85, 0.05, 0.85];
    g_shapesList.push(point);

    // Body
    point = new Triangle();
    point.color=[0.16, .07, .04, 1]
    point.drawing=true;
    point.drawPosition=[-.05, 0.6, -0.05, -0.6, 0.05, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color=[0.16, .07, .04, 1]
    point.drawing=true;
    point.drawPosition=[-.05, 0.6, 0.05, 0.6, 0.05, -0.6];
    g_shapesList.push(point);
    

    //Left Wing
    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.05, 0.6, -0.05, -0.2, -0.65, -0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.05, 0.6, -0.65, 0.6, -0.65, -0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.05, 0.6, -0.45, 1.0, -0.45, 0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.25, 0.6, -0.45, 1.0, -0.85, 0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.85, 1.0, -0.45, 1.0, -0.85, 0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.85, 1.0, -1.0, 0.80, -0.85, 0.80];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.85, 0.2, -1.0, 0.80, -0.85, 0.80];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.85, 0.2, -1.0, 0.80, -1.0, 0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.65, 0.2, -0.65, -0.2, -1.0, 0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.85, 0.2, -0.85, 0.80, -0.65, 0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.65, 0.80, -0.85, 0.80, -0.65, 0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.05, -0.6, -0.05, -0.2, -0.65, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.65, -0.6, -0.05, -0.2, -0.65, -0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.65, -0.4, -0.85, -0.4, -0.65, -0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.65, -0.6, -0.85, -0.4, -0.65, -0.4];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.65, -0.6, -0.85, -0.4, -0.85, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.65, -0.6, -0.65, -0.8, -0.85, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.65, -0.6, -0.65, -0.8, -0.25, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.25, -0.8, -0.65, -0.8, -0.25, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [-0.25, -0.8, -0.05, -0.6, -0.25, -0.6];
    g_shapesList.push(point);
    
    
    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.05, 0.6, 0.05, -0.2, 0.65, -0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.05, 0.6, 0.65, 0.6, 0.65, -0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.05, 0.6, 0.45, 1.0, 0.45, 0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.25, 0.6, 0.45, 1.0, 0.85, 0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.85, 1.0, 0.45, 1.0, 0.85, 0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.85, 1.0, 1.0, 0.80, 0.85, 0.80];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.85, 0.2, 1.0, 0.80, 0.85, 0.80];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.85, 0.2, 1.0, 0.80, 1.0, 0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.65, 0.2, 0.65, -0.2, 1.0, 0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.85, 0.2, 0.85, 0.80, 0.65, 0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.65, 0.80, 0.85, 0.80, 0.65, 0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.05, -0.6, 0.05, -0.2, 0.65, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.65, -0.6, 0.05, -0.2, 0.65, -0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.65, -0.4, 0.85, -0.4, 0.65, -0.2];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.65, -0.6, 0.85, -0.4, 0.65, -0.4];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.65, -0.6, 0.85, -0.4, 0.85, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.65, -0.6, 0.65, -0.8, 0.85, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.65, -0.6, 0.65, -0.8, 0.25, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.25, -0.8, 0.65, -0.8, 0.25, -0.6];
    g_shapesList.push(point);

    point = new Triangle();
    point.color = [0.5, 0.45, 0.85, 1];
    point.drawing = true;
    point.drawPosition = [0.25, -0.8, 0.05, -0.6, 0.25, -0.6];
    g_shapesList.push(point);

    renderAllShapes();

}


class Cube{
    constructor(){
       this.type='cube';
       this.color = [1.0, 1.0, 1.0, 1.0];
       this.matrix = new Matrix4();
       this.textureNum = -2;
    }
 
    render() {
        var rgba = this.color;
 
        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        // drawTriangle3DUVNormal(
        //     [0,0,0, 1,1,0, 1,0,0],
        //     [0,0, 1,1, 1,0],
        //     [0,0,-1, 0,0,-1, 0,0,-1]
        // );
        
        //front
        drawTriangle3DUVNormal( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1] );
        drawTriangle3DUVNormal( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1] );
        // drawTriangle3D( [0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0 ]);
        // drawTriangle3D( [0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0 ]);
        
        //back
        drawTriangle3DUVNormal( [0,0,1, 1,0,1, 1,1,1], [0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1] );
        drawTriangle3DUVNormal( [0,0,1, 1,1,1, 0,1,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1] );
        // drawTriangle3D([0,0,1, 1,0,1, 1,1,1]);
        // drawTriangle3D([0,0,1, 1,1,1, 0,1,1]);


        //gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3])
        //top
        drawTriangle3DUVNormal( [0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0] );
        drawTriangle3DUVNormal( [0,1,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0] );
        // drawTriangle3D( [0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0 ]);
        // drawTriangle3D( [0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0 ]);

        //bottom
        drawTriangle3DUVNormal( [0,0,0,  0,0,1,  1,0,1 ], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0] );
        drawTriangle3DUVNormal( [0,0,0,  1,0,1,  1,0,0 ], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0] );
        // drawTriangle3D( [0,0,0,  0,0,1,  1,0,1 ]);
        // drawTriangle3D( [0,0,0,  1,0,1,  1,0,0 ]);
        

        //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3])
        //left
        drawTriangle3DUVNormal( [0,0,0, 0,0,1, 0,1,1], [0,0, 0,1, 1,1], [-1,0,0, -1,0,0, -1,0,0] );
        drawTriangle3DUVNormal( [0,0,0, 0,1,1, 0,1,0], [0,0, 1,1, 1,0], [-1,0,0, -1,0,0, -1,0,0] );
        // drawTriangle3D( [0,0,0, 0,0,1, 0,1,1], [1,0, 0,1, 1,1]);
        // drawTriangle3D( [0,0,0, 0,1,1, 0,1,0], [0,1, 1,1, 0,0]);

        //right
        drawTriangle3DUVNormal( [1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0] );
        drawTriangle3DUVNormal( [1,0,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0] );
        // drawTriangle3D([1,0,0, 1,1,1, 1,0,1], [1,0, 0,1, 1,1]);
        // drawTriangle3D( [1,0,0, 1,1,0, 1,1,1], [0,1, 1,1, 0,0]);

        

        //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    }

    renderfast(){
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1i(u_whichTexture, this.textureNum);


        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var allverts = [];
        // Front
        allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0 ]);
        allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0 ]);
        // Back
        allverts = allverts.concat([0,0,1, 1,1,1, 1,0,1 ]);
        allverts = allverts.concat([0,0,1, 0,1,1, 1,1,1 ]);
        // Top
        allverts = allverts.concat([0,1,0, 1,1,0, 1,1,1 ]);
        allverts = allverts.concat([0,1,1, 0,1,0, 1,1,1 ]);
        // Bottom
        allverts = allverts.concat([0,0,0, 0,0,1, 1,0,0 ]);
        allverts = allverts.concat([1,0,0, 1,0,1, 0,0,1 ]);
        // Left
        allverts = allverts.concat([0,0,0, 0,1,0, 0,1,1 ]);
        allverts = allverts.concat([0,1,1, 0,0,0, 0,0,1 ]);
        // Right
        allverts = allverts.concat([1,0,0, 1,1,0, 1,1,1 ]);
        allverts = allverts.concat([1,1,1, 1,0,0, 1,0,1 ]);

        var alluvs = [
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
        ];

        var allnorms = [
            0,0,-1, 0,0,-1, 0,0,-1,
            0,0,-1, 0,0,-1, 0,0,-1,
            0,1,0, 0,1,0, 0,1,0,
            0,1,0, 0,1,0, 0,1,0,
            1,0,0, 1,0,0, 1,0,0,
            1,0,0, 1,0,0, 1,0,0,
            -1,0,0, -1,0,0, -1,0,0,
            -1,0,0, -1,0,0, -1,0,0,
            0,-1,0, 0,-1,0, 0,-1,0,
            0,-1,0, 0,-1,0, 0,-1,0,
            0,0,1, 0,0,1, 0,0,1,
            0,0,1, 0,0,1, 0,0,1
        ];

        drawTriangle3DUVNormal(allverts, alluvs, allnorms);
        
    }
}
 

import { useEffect, useRef } from "react";

const TriangleCanvas = () => {
  // Canvas element reference
  const canvasRef = useRef(null);

  useEffect(() => {
    // Get the canvas element, we can draw to this
    const canvas = canvasRef.current;

    // Get the WebGL rendering context
    const gl = canvas.getContext("webgl");

    // Check if WebGL is supported, err if not
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Vertex Shader (positions)
    const vertexShaderSource = `
      attribute vec2 a_position; // Input attribute: 2D position of a vertex
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0); // Convert to 4D vec4 for rendering
      }
    `;

    // Fragment Shader (colors)
    const fragmentShaderSource = `
      precision mediump float; // Set precision for color calculations
      void main() {
        gl_FragColor = vec4(1, 0.5, 0, 1); // Output color (orange)
      }
    `;

    // Compile a shader
    const createShader = (type, source) => {
      const shader = gl.createShader(type); // Create new shader 
      gl.shaderSource(shader, source); // Attach shader to the code
      gl.compileShader(shader); // Compile

      // Check for compile errors, err and delete if something broke
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader); // Delete shader if compilation failed
        return null;
      }
      return shader;
    };

    // Compile vertex and fragment shaders
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create the WebGL program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader); // Attach vertex shader
    gl.attachShader(program, fragmentShader); // Attach fragment shader
    gl.linkProgram(program); // Link the shaders together 

    // Check for program linking errors
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    // Use the shader program for rendering
    gl.useProgram(program);

    // Making the triangle
    const vertices = new Float32Array([
      0.0,  0.6,   // Top 
      -0.6, -0.6,  // Bottom left 
      0.6, -0.6    // Bottom right 
    ]);

    // Create a buffer to store vertex data
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // Bind buffer
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // Copy into buffer

    // Get the attribute location in the shader
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation); // Enable 
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Clear with a grey/blueish background
    gl.clearColor(0, .2, .2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Drawin the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, []);

  // Render 
  return <canvas ref={canvasRef} width={400} height={400} />;
};

export default TriangleCanvas;

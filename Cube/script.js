// https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language
const vertexShaderTxt = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main()
    {
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }

`;

const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0); // R,G,B, opacity
    }
`;

let A = 2;
let RGB1 = [0.5, 0.5, 0.5];
let RGB2 = [0.75, 0.25, 0.5];
let RGB3 = [0.25, 0.25, 0.75];
let RGB4 = [1.0, 0.0, 0.15];
let RGB5 = [0.0, 1.0, 0.15];
let RGB6 = [0.5, 0.5, 1.0];

const mat4 = glMatrix.mat4;

const form = document.getElementById("form");
form.addEventListener("submit", reRender);

function reRender(e) {
    e.preventDefault();

    const values = e.target;
    A = values[0].value;
    RGB1 = [values[1].value / 255, values[2].value / 255, values[3].value / 255];
    RGB2 = [values[4].value / 255, values[5].value / 255, values[6].value / 255];
    RGB3 = [values[7].value / 255, values[8].value / 255, values[9].value / 255];
    RGB4 = [values[10].value / 255, values[11].value / 255, values[12].value / 255];
    RGB5 = [values[13].value / 255, values[14].value / 255, values[15].value / 255];
    RGB6 = [values[16].value / 255, values[17].value / 255, values[18].value / 255];
    Render();
}

function reRenderRandom() {
    A = Math.random() * 5;
    RGB1 = [Math.random(), Math.random(), Math.random()];
    RGB2 = [Math.random(), Math.random(), Math.random()];
    RGB3 = [Math.random(), Math.random(), Math.random()];
    RGB4 = [Math.random(), Math.random(), Math.random()];
    RGB5 = [Math.random(), Math.random(), Math.random()];
    RGB6 = [Math.random(), Math.random(), Math.random()];
    
    Render();
}


function Render() {
  let canvas = document.getElementById("main-canvas");
  let gl = canvas.getContext("webgl");

  if (!gl) {
    alert("webgl not supported");
  }

  gl.clearColor(0.1, 0.1, 0.1, 0.1); // R,G,B, opacity
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderTxt);
  gl.shaderSource(fragmentShader, fragmentShaderTxt);

  gl.compileShader(vertexShader);
  // shaderCompileErr(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      gl.getShaderInfoLog(vertexShader)
    );
    return;
  }
  gl.compileShader(fragmentShader);
  // shaderCompileErr(fragmentShader);

  let program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.detachShader(program, vertexShader); //https://www.khronos.org/opengl/wiki/Shader_Compilation#Before_linking
  gl.detachShader(program, fragmentShader);


  gl.validateProgram(program);
  // -1.0 do 1.0
  var boxVertices = [
		// Top
		-(A/2), (A/2), -(A/2),   ...RGB1,
		-(A/2), (A/2), (A/2),    ...RGB1,
		(A/2), (A/2), (A/2),     ...RGB1,
		(A/2), (A/2), -(A/2),    ...RGB1,

		// Left
		-(A/2), (A/2), (A/2),    ...RGB2,
		-(A/2), -(A/2), (A/2),   ...RGB2,
		-(A/2), -(A/2), -(A/2),  ...RGB2,
		-(A/2), (A/2), -(A/2),   ...RGB2,

		// Right
		(A/2), (A/2), (A/2),    ...RGB3,
		(A/2), -(A/2), (A/2),   ...RGB3,
		(A/2), -(A/2), -(A/2),  ...RGB3,
		(A/2), (A/2), -(A/2),   ...RGB3,

		// Front
		(A/2), (A/2), (A/2),    ...RGB4,
		(A/2), -(A/2), (A/2),   ...RGB4,
		-(A/2), -(A/2), (A/2),  ...RGB4,
		-(A/2), (A/2), (A/2),   ...RGB4,

		// Back
		(A/2), (A/2), -(A/2),   ...RGB5,
		(A/2), -(A/2), -(A/2),  ...RGB5,
		-(A/2), -(A/2), -(A/2), ...RGB5,
		-(A/2), (A/2), -(A/2),  ...RGB5,

		// Bottom
		-(A/2), -(A/2), -(A/2), ...RGB6,
		-(A/2), -(A/2), (A/2),  ...RGB6,
		(A/2), -(A/2), (A/2),   ...RGB6,
		(A/2), -(A/2), -(A/2),  ...RGB6,
  ];

  var boxIndices = [
    // Top
    0, 1, 2, 0, 2, 3,

    // Left
    5, 4, 6, 6, 4, 7,

    // Right
    8, 9, 10, 8, 10, 11,

    // Front
    13, 12, 14, 15, 14, 12,

    // Back
    16, 17, 18, 16, 18, 19,

    // Bottom
    21, 20, 22, 22, 20, 23,
  ];

  const boxVerticesertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVerticesertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW); // since everything in JS is 64 bit floating point we need to convert to 32 bits

  const cubeIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(boxIndices),
    gl.STATIC_DRAW
  ); // since everything in JS is 64 bit floating point we need to convert to 32 bits

  const posAttrLocation = gl.getAttribLocation(program, "vertPosition");
  const colorAttrLocation = gl.getAttribLocation(program, "vertColor");

  gl.vertexAttribPointer(
    posAttrLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.vertexAttribPointer(
    colorAttrLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );

  gl.enableVertexAttribArray(posAttrLocation);
  gl.enableVertexAttribArray(colorAttrLocation);

  gl.useProgram(program);

  const matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
  const matViewUniformLocation = gl.getUniformLocation(program, "mView");
  const matProjUniformLocation = gl.getUniformLocation(program, "mProj");

  let worldMatrix = mat4.create();
  let viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]); // vectors are: position of the camera, which way they are looking, which way is up
  let projMatrix = mat4.create();
  mat4.perspective(
    projMatrix,
    glMatrix.glMatrix.toRadian(45),
    canvas.width / canvas.height,
    0.1,
    1000.0
  );

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  let identityMatrix = mat4.create();
  let angle = 0;
  const loop = function () {
    angle = (performance.now() / 1000 / 8) * 2 * Math.PI;

    mat4.rotate(worldMatrix, identityMatrix, angle, [1, 2, 0]);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

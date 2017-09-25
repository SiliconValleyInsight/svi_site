var container, camera, scene, renderer, delta, time, oldTime, particles, geometrya, geometryb,
  has_gl = false,
  deviceTop = deviceLeft = mouseX = mouseY = tomouseX = tomouseY = todeviceX = todeviceY = switchCount = 0,
  extraRotation = {
    value: 0
  };
map = THREE.ImageUtils.loadTexture("https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/p_trans6.png");

document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('deviceorientation', handleOrientation);

init();
animate();

function init() {
  container = document.createElement('div');
  container.setAttribute("id", "animation-canvas");
  document.body.appendChild(container);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 4000;
  scene.add(camera);
  attributes = {
    size: {
      type: 'f',
      value: []
    },
    custompositiona: {
      type: 'v3',
      value: []
    },
    custompositionb: {
      type: 'v3',
      value: []
    },
    customColor: {
      type: 'c',
      value: []
    },
  };
  uniforms = {
    amplitude: {
      type: "f",
      value: 0.0
    },
    color: {
      type: "c",
      value: new THREE.Color(0xFFffff)
    },
    texture: {
      type: "t",
      value: 0,
      texture: map
    },
    time: {
      type: "f",
      value: 1.0
    },
    direction: {
      type: "f",
      value: 1.0
    },
  };
  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    attributes: attributes,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    blending: THREE.NormalBlending,
    depthTest: true,
    transparent: false,
  });
  var radius = 1400;
  var extraParticles = 10000;
  var geometry = new THREE.Geometry();
  for (var i = 0; i < Math.floor(bridgeFigure.length / 3); ++i) {
    var vector = getRandomPointOnparticles(400 + Math.random() * radius * 1.5);
    geometry.vertices.push(vector);
  }
  for (var i = 0; i < extraParticles; i++) {
    var vector = getRandomPointOnparticles(radius + Math.random() * radius);
    geometry.vertices.push(vector);
  }
  particles = new THREE.ParticleSystem(geometry, shaderMaterial);
  var vertices = particles.geometry.vertices;
  var values_size = attributes.size.value;
  var values_color = attributes.customColor.value;
  baseSize = [];
  for (var v = 0; v < vertices.length; v++) {
    baseSize[v] = 10 + Math.random() * 60;
    values_size[v] = baseSize[v];
    values_color[v] = new THREE.Color(0xffffff);
    values_color[v].setHSV(0.99, 0.75 * (v / vertices.length), 1.0);
  }
  var values_positiona = attributes.custompositiona.value;
  var values_positionb = attributes.custompositionb.value;
  for (var v = 0; v < vertices.length; v++) {
    var index = v * 3;
    if (index > bridgeFigure.length) {
      values_positiona[v] = getRandomPointOnparticles(400 + Math.random() * radius * 1.5);
      values_positionb[v] = getRandomPointOnparticles(400 + Math.random() * radius * 1.5);
    } else {
      var vector = new THREE.Vector3(bridgeFigure[index], bridgeFigure[index + 2] - 7, -bridgeFigure[index + 1]);
      vector.multiplyScalar(120);
      values_positiona[v] = vector;
      var vector = new THREE.Vector3(humanFigure[index], humanFigure[index + 2] - 2, -humanFigure[index + 1]);
      vector.multiplyScalar(170);
      values_positionb[v] = vector;
    }
  }
  scene.add(particles);
  particles.position.z = -7500;
  var tween = new TWEEN.Tween(particles.position)
    .to({
      z: 0
    }, 3000)
    .delay(500)
    .easing(TWEEN.Easing.Back.EaseOut);
  tween.start();
  tweenUp();
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setClearColorHex(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight + 63);
    renderer.autoClear = true;
    container.appendChild(renderer.domElement);
    has_gl = true;
  } catch (e) {
    document.getElementById('info').innerHTML = "";
    document.getElementById('info').style.display = "block";
    return;
  }
  window.addEventListener('resize', function() {
    var ua = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      renderer.setSize(window.innerWidth, window.innerHeight + 63);
    } else {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, false);
}

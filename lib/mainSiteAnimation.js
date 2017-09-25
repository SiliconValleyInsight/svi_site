			var container;
			var camera, scene, renderer, delta, time, oldTime;
			var has_gl = false;
			var deviceTop = 0;
			var deviceLeft = 0;
			var mouseX = 0,
			  mouseY = 0;
			var tomouseX = 0,
			  tomouseY = 0;
			var todeviceX = 0,
			  todeviceY = 0;
			var particles;
			var switchCount = 0;
			var extraRotation = {
			  value: 0
			};
			var geometrya, geometryb;
			document.addEventListener('mousemove', onDocumentMouseMove, false);
		init();
			animate();

			function init() {
			  container = document.createElement('div');
			  document.body.appendChild(container);
			  scene = new THREE.Scene();
			  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
			  camera.position.z = 4000;
			  scene.add(camera);
			  var map = THREE.ImageUtils.loadTexture("//raw.githubusercontent.com/puffek/test/master/p_trans6.png");
			  // particles
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
			  for (var i = 0; i < Math.floor(data1.length / 3); ++i) {
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
			    //values_color[ v ].setHSV( 0.55, 0.75*( v / vertices.length ), 1.0 );
			  }
			  var values_positiona = attributes.custompositiona.value;
			  var values_positionb = attributes.custompositionb.value;
			  for (var v = 0; v < vertices.length; v++) {
			    var index = v * 3;
			    if (index > data1.length) {
			      values_positiona[v] = getRandomPointOnparticles(400 + Math.random() * radius * 1.5);
			      values_positionb[v] = getRandomPointOnparticles(400 + Math.random() * radius * 1.5);
			    } else {
			      var vector = new THREE.Vector3(data1[index], data1[index + 2] - 7, -data1[index + 1]);
			      vector.multiplyScalar(120);
			      values_positiona[v] = vector;
			      var vector = new THREE.Vector3(data2[index], data2[index + 2] - 2, -data2[index + 1]);
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
			    // renderer
			    renderer = new THREE.WebGLRenderer({
			      antialias: true
			    });
			    renderer.setClearColorHex(0x000000, 1);
			    renderer.setSize(window.innerWidth, window.innerHeight);
			    renderer.autoClear = true;
			    THREEx.WindowResize(renderer, camera);
			    container.appendChild(renderer.domElement);
			    has_gl = true;
			  } catch (e) {
			    // need webgl
			    document.getElementById('info').innerHTML = "<P><BR><B>Note.</B> You need a modern browser that supports WebGL for this to run the way it is intended.<BR>For example. <a href='http://www.google.com/landing/chrome/beta/' target='_blank'>Google Chrome 9+</a> or <a href='http://www.mozilla.com/firefox/beta/' target='_blank'>Firefox 4+</a>.<BR><BR>If you are already using one of those browsers and still see this message, it's possible that you<BR>have old blacklisted GPU drivers. Try updating the drivers for your graphic card.<BR>Or try to set a '--ignore-gpu-blacklist' switch for the browser.</P><CENTER><BR><img src='../general/WebGL_logo.png' border='0'></CENTER>";
			    document.getElementById('info').style.display = "block";
			    return;
			  }
			}

			function handleOrientation(event) {
			  var deviceX = event.gamma * 5; // In degree in the range [-180,180]
			  var deviceY = (event.beta - 45) * 5; // In degree in the range [-90,90]
			  var maxDeviceX = window.innerWidth;
			  var maxDeviceY = window.innerHeight;
			  deviceX += 90;
			  deviceY += 90;
			  deviceTop = (maxDeviceX * deviceX / 180);
			  deviceLeft = (maxDeviceY * deviceY / 180);
			}
			window.addEventListener('deviceorientation', handleOrientation);

			function onDocumentMouseMove(event) {
			  event.preventDefault();
			  var windowHalfX = window.innerWidth >> 1;
			  var windowHalfY = window.innerHeight >> 1;
			  mouseX = (event.clientX - windowHalfX);
			  mouseY = (event.clientY - windowHalfY);
			}

			function getRandomPointOnparticles(r) {
			  var angle = Math.random() * Math.PI * 2;
			  var u = Math.random() * 2 - 1;
			  var v = new THREE.Vector3(
			    Math.cos(angle) * Math.sqrt(1 - Math.pow(u, 2)) * r,
			    Math.sin(angle) * Math.sqrt(1 - Math.pow(u, 2)) * r,
			    u * r
			  );
			  return v;
			}

			function tweenUp() {
			  if (switchCount % 2 == 1) {
			    uniforms.direction.value = 0.0;
			  } else {
			    uniforms.direction.value = 1.0;
			  }

			  ++switchCount;
			  var tween = new TWEEN.Tween(uniforms.amplitude)
			    .to({
			      value: 1
			    }, 8000)
			    .easing(TWEEN.Easing.Back.EaseInOut)
			    .delay(200)
			    .onComplete(tweenDown);
			  tween.start();

			}

			function tweenDown() {
			  var tween = new TWEEN.Tween(uniforms.amplitude)
			    .to({
			      value: 0
			    }, 4000)
			    .easing(TWEEN.Easing.Back.EaseInOut)
			    .delay(4500)
			    .onComplete(tweenUp);
			  tween.start();
			  var rottween = new TWEEN.Tween(extraRotation)
			    .to({
			      value: extraRotation.value + Math.PI * 2
			    }, 12000)
			    .easing(TWEEN.Easing.Quintic.EaseInOut)
			    .delay(4000);
			  rottween.start();
			}

			function animate() {
			  requestAnimationFrame(animate);
			  render();
			}

			function render() {
			  time = new Date().getTime();
			  delta = time - oldTime;
			  oldTime = time;
			  if (isNaN(delta) || delta > 1000 || delta == 0) {
			    delta = 1000 / 60;
			  }
			  // particles
			  var extra;
			  for (var i = 0; i < attributes.size.value.length; i++) {
			    attributes.size.value[i] = baseSize[i] + baseSize[i] * Math.abs(Math.sin(0.1 * i + time * 0.001));
			  }
			  attributes.size.needsUpdate = true;
			  uniforms.time.value += 0.03;
			  var ua = navigator.userAgent;
			  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
			    particles.rotation.x = deviceLeft / 1000;
			    particles.rotation.y = extraRotation.value + (deviceTop / 800);
			    TWEEN.update();
			  } else if (/Chrome|Firefox|Internet Explorer|Safari/i.test(ua)) {
			    tomouseX += (mouseX - tomouseX) / 30;
			    tomouseY += (mouseY - tomouseY) / 30;
			    particles.rotation.x = tomouseY / 1000;
			    particles.rotation.y = extraRotation.value + (tomouseX / 800);
			    TWEEN.update();
			  } else {
			    tomouseX += (mouseX - tomouseX) / 30;
			    tomouseY += (mouseY - tomouseY) / 30;
			  }
			  if (has_gl) {
			    renderer.render(scene, camera);
			  }
			}

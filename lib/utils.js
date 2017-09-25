function onDocumentMouseMove(event) {
  event.preventDefault();
  var windowHalfX = window.innerWidth >> 1;
  var windowHalfY = window.innerHeight >> 1;
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
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

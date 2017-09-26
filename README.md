# svi_site

### Flow

Right now the site (staging) in webflow is referencing this files using an S· bucket I have created:
https://s3.console.aws.amazon.com/s3/buckets/svi-web-assets

For modification you should open a PR and upload the files manually to the bucket, reloading the site will take you changes into consideration.
It is better to use an incognito window (due to the cache).

The idea behind this is stop modifying the page code in webflow, right now the snippet there for the HEAD is:
```
<style>
canvas { pointer-events:none; z-index:-1; position:fixed; top: 0; left: 0; width:100%; height: 100% }
</style>
<script type="text/javascript" src="https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/three.min.js"></script>
<script type="text/javascript" src="https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/humanFigure.js"></script>
<script type="text/javascript" src="https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/bridgeFigure.js"></script>
<script type="text/javascript" src="https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/tween.js"></script>
<script type="text/javascript" src="https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/requestAnimationFrame.js"></script>
<script type="text/javascript" src="https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/underscore.js"></script>
<script type="text/javascript" src="https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/sceneAndCamera.js"></script>
<script type="text/javascript" src="https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/renderer.js"></script>
<script type="text/javascript" src="https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/utils.js"></script>
<script type="x-shader/x-vertex" id="vertexshader">
    uniform float amplitude;
    uniform float direction;
    attribute float size;
    attribute vec3 customColor;
    attribute vec3 custompositiona;
    attribute vec3 custompositionb;
    uniform float time;
    varying vec3 vColor;
    varying float fAlpha;
    void main() {
      vColor = customColor;
      vec3 pos = position;
      pos.x += cos(time + (position.y/8.0))*10.0;
      pos.z += sin(time + (position.x/8.0))*10.0;
              pos.y += sin(time + (position.z/4.0))*8.0;
      vec3 morphed = vec3( 0.0, 0.0, 0.0 );
      if (direction == 0.0) {
        morphed += ( custompositionb - position ) * amplitude;
      } else {
        morphed += ( custompositiona - position ) * amplitude;
      }
      morphed += pos;
      vec4 mvPosition = modelViewMatrix * vec4( morphed, 1.0 );
      fAlpha = (mvPosition.z+10000.0)/6000.0;
      gl_PointSize = min(100.0, size * ( 150.0 / length( mvPosition.xyz ) ) );
      gl_Position = projectionMatrix * mvPosition;
    }
  </script>
  <script type="x-shader/x-fragment" id="fragmentshader">
    uniform vec3 color;
    uniform sampler2D texture;
    varying vec3 vColor;
    varying float fAlpha;
    void main() {
      vec4 outColor = texture2D( texture, gl_PointCoord );
      if ( outColor.a < 0.5 ) discard; // alpha be gone
      gl_FragColor = outColor * vec4( color * vColor.xyz, fAlpha );
    }
  </script>
```

the snippet for the BODY is:
```
<script>
  var container, camera, scene, renderer, delta, time, oldTime, particles, geometrya, geometryb, heightOnLoad, widthOnLoad,
    has_gl = false,
    deviceTop = deviceLeft = mouseX = mouseY = tomouseX = tomouseY = todeviceX = todeviceY = switchCount = 0,
    extraRotation = { value: 0 },
    map = THREE.ImageUtils.loadTexture("https://s3-us-west-1.amazonaws.com/svi-web-assets/lib/p_trans6.png");
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('deviceorientation', handleOrientation);
  init();
  animate();
</script>
```

I needed to include the shaders (for now) inside the HEAD so they are preloaded, and also all the other libraries in this repo; but using the S3 bucket.

### For the future
Cool things to do will be:
1) Automatically send filers inside the master branch to the S3 bucket
2) Obfuscate files before uploading them

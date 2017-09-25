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

  // small noise  movement
  pos.x += cos(time + (position.y/8.0))*10.0;
  pos.z += sin(time + (position.x/8.0))*10.0;
          pos.y += sin(time + (position.z/4.0))*8.0;

  // morph
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

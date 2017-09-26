var Renderer = (function() {
  var instance;

  function createInstance() {
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setClearColorHex(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = true;
    has_gl = true;
    return renderer;
}

return {
  getInstance: function() {
    if (!instance) {
      instance = createInstance();
    }
    return instance;
  }
};
})();

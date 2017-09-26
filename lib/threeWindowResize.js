/** @namespace */
var THREEx = THREEx || {};
THREEx.WindowResize = function(renderer, camera) {
  var callback = function() {
    var ua = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      renderer.setSize(window.innerWidth, window.innerHeight);
    } else {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    $('canvas').css({
      "height": window.screen.height + "px",
      "width": window.screen.width + "px"
    })
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', callback, false);
  return {
    stop: function() {
      window.removeEventListener('resize', callback);
    }
  };
}

// ── SideRays background (React Bits — vanilla WebGL port) ──
(function initSideRaysBg() {
  'use strict';

  var container = document.getElementById('side-rays-bg');
  if (!container) return;

  var baseOpts = {
    speed: 1,
    rayColor1: '#3B82F6',
    rayColor2: '#ffffff',
    intensity: 2,
    spread: 3,
    tilt: 60,
    saturation: 1.5,
    blend: 0.75,
    falloff: 1.8,
    opacity: 1.0
  };

  function sideRaysIsRtl() {
    return document.documentElement.getAttribute('dir') === 'rtl' ||
      document.body.classList.contains('lang-rtl');
  }

  function sideRaysOrigins(isRtl) {
    return isRtl ? ['top-left', 'bottom-right'] : ['top-right', 'bottom-left'];
  }

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m
      ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
      : [1, 1, 1];
  }

  function originToFlip(origin) {
    switch (origin) {
      case 'top-left': return [1, 0];
      case 'bottom-right': return [0, 1];
      case 'bottom-left': return [1, 1];
      default: return [0, 0];
    }
  }

  // Read the page background so the rays can be composited over it inside the
  // shader. We render an OPAQUE canvas (no alpha channel) because mobile
  // browsers / WebViews do not reliably honour a transparent WebGL canvas'
  // alpha when compositing it over the page — which made opacity/blend look
  // wrong (over-bright, "zoomed/scaled up") on phones while being correct on
  // desktop. Compositing here removes that platform dependency entirely.
  function bgColor() {
    var v = '';
    try {
      v = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    } catch (e) {}
    return /^#?[a-f\d]{6}$/i.test(v) ? hexToRgb(v) : [0.031373, 0.039216, 0.062745];
  }

  var vertSrc = 'attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}';
  var fragSrc = [
    'precision highp float;',
    'uniform float iTime;',
    'uniform vec2 iResolution;',
    'uniform float iSpeed;',
    'uniform vec3 iRayColor1;',
    'uniform vec3 iRayColor2;',
    'uniform float iIntensity;',
    'uniform float iSpread;',
    'uniform float iTilt;',
    'uniform float iSaturation;',
    'uniform float iBlend;',
    'uniform float iFalloff;',
    'uniform float iOpacity;',
    'uniform vec3 iBgColor;',
    'uniform vec2 iFlipA;',
    'uniform vec2 iFlipB;',
    'float rayStrength(vec2 raySource,vec2 rayRefDirection,vec2 coord,float seedA,float seedB,float speed){',
    '  vec2 sourceToCoord=coord-raySource;',
    '  float cosAngle=dot(normalize(sourceToCoord),rayRefDirection);',
    '  return clamp((0.45+0.15*sin(cosAngle*seedA+iTime*speed))+(0.3+0.2*cos(-cosAngle*seedB+iTime*speed)),0.0,1.0)*',
    '    clamp((iResolution.x-length(sourceToCoord))/iResolution.x,0.5,1.0);',
    '}',
    // Returns the lit ray colour (rgb) and its visibility (a) for one corner.
    'vec4 computeRays(vec2 flip){',
    '  vec2 fragCoord=gl_FragCoord.xy;',
    '  if(flip.x>0.5) fragCoord.x=iResolution.x-fragCoord.x;',
    '  if(flip.y>0.5) fragCoord.y=iResolution.y-fragCoord.y;',
    '  vec2 coord=vec2(fragCoord.x,iResolution.y-fragCoord.y);',
    '  vec2 rayPos=vec2(iResolution.x*1.1,-0.5*iResolution.y);',
    '  float tiltRad=iTilt*3.14159265/180.0;',
    '  float cs=cos(tiltRad);',
    '  float sn=sin(tiltRad);',
    '  vec2 rel=coord-rayPos;',
    '  vec2 tiltedCoord=vec2(rel.x*cs-rel.y*sn,rel.x*sn+rel.y*cs)+rayPos;',
    '  float halfSpread=iSpread*0.275;',
    '  vec2 rayRefDir1=normalize(vec2(cos(0.785398+halfSpread),sin(0.785398+halfSpread)));',
    '  vec2 rayRefDir2=normalize(vec2(cos(0.785398-halfSpread),sin(0.785398-halfSpread)));',
    '  vec4 rays1=vec4(iRayColor1,1.0)*rayStrength(rayPos,rayRefDir1,tiltedCoord,36.2214,21.11349,iSpeed);',
    '  vec4 rays2=vec4(iRayColor2,1.0)*rayStrength(rayPos,rayRefDir2,tiltedCoord,22.3991,18.0234,iSpeed*0.2);',
    '  vec4 color=rays1*(1.0-iBlend)*0.9+rays2*iBlend*0.9;',
    '  float distanceToLight=length(fragCoord.xy-vec2(rayPos.x,iResolution.y-rayPos.y))/iResolution.y;',
    '  float brightness=iIntensity*0.4/pow(max(distanceToLight,0.001),iFalloff);',
    '  color.rgb*=brightness;',
    '  float gray=dot(color.rgb,vec3(0.299,0.587,0.114));',
    '  color.rgb=mix(vec3(gray),color.rgb,iSaturation);',
    '  float a=max(color.r,max(color.g,color.b))*iOpacity;',
    '  return vec4(color.rgb,clamp(a,0.0,1.0));',
    '}',
    'void main(){',
    '  vec4 a=computeRays(iFlipA);',
    '  vec4 b=computeRays(iFlipB);',
    '  vec3 outc=iBgColor;',
    '  outc=mix(outc,a.rgb,a.a);',
    '  outc=mix(outc,b.rgb,b.a);',
    '  gl_FragColor=vec4(outc,1.0);',
    '}'
  ].join('');

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createScene(opts) {
    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    // alpha:false → opaque canvas; we composite over the bg ourselves so the
    // result is identical on desktop and mobile regardless of how the platform
    // composites a transparent WebGL surface.
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return null;

    var vertShader = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
    var fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    if (!vertShader || !fragShader) return null;

    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

    gl.useProgram(program);

    var posLoc = gl.getAttribLocation(program, 'position');
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    var uniforms = {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iSpeed: gl.getUniformLocation(program, 'iSpeed'),
      iRayColor1: gl.getUniformLocation(program, 'iRayColor1'),
      iRayColor2: gl.getUniformLocation(program, 'iRayColor2'),
      iIntensity: gl.getUniformLocation(program, 'iIntensity'),
      iSpread: gl.getUniformLocation(program, 'iSpread'),
      iTilt: gl.getUniformLocation(program, 'iTilt'),
      iSaturation: gl.getUniformLocation(program, 'iSaturation'),
      iBlend: gl.getUniformLocation(program, 'iBlend'),
      iFalloff: gl.getUniformLocation(program, 'iFalloff'),
      iOpacity: gl.getUniformLocation(program, 'iOpacity'),
      iBgColor: gl.getUniformLocation(program, 'iBgColor'),
      iFlipA: gl.getUniformLocation(program, 'iFlipA'),
      iFlipB: gl.getUniformLocation(program, 'iFlipB')
    };

    gl.uniform1f(uniforms.iSpeed, opts.speed);
    gl.uniform3fv(uniforms.iRayColor1, hexToRgb(opts.rayColor1));
    gl.uniform3fv(uniforms.iRayColor2, hexToRgb(opts.rayColor2));
    gl.uniform1f(uniforms.iIntensity, opts.intensity);
    gl.uniform1f(uniforms.iSpread, opts.spread);
    gl.uniform1f(uniforms.iTilt, opts.tilt);
    gl.uniform1f(uniforms.iSaturation, opts.saturation);
    gl.uniform1f(uniforms.iBlend, opts.blend);
    gl.uniform1f(uniforms.iFalloff, opts.falloff);
    gl.uniform1f(uniforms.iOpacity, opts.opacity);
    gl.uniform3fv(uniforms.iBgColor, bgColor());

    function applyOrigins(origins) {
      var fa = originToFlip(origins[0]);
      var fb = originToFlip(origins[1]);
      gl.useProgram(program);
      gl.uniform2f(uniforms.iFlipA, fa[0], fa[1]);
      gl.uniform2f(uniforms.iFlipB, fb[0], fb[1]);
    }

    applyOrigins(sideRaysOrigins(sideRaysIsRtl()));

    return {
      canvas: canvas,
      gl: gl,
      program: program,
      uniforms: uniforms,
      setOrigins: applyOrigins,
      updateBgColor: function () {
        gl.useProgram(program);
        gl.uniform3fv(uniforms.iBgColor, bgColor());
      },
      updateSize: function () {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        // Fall back to viewport dimensions: on iOS the fixed container can
        // report 0 client size at init, which would leave iResolution at 0
        // and render nothing.
        var w = container.clientWidth || window.innerWidth || document.documentElement.clientWidth;
        var h = container.clientHeight || window.innerHeight || document.documentElement.clientHeight;
        if (!w || !h) return;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
      },
      draw: function (t) {
        gl.uniform1f(uniforms.iTime, t);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    };
  }

  var scene = createScene(baseOpts);
  if (!scene) return;

  function syncSideRaysOrigins() {
    scene.setOrigins(sideRaysOrigins(sideRaysIsRtl()));
    scene.updateBgColor();
  }
  window._syncSideRaysOrigins = syncSideRaysOrigins;

  var animId = null;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateSize() {
    scene.updateSize();
  }

  function drawAll(t) {
    scene.draw(reducedMotion ? 0 : t * 0.001);
  }

  function loop(t) {
    drawAll(t);
    animId = requestAnimationFrame(loop);
  }

  function resync() {
    updateSize();
    drawAll(0);
  }

  updateSize();
  drawAll(0);
  if (!reducedMotion) animId = requestAnimationFrame(loop);

  // Re-sync after layout settles — covers iOS where the fixed container may
  // report 0 size during the initial synchronous run.
  requestAnimationFrame(resync);
  setTimeout(resync, 300);
  window.addEventListener('load', resync);
  window.addEventListener('orientationchange', function () { setTimeout(resync, 200); });

  window.addEventListener('resize', updateSize);
  window.addEventListener('pagehide', function () {
    if (animId) cancelAnimationFrame(animId);
  });
})();

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
    'uniform float iFlipX;',
    'uniform float iFlipY;',
    'uniform float iTilt;',
    'uniform float iSaturation;',
    'uniform float iBlend;',
    'uniform float iFalloff;',
    'uniform float iOpacity;',
    'float rayStrength(vec2 raySource,vec2 rayRefDirection,vec2 coord,float seedA,float seedB,float speed){',
    '  vec2 sourceToCoord=coord-raySource;',
    '  float cosAngle=dot(normalize(sourceToCoord),rayRefDirection);',
    '  return clamp((0.45+0.15*sin(cosAngle*seedA+iTime*speed))+(0.3+0.2*cos(-cosAngle*seedB+iTime*speed)),0.0,1.0)*',
    '    clamp((iResolution.x-length(sourceToCoord))/iResolution.x,0.5,1.0);',
    '}',
    'void main(){',
    '  vec2 fragCoord=gl_FragCoord.xy;',
    '  if(iFlipX>0.5) fragCoord.x=iResolution.x-fragCoord.x;',
    '  if(iFlipY>0.5) fragCoord.y=iResolution.y-fragCoord.y;',
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
    '  color.a=max(color.r,max(color.g,color.b))*iOpacity;',
    '  gl_FragColor=color;',
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

  function createLayer(opts) {
    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    var gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
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

    var flip = originToFlip(opts.origin);
    var uniforms = {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iSpeed: gl.getUniformLocation(program, 'iSpeed'),
      iRayColor1: gl.getUniformLocation(program, 'iRayColor1'),
      iRayColor2: gl.getUniformLocation(program, 'iRayColor2'),
      iIntensity: gl.getUniformLocation(program, 'iIntensity'),
      iSpread: gl.getUniformLocation(program, 'iSpread'),
      iFlipX: gl.getUniformLocation(program, 'iFlipX'),
      iFlipY: gl.getUniformLocation(program, 'iFlipY'),
      iTilt: gl.getUniformLocation(program, 'iTilt'),
      iSaturation: gl.getUniformLocation(program, 'iSaturation'),
      iBlend: gl.getUniformLocation(program, 'iBlend'),
      iFalloff: gl.getUniformLocation(program, 'iFalloff'),
      iOpacity: gl.getUniformLocation(program, 'iOpacity')
    };

    gl.uniform1f(uniforms.iSpeed, opts.speed);
    gl.uniform3fv(uniforms.iRayColor1, hexToRgb(opts.rayColor1));
    gl.uniform3fv(uniforms.iRayColor2, hexToRgb(opts.rayColor2));
    gl.uniform1f(uniforms.iIntensity, opts.intensity);
    gl.uniform1f(uniforms.iSpread, opts.spread);
    gl.uniform1f(uniforms.iFlipX, flip[0]);
    gl.uniform1f(uniforms.iFlipY, flip[1]);
    gl.uniform1f(uniforms.iTilt, opts.tilt);
    gl.uniform1f(uniforms.iSaturation, opts.saturation);
    gl.uniform1f(uniforms.iBlend, opts.blend);
    gl.uniform1f(uniforms.iFalloff, opts.falloff);
    gl.uniform1f(uniforms.iOpacity, opts.opacity);

    return {
      canvas: canvas,
      gl: gl,
      program: program,
      uniforms: uniforms,
      setOrigin: function (origin) {
        var nextFlip = originToFlip(origin);
        gl.useProgram(program);
        gl.uniform1f(uniforms.iFlipX, nextFlip[0]);
        gl.uniform1f(uniforms.iFlipY, nextFlip[1]);
      },
      updateSize: function () {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = container.clientWidth;
        var h = container.clientHeight;
        if (!w || !h) return;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
      },
      draw: function (t) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uniforms.iTime, t);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    };
  }

  var layers = sideRaysOrigins(sideRaysIsRtl()).map(function (origin) {
    return createLayer(Object.assign({}, baseOpts, { origin: origin }));
  }).filter(Boolean);

  if (!layers.length) return;

  function syncSideRaysOrigins() {
    sideRaysOrigins(sideRaysIsRtl()).forEach(function (origin, i) {
      if (layers[i]) layers[i].setOrigin(origin);
    });
  }
  window._syncSideRaysOrigins = syncSideRaysOrigins;

  var animId = null;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateSize() {
    layers.forEach(function (layer) { layer.updateSize(); });
  }

  function drawAll(t) {
    var timeVal = reducedMotion ? 0 : t * 0.001;
    layers.forEach(function (layer) { layer.draw(timeVal); });
  }

  function loop(t) {
    drawAll(t);
    animId = requestAnimationFrame(loop);
  }

  updateSize();
  drawAll(0);
  if (!reducedMotion) animId = requestAnimationFrame(loop);

  window.addEventListener('resize', updateSize);
  window.addEventListener('pagehide', function () {
    if (animId) cancelAnimationFrame(animId);
  });
})();

/*
 * GlassSurface — vanilla-JS port of the React Bits component.
 * Builds a glassy, SVG-displacement surface as a DOM element.
 *
 * Usage:
 *   const el = createGlassSurface({ width: 120, height: 120, borderRadius: 60 });
 *   document.body.appendChild(el);
 *
 * The bottom of this file wires a single GlassSurface into the bottom navbar as
 * `window.GlassNavPill`: it mirrors the yellow active-tab indicator and lets the
 * active pill "pop" into liquid glass while it moves (drag / tab switch), then
 * settle back to yellow. Driven from js/app_screens.js.
 */

// GLOBAL NAVBAR GLASS CONFIGURATION (For easy editing)
window.GLASS_NAV_CONFIG = {
  scaleX: 1.3,
  scaleY: 1.6,
  navBarScale: 1.025,
  borderWidth: 0.11,
  brightness: 50,
  opacity: 0.1,
  blur: 11,
  displace: 0,
  backgroundOpacity: 0,
  saturation: 1.1,
  distortionScale: 80,
  redOffset: 0,
  greenOffset: 70,
  blueOffset: 100,
  mixBlendMode: 'difference'
};

document.documentElement.style.setProperty(
  '--nav-bar-drag-scale',
  String(window.GLASS_NAV_CONFIG.navBarScale)
);

(function (global) {
  'use strict';

  const SVGNS = 'http://www.w3.org/2000/svg';
  let uid = 0;

  function supportsSVGFilters(filterId) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    if (isWebkit || isFirefox) return false;
    const div = document.createElement('div');
    div.style.backdropFilter = `url(#${filterId})`;
    return div.style.backdropFilter !== '';
  }

  function createGlassSurface(opts) {
    const o = Object.assign(
      {
        width: 200,
        height: 80,
        borderRadius: 20,
        borderWidth: 0.07,
        brightness: 50,
        opacity: 0.93,
        blur: 5,
        displace: 0,
        backgroundOpacity: 0,
        saturation: 1,
        distortionScale: -180,
        redOffset: 0,
        greenOffset: 10,
        blueOffset: 20,
        xChannel: 'R',
        yChannel: 'G',
        mixBlendMode: 'difference',
        className: '',
        content: '',
        style: {}
      },
      opts || {}
    );

    const unique = `gs-${++uid}`;
    const filterId = `glass-filter-${unique}`;

    const container = document.createElement('div');
    container.opts = o;
    const svgOk = supportsSVGFilters(filterId);
    container.className =
      `glass-surface ${svgOk ? 'glass-surface--svg' : 'glass-surface--fallback'} ${o.className}`.trim();

    // ----- container style -----
    Object.assign(container.style, o.style);
    container.style.width = typeof o.width === 'number' ? `${o.width}px` : o.width;
    container.style.height = typeof o.height === 'number' ? `${o.height}px` : o.height;
    container.style.borderRadius = `${o.borderRadius}px`;
    container.style.setProperty('--glass-frost', o.backgroundOpacity);
    container.style.setProperty('--glass-saturation', o.saturation);
    container.style.setProperty('--filter-id', `url(#${filterId})`);

    // ----- SVG filter definition -----
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'glass-surface__filter');
    svg.setAttribute('xmlns', SVGNS);

    const defs = document.createElementNS(SVGNS, 'defs');
    const filter = document.createElementNS(SVGNS, 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    filter.setAttribute('x', '0%');
    filter.setAttribute('y', '0%');
    filter.setAttribute('width', '100%');
    filter.setAttribute('height', '100%');

    const feImage = document.createElementNS(SVGNS, 'feImage');
    feImage.setAttribute('x', '0');
    feImage.setAttribute('y', '0');
    feImage.setAttribute('width', '100%');
    feImage.setAttribute('height', '100%');
    feImage.setAttribute('preserveAspectRatio', 'none');
    feImage.setAttribute('result', 'map');

    function dispMap(id, result) {
      const m = document.createElementNS(SVGNS, 'feDisplacementMap');
      m.setAttribute('in', 'SourceGraphic');
      m.setAttribute('in2', 'map');
      m.setAttribute('id', id);
      m.setAttribute('result', result);
      return m;
    }
    function colorMatrix(inName, values, result) {
      const cm = document.createElementNS(SVGNS, 'feColorMatrix');
      cm.setAttribute('in', inName);
      cm.setAttribute('type', 'matrix');
      cm.setAttribute('values', values);
      cm.setAttribute('result', result);
      return cm;
    }
    function blend(inName, in2, mode, result) {
      const b = document.createElementNS(SVGNS, 'feBlend');
      b.setAttribute('in', inName);
      b.setAttribute('in2', in2);
      b.setAttribute('mode', mode);
      b.setAttribute('result', result);
      return b;
    }

    const redChannel = dispMap('redchannel', 'dispRed');
    const redMatrix = colorMatrix('dispRed', '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', 'red');
    const greenChannel = dispMap('greenchannel', 'dispGreen');
    const greenMatrix = colorMatrix('dispGreen', '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0', 'green');
    const blueChannel = dispMap('bluechannel', 'dispBlue');
    const blueMatrix = colorMatrix('dispBlue', '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0', 'blue');
    const blendRG = blend('red', 'green', 'screen', 'rg');
    const blendRGB = blend('rg', 'blue', 'screen', 'output');
    const gaussian = document.createElementNS(SVGNS, 'feGaussianBlur');
    gaussian.setAttribute('in', 'output');
    gaussian.setAttribute('stdDeviation', '0.7');

    filter.append(
      feImage,
      redChannel,
      redMatrix,
      greenChannel,
      greenMatrix,
      blueChannel,
      blueMatrix,
      blendRG,
      blendRGB,
      gaussian
    );
    defs.appendChild(filter);
    svg.appendChild(defs);

    const contentEl = document.createElement('div');
    contentEl.className = 'glass-surface__content';
    if (typeof o.content === 'string') contentEl.innerHTML = o.content;
    else if (o.content instanceof Node) contentEl.appendChild(o.content);

    container.appendChild(svg);
    container.appendChild(contentEl);

    // ----- displacement map generation -----
    function generateDisplacementMap() {
      // Use the UNSCALED layout box (offsetWidth/Height), not getBoundingClientRect,
      // so a live CSS `scale` transform (the morph) doesn't distort the map and make
      // the glass "flip" once the scale settles.
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(container.offsetWidth || rect.width || 400));
      const h = Math.max(1, Math.round(container.offsetHeight || rect.height || 200));
      const edge = Math.min(w, h) * (o.borderWidth * 0.5);

      // Dynamically extract the current border-radius to keep SVG shape aligned with CSS borders
      const brVal = parseFloat(container.style.borderRadius);
      const br = !isNaN(brVal) ? brVal : o.borderRadius;
      const brInner = Math.max(0, br - edge);

      // Canvas lens map: calm center + rim that stretches outward (convex bulge at the
      // pill edge) instead of pinching inward. Vertical emphasis at top/bottom caps.
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      const img = ctx.createImageData(w, h);
      const px = img.data;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const lensK = o.distortionScale * 0.35;
      const rim = Math.max(edge * 3, Math.min(w, h) * 0.14, 8);
      const edgeBoost = 1.45;

      for (let y = 0; y < h; y++) {
        const ry = (y - cy) / cy;
        for (let x = 0; x < w; x++) {
          const rx = (x - cx) / cx;
          const rx2 = rx * rx;
          const ry2 = ry * ry;
          const r2 = rx2 + ry2;
          const i = (y * w + x) * 4;

          // 0 in the deep center → 1 on the pill boundary (top/bottom/left/right).
          const distX = Math.min(x, w - 1 - x);
          const distY = Math.min(y, h - 1 - y);
          const edgeProx = 1 - Math.min(1, Math.min(distX, distY) / rim);
          const edgeProxCurve = edgeProx * edgeProx;
          const centerWeight = 1 - edgeProxCurve;

          // Glossy barrel in the middle (unchanged feel from distortionScale).
          let dx = rx * r2 * lensK * centerWeight;
          let dy = ry * r2 * lensK * centerWeight;

          // Rim: signed lensK so negative distortionScale inverts the edge stretch too.
          const radialLen = Math.sqrt(r2) || 1;
          const ux = rx / radialLen;
          const uy = ry / radialLen;
          const rimK = lensK * edgeBoost;
          dx += -ux * edgeProxCurve * rimK;
          dy += -uy * edgeProxCurve * rimK;

          px[i] = 128 + Math.max(-127, Math.min(127, dx));
          px[i + 1] = 128 + Math.max(-127, Math.min(127, dy));
          px[i + 2] = 128;
          px[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);

      // Clip to the outer pill/rounded rect.
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(0, 0, w, h, br);
      } else {
        ctx.moveTo(br, 0);
        ctx.lineTo(w - br, 0);
        ctx.quadraticCurveTo(w, 0, w, br);
        ctx.lineTo(w, h - br);
        ctx.quadraticCurveTo(w, h, w - br, h);
        ctx.lineTo(br, h);
        ctx.quadraticCurveTo(0, h, 0, h - br);
        ctx.lineTo(0, br);
        ctx.quadraticCurveTo(0, 0, br, 0);
        ctx.closePath();
      }
      ctx.fill();

      // Inner frosted body — clipped so blur can't wash out the rim displacement.
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = `blur(${o.blur}px)`;
      ctx.fillStyle = `hsla(0, 0%, ${o.brightness}%, ${o.opacity})`;
      ctx.beginPath();
      const ix = edge;
      const iy = edge;
      const iw = w - edge * 2;
      const ih = h - edge * 2;
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(ix, iy, iw, ih, brInner);
      } else {
        ctx.moveTo(ix + brInner, iy);
        ctx.lineTo(ix + iw - brInner, iy);
        ctx.quadraticCurveTo(ix + iw, iy, ix + iw, iy + brInner);
        ctx.lineTo(ix + iw, iy + ih - brInner);
        ctx.quadraticCurveTo(ix + iw, iy + ih, ix + iw - brInner, iy + ih);
        ctx.lineTo(ix + brInner, iy + ih);
        ctx.quadraticCurveTo(ix, iy + ih, ix, iy + ih - brInner);
        ctx.lineTo(ix, iy + brInner);
        ctx.quadraticCurveTo(ix, iy, ix + brInner, iy);
        ctx.closePath();
      }
      ctx.save();
      ctx.clip();
      ctx.fill();
      ctx.restore();
      ctx.filter = 'none';

      return canvas.toDataURL('image/png');
    }

    function updateDisplacementMap() {
      // Sync dynamic settings that could affect CSS custom properties
      container.style.setProperty('--glass-frost', o.backgroundOpacity);
      container.style.setProperty('--glass-saturation', o.saturation);

      feImage.setAttribute('href', generateDisplacementMap());
      // Direction lives in the map (signed lensK); filter scale is magnitude only so
      // negative distortionScale doesn't double-invert with feDisplacementMap.
      const dispMag = Math.abs(o.distortionScale);
      [
        [redChannel, o.redOffset],
        [greenChannel, o.greenOffset],
        [blueChannel, o.blueOffset]
      ].forEach(([ref, offset]) => {
        ref.setAttribute('scale', String(dispMag + offset));
        ref.setAttribute('xChannelSelector', o.xChannel);
        ref.setAttribute('yChannelSelector', o.yChannel);
      });
      gaussian.setAttribute('stdDeviation', String(o.displace));
    }

    // initial paint + keep map in sync with size changes
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => setTimeout(updateDisplacementMap, 0));
      ro.observe(container);
    }
    requestAnimationFrame(updateDisplacementMap);

    container._glassUpdate = updateDisplacementMap;
    return container;
  }

  // Note: GLASS_NAV_CONFIG is now defined globally at the top of this file.

  // ---------------------------------------------------------------------------
  // Navbar liquid-glass pill.
  //
  // A single GlassSurface lives inside `.bottom-tabs-inner`, sitting exactly over
  // the yellow active indicator (concentric) but scaled up by scaleX / scaleY.
  // It is invisible at rest. While the indicator is moving (drag or tab switch)
  // the yellow indicator grows + fades out and this glass fades in, so the active
  // pill looks like it pops out into liquid glass, then settles back to yellow.
  //
  // The yellow content (the gold icon/label overlay, masked to the pill) is NOT
  // touched here — that masking logic stays exactly as it was.
  // ---------------------------------------------------------------------------
  const GlassNavPill = (function () {
    let el = null;
    let curW = 0;
    let curH = 0;
    let settleTimer = null;

    function modalDurMs() {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--modal-dur').trim();
      if (v.endsWith('ms')) return parseFloat(v) || 400;
      if (v.endsWith('s')) return (parseFloat(v) || 0.4) * 1000;
      return 400;
    }

    function ensure() {
      if (el) return el;
      const inner = document.querySelector('.bottom-tabs-inner');
      if (!inner) return null;
      const c = global.GLASS_NAV_CONFIG;
      el = createGlassSurface({
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: c.borderWidth,
        brightness: c.brightness,
        opacity: c.opacity,
        blur: c.blur,
        displace: c.displace,
        backgroundOpacity: c.backgroundOpacity,
        saturation: c.saturation,
        distortionScale: c.distortionScale,
        redOffset: c.redOffset,
        greenOffset: c.greenOffset,
        blueOffset: c.blueOffset,
        mixBlendMode: c.mixBlendMode,
        className: 'glass-nav-pill',
        content: ''
      });
      // Share the scale with the CSS that grows the yellow indicator.
      inner.style.setProperty('--nav-glass-scale-x', String(c.scaleX));
      inner.style.setProperty('--nav-glass-scale-y', String(c.scaleY));
      // Rest scale = pill-sized (so it can morph up to full size when activated).
      el.style.setProperty('--g-rest-sx', String(1 / c.scaleX));
      el.style.setProperty('--g-rest-sy', String(1 / c.scaleY));
      // IMPORTANT: mount on <body>, NOT inside the navbar. The navbar is itself a
      // glass element (its own backdrop-filter + dark fill + isolation), so a
      // nested backdrop-filter would sample that dark layer and render black.
      // On the body it samples the page behind it — exactly like the preview that
      // looked correct — preserving the tuned glossy look.
      document.body.appendChild(el);
      return el;
    }

    // Size + position the glass (full-size box) concentric with the pill rect.
    // Position uses the independent `translate` property so the `scale` property
    // (the size morph) can transition on its own — even while the position is
    // locked to the finger during a drag.
    function place(pillLeftVP, pillTopVP, pillW, pillH) {
      const g = ensure();
      if (!g) return;
      const gw = pillW * global.GLASS_NAV_CONFIG.scaleX;
      const gh = pillH * global.GLASS_NAV_CONFIG.scaleY;
      const gl = pillLeftVP - (gw - pillW) / 2;
      const gt = pillTopVP - (gh - pillH) / 2;
      if (Math.abs(gw - curW) > 0.5 || Math.abs(gh - curH) > 0.5) {
        curW = gw;
        curH = gh;
        g.style.width = `${gw}px`;
        g.style.height = `${gh}px`;
        g.style.borderRadius = `${gh / 2}px`;
        if (g._glassUpdate) g._glassUpdate();
      }
      g.style.translate = `${gl}px ${gt}px`;
    }

    function updateConfig() {
      const g = ensure();
      if (!g) return;
      const c = global.GLASS_NAV_CONFIG;
      Object.assign(g.opts, c);

      const inner = document.querySelector('.bottom-tabs-inner');
      if (inner) {
        inner.style.setProperty('--nav-glass-scale-x', String(c.scaleX));
        inner.style.setProperty('--nav-glass-scale-y', String(c.scaleY));
      }
      if (c.navBarScale != null && isFinite(c.navBarScale)) {
        document.documentElement.style.setProperty('--nav-bar-drag-scale', String(c.navBarScale));
      }
      g.style.setProperty('--g-rest-sx', String(1 / c.scaleX));
      g.style.setProperty('--g-rest-sy', String(1 / c.scaleY));

      syncToIndicator();
      if (g._glassUpdate) g._glassUpdate();
    }

    // Navbar morph scale must not affect the body-mounted glass pill size/position.
    function navBarMorphScale(inner) {
      if (!inner || !inner.classList.contains('nav-glass-morph')) return 1;
      const s = parseFloat(getComputedStyle(inner).scale);
      return isFinite(s) && s > 0 ? s : 1;
    }

    function layoutPillToViewport(inner, pillLeft, pillTop) {
      const ir = inner.getBoundingClientRect();
      const navScale = navBarMorphScale(inner);
      if (navScale === 1) {
        return {
          left: ir.left + inner.clientLeft + pillLeft,
          top: ir.top + inner.clientTop + pillTop
        };
      }
      // Bar scales from its center — map layout pill coords to the unscaled box.
      const layoutW = inner.offsetWidth;
      const layoutH = inner.offsetHeight;
      const originX = ir.left + ir.width / 2;
      const originY = ir.top + ir.height / 2;
      const unscaledLeft = originX - layoutW / 2;
      const unscaledTop = originY - layoutH / 2;
      return {
        left: unscaledLeft + inner.clientLeft + pillLeft,
        top: unscaledTop + inner.clientTop + pillTop
      };
    }

    // Mirror the yellow indicator using layout coords — glass stays unscaled while the bar grows.
    function sync(pillLeft, pillTop, pillW, pillH) {
      const inner = document.querySelector('.bottom-tabs-inner');
      if (!inner) return;
      const vp = layoutPillToViewport(inner, pillLeft, pillTop);
      place(vp.left, vp.top, pillW, pillH);
    }

    // Position the glass straight from the indicator's layout box (not viewport rect).
    function syncToIndicator() {
      const ind = document.getElementById('bottom-tab-indicator');
      if (!ind) return;
      const w = ind.offsetWidth;
      const h = ind.offsetHeight;
      if (w < 1 || h < 1) return;
      const parts = (ind.style.translate || '0px 0px').trim().split(/\s+/);
      const pillLeft = parseFloat(parts[0]) || 0;
      const pillTop = parseFloat(parts[1]) || 0;
      sync(pillLeft, pillTop, w, h);
    }

    // Start of a move: reveal the glass and morph it up to full size (yellow fades
    // out + grows, glass fades in + grows). `instant` (drag) locks the POSITION to
    // the finger (no translate transition) while the size still morphs smoothly.
    function beginMove(instant) {
      const g = ensure();
      if (!g) return;
      if (settleTimer) {
        clearTimeout(settleTimer);
        settleTimer = null;
      }
      // Place the glass on the current pill INSTANTLY (is-instant disables the
      // position transition) so the first reveal never slides in from the corner.
      g.classList.add('is-instant');
      syncToIndicator();
      void g.offsetWidth; // commit the position without animating
      // Regenerate the displacement map now (and once more next frame) so the very
      // first reveal isn't blank — backdrop-filter can need a repaint to kick in.
      if (g._glassUpdate) {
        g._glassUpdate();
        requestAnimationFrame(function () {
          if (g._glassUpdate) g._glassUpdate();
        });
      }
      // Keep position finger-locked for a drag; allow it to glide for a tap switch.
      g.classList.toggle('is-instant', !!instant);
      g.classList.add('is-active');
      const inner = document.querySelector('.bottom-tabs-inner');
      if (inner) inner.classList.add('nav-glass-morph');
    }

    function doSettle() {
      if (!el) return;
      el.classList.remove('is-instant');
      el.classList.remove('is-active');
      const inner = document.querySelector('.bottom-tabs-inner');
      if (inner) inner.classList.remove('nav-glass-morph');
    }

    // End of a DRAG: morph back to yellow in a SINGLE motion — from this moment the
    // glass slides to its final spot while simultaneously scaling + fading back
    // (no two-step "travel then shrink"). The CSS transitions handle the blend.
    function settle() {
      if (settleTimer) {
        clearTimeout(settleTimer);
        settleTimer = null;
      }
      doSettle();
    }

    // End of a TAP / programmatic switch: keep the glass visible while the pill
    // slides to the new tab, then cross-fade it back to yellow once it arrives.
    function settleOnArrival() {
      if (!el) return;
      el.classList.remove('is-instant'); // smooth travel (not finger-locked)
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(function () {
        settleTimer = null;
        doSettle();
      }, modalDurMs());
    }

    // Lightweight "unlock position so it can glide" — used when the glass is
    // already showing (drag drop / tab switch). Avoids the heavy reflow + map
    // regeneration of beginMove(), which caused a hiccup on drop.
    function releaseInstant() {
      if (el) el.classList.remove('is-instant');
    }

    function isActive() {
      return !!(el && el.classList.contains('is-active'));
    }

    return { ensure, sync, beginMove, releaseInstant, settle, settleOnArrival, isActive, updateConfig };
  })();

  // export
  global.createGlassSurface = createGlassSurface;
  global.GlassNavPill = GlassNavPill;
})(window);

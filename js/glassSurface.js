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
    const redGradId = `red-grad-${unique}`;
    const blueGradId = `blue-grad-${unique}`;

    const container = document.createElement('div');
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
      const w = container.offsetWidth || rect.width || 400;
      const h = container.offsetHeight || rect.height || 200;
      const edge = Math.min(w, h) * (o.borderWidth * 0.5);
      const svgContent = `
        <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="red"/>
            </linearGradient>
            <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="blue"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="${w}" height="${h}" fill="black"></rect>
          <rect x="0" y="0" width="${w}" height="${h}" rx="${o.borderRadius}" fill="url(#${redGradId})" />
          <rect x="0" y="0" width="${w}" height="${h}" rx="${o.borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${o.mixBlendMode}" />
          <rect x="${edge}" y="${edge}" width="${w - edge * 2}" height="${h - edge * 2}" rx="${o.borderRadius}" fill="hsl(0 0% ${o.brightness}% / ${o.opacity})" style="filter:blur(${o.blur}px)" />
        </svg>`;
      return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
    }

    function updateDisplacementMap() {
      feImage.setAttribute('href', generateDisplacementMap());
      [
        [redChannel, o.redOffset],
        [greenChannel, o.greenOffset],
        [blueChannel, o.blueOffset]
      ].forEach(([ref, offset]) => {
        ref.setAttribute('scale', String(o.distortionScale + offset));
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

  // ===========================================================================
  // GLOSSY / GLASS EFFECTS — settings for the navbar active pill.
  // scaleX / scaleY = how much bigger the liquid-glass pill is than the yellow
  // indicator while it is "popped out" and moving. 1 = same size as the pill.
  // Adjust width (X) and height (Y) independently.
  // ===========================================================================
  const GLASS_NAV_CONFIG = {
    scaleX: 1.15, // <-- horizontal size of the glass pill (1 = same width)
    scaleY: 1.45, // <-- vertical size of the glass pill (1 = same height)

    // --- glossy / glass effect settings ---
    borderWidth: 0.2,
    brightness: 50,
    opacity: 1,
    blur: 8,
    displace: 0.2,
    backgroundOpacity: 0,
    saturation: 1,
    distortionScale: -250,
    redOffset: -16,
    greenOffset: 15,
    blueOffset: 10,
    mixBlendMode: 'difference'
  };

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
      const c = GLASS_NAV_CONFIG;
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
      const gw = pillW * GLASS_NAV_CONFIG.scaleX;
      const gh = pillH * GLASS_NAV_CONFIG.scaleY;
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

    // Mirror the yellow indicator. pillLeft/pillTop are offsets inside
    // .bottom-tabs-inner; convert to viewport coordinates for the fixed glass.
    function sync(pillLeft, pillTop, pillW, pillH) {
      const inner = document.querySelector('.bottom-tabs-inner');
      if (!inner) return;
      const ir = inner.getBoundingClientRect();
      place(ir.left + inner.clientLeft + pillLeft, ir.top + inner.clientTop + pillTop, pillW, pillH);
    }

    // Position the glass straight from the indicator's current on-screen rect.
    // Used on reveal so the very first show isn't mis-placed (and never "blank"
    // off in a corner) before any move has happened.
    function syncToIndicator() {
      const ind = document.getElementById('bottom-tab-indicator');
      if (!ind) return;
      const r = ind.getBoundingClientRect();
      // Use the indicator's LAYOUT size (offsetWidth/Height, unaffected by its scale
      // morph) so it matches the size sync() uses during a drag — otherwise the glass
      // is sized slightly differently on press vs. first move and visibly snaps.
      const w = ind.offsetWidth || r.width;
      const h = ind.offsetHeight || r.height;
      if (w < 1 || h < 1) return;
      place(r.left, r.top, w, h);
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

    return { ensure, sync, beginMove, releaseInstant, settle, settleOnArrival, isActive };
  })();

  // export
  global.createGlassSurface = createGlassSurface;
  global.GlassNavPill = GlassNavPill;
})(window);

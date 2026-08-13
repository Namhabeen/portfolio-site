/**
 * @typedef {object} BrandColors
 * @property {string} brand - Base brand color (as given, normalized to `#rrggbb`).
 * @property {string} brandHover - Darker variant for hover states on `brand`-colored elements.
 * @property {string} brandLight - Very light tint for light-mode backgrounds (badges, tags).
 * @property {string} brandDark - Brightened (and, if needed, desaturated) variant for use as
 *   accent text/elements against a dark page background.
 * @property {string} brandTintDark - Translucent `brand` color for dark-mode tag/badge backgrounds.
 * @property {string} brandTextOn - `#ffffff` or a near-black, whichever contrasts better on `brand`.
 */

function normalizeHex(hex) {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return h.toLowerCase();
}

function isValidHex(h) {
  return /^[0-9a-f]{6}$/.test(h);
}

function hexToRgb(hex) {
  const h = normalizeHex(hex);
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rgbToHex(r, g, b) {
  const c = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;

  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: hue2rgb(p, q, h + 1 / 3) * 255,
    g: hue2rgb(p, q, h) * 255,
    b: hue2rgb(p, q, h - 1 / 3) * 255,
  };
}

function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// WCAG relative luminance (https://www.w3.org/TR/WCAG21/#dfn-relative-luminance)
function relativeLuminance({ r, g, b }) {
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(lumA, lumB) {
  const [lighter, darker] = lumA > lumB ? [lumA, lumB] : [lumB, lumA];
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Picks whichever of white or near-black contrasts better against `hex`,
 * so text placed on a `hex`-colored background stays legible regardless of
 * how light or dark that color is (e.g. a bright yellow CI color needs
 * dark text, not the white that works for most brand colors).
 *
 * @param {string} hex - Background color as `#rgb` or `#rrggbb`.
 * @returns {string} `#ffffff` or `#141414`.
 */
export function getTextColorForBackground(hex) {
  const lum = relativeLuminance(hexToRgb(hex));
  const white = 1; // relative luminance of #ffffff
  const black = 0; // relative luminance of #000000
  const contrastWithWhite = contrastRatio(lum, white);
  const contrastWithBlack = contrastRatio(lum, black);
  return contrastWithWhite >= contrastWithBlack ? '#ffffff' : '#141414';
}

/**
 * Derives every color variant the site needs from a single company CI
 * color, via HSL adjustments so each variant stays a recognizable shade of
 * the same hue rather than an arbitrary different color.
 *
 * @param {string | null | undefined} hex - Company CI color as a hex string
 *   (e.g. `"#E4002B"`), or a falsy value.
 * @returns {BrandColors | null} The derived variants, or `null` if `hex` is
 *   missing or not a valid hex color (the caller should fall back to the
 *   default theme in that case).
 */
export function getBrandColors(hex) {
  if (!hex || typeof hex !== 'string') return null;
  const normalized = normalizeHex(hex);
  if (!isValidHex(normalized)) return null;

  const rgb = hexToRgb(normalized);
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const brand = `#${normalized}`;
  const brandHover = hslToHex(h, s, clamp(l - 12, 10, 95));
  const brandLight = hslToHex(h, clamp(s * 0.85, 0, 100), 95);

  // Brighten (and, for very saturated colors, gently desaturate) so the
  // color still reads clearly as an accent against a near-black page.
  const darkL = clamp(l < 55 ? l + (55 - l) * 0.7 : l, 55, 75);
  const darkS = s > 70 ? s * 0.85 : s;
  const brandDark = hslToHex(h, darkS, darkL);

  const brandTintDark = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`;
  const brandTextOn = getTextColorForBackground(brand);

  return { brand, brandHover, brandLight, brandDark, brandTintDark, brandTextOn };
}

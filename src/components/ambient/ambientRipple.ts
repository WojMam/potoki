export const AMBIENT_RIPPLE_BLOCK_SELECTOR =
  '[data-no-ambient-ripple], button, a, input, textarea, select, label, [contenteditable="true"], [role="dialog"], [role="menuitem"]';

export function shouldBlockAmbientRipple(target: EventTarget | null) {
  if (!(target instanceof Element)) return true;
  return Boolean(target.closest(AMBIENT_RIPPLE_BLOCK_SELECTOR));
}

export type RippleRing = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  lineWidth: number;
};

export function createRipple(x: number, y: number, width: number, height: number): RippleRing[] {
  const span = Math.min(width, height);
  const maxRadius = Math.min(span * 0.22, 220);
  return [
    { x, y, radius: 0, maxRadius, alpha: 0.065, lineWidth: 1.1 },
    { x, y, radius: 0, maxRadius: maxRadius * 0.72, alpha: 0.04, lineWidth: 0.85 },
  ];
}

export function advanceRipples(rings: RippleRing[], deltaMs: number) {
  const speed = 0.09;
  let alive = false;

  for (const ring of rings) {
    ring.radius += (ring.maxRadius - ring.radius) * speed * (deltaMs / 16);
    ring.alpha *= 0.992;
    if (ring.alpha > 0.008 && ring.radius < ring.maxRadius * 0.98) {
      alive = true;
    }
  }

  return alive;
}

export function drawRipples(ctx: CanvasRenderingContext2D, rings: RippleRing[]) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const ring of rings) {
    if (ring.alpha <= 0.008) continue;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(118, 210, 220, ${ring.alpha})`;
    ctx.lineWidth = ring.lineWidth;
    ctx.stroke();
  }
}

/**
 * SPZ-Lib UI — Skill Check
 * SVG-based rotating arc minigame. Chained multi-key challenges.
 */

import { fetchNUI } from './index';

export type Difficulty = 'easy' | 'medium' | 'hard' | { areaSize: number; speedMultiplier: number };

export interface SkillCheckOptions {
  difficulty: Difficulty | Difficulty[];
  inputs?:    string[];  // key codes e.g. ['KeyE', 'KeyQ']
}

const PRESETS: Record<string, { areaSize: number; speedMultiplier: number }> = {
  easy:   { areaSize: 50, speedMultiplier: 1.0 },
  medium: { areaSize: 40, speedMultiplier: 1.5 },
  hard:   { areaSize: 25, speedMultiplier: 1.75 },
};

const R       = 60;   // SVG circle radius
const CX = CY = 80;   // SVG center
const CIRC    = 2 * Math.PI * R;

export class SkillCheck {
  private el:       HTMLElement;
  private svg:      SVGElement | null = null;
  private arc:      SVGCircleElement | null = null;
  private zone:     SVGPathElement | null = null;
  private label:    HTMLElement | null = null;

  private rafId:    number = 0;
  private angle:    number = 0;    // current indicator angle in degrees
  private speed:    number = 2;    // degrees per frame
  private zoneStart: number = 0;
  private zoneSize:  number = 50;
  private inputs:   string[] = ['KeyE'];
  private queue:    ReturnType<typeof this.resolvePreset>[] = [];
  private handler:  ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    this.el = document.getElementById('spz-skillcheck')!;
  }

  start(opts: SkillCheckOptions): void {
    const difficulties = Array.isArray(opts.difficulty)
      ? opts.difficulty : [opts.difficulty];

    this.queue  = difficulties.map(d => this.resolvePreset(d));
    this.inputs = opts.inputs ?? ['KeyE'];

    this.nextChallenge();
  }

  private resolvePreset(d: Difficulty) {
    return typeof d === 'string' ? PRESETS[d] : d;
  }

  private nextChallenge(): void {
    if (!this.queue.length) { this.finish(true); return; }
    const preset = this.queue.shift()!;

    this.angle     = 0;
    this.speed     = preset.speedMultiplier * 2.5;
    this.zoneSize  = preset.areaSize;
    this.zoneStart = 20 + Math.random() * (320 - preset.areaSize);

    this.render();
    this.el.classList.add('spz-skillcheck--visible');

    this.bindKey();
    this.loop();
  }

  private render(): void {
    const keyLabel = this.inputs.map(k => k.replace('Key', '')).join(' / ');

    this.el.innerHTML = `
      <div class="spz-skillcheck__wrap">
        <svg viewBox="0 0 160 160" class="spz-skillcheck__svg" id="spz-sc-svg">
          <!-- Track -->
          <circle class="spz-sc-track" cx="${CX}" cy="${CY}" r="${R}"/>
          <!-- Hit zone (arc painted as path) -->
          <path class="spz-sc-zone" id="spz-sc-zone"/>
          <!-- Indicator needle -->
          <line class="spz-sc-needle" id="spz-sc-needle"
                x1="${CX}" y1="${CY}"
                x2="${CX}" y2="${CY - R + 4}"
                transform="rotate(0, ${CX}, ${CY})"/>
        </svg>
        <div class="spz-skillcheck__key">${keyLabel}</div>
      </div>
    `;

    this.arc    = null;
    this.svg    = document.getElementById('spz-sc-svg') as SVGElement;
    this.label  = this.el.querySelector('.spz-skillcheck__key');
    this.updateZone();
  }

  private updateZone(): void {
    const zone = document.getElementById('spz-sc-zone') as SVGPathElement | null;
    if (!zone) return;

    const startRad = (this.zoneStart - 90) * Math.PI / 180;
    const endRad   = (this.zoneStart + this.zoneSize - 90) * Math.PI / 180;
    const x1 = CX + R * Math.cos(startRad);
    const y1 = CY + R * Math.sin(startRad);
    const x2 = CX + R * Math.cos(endRad);
    const y2 = CY + R * Math.sin(endRad);
    const large = this.zoneSize > 180 ? 1 : 0;

    zone.setAttribute('d',
      `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`);
    zone.setAttribute('stroke-width', '8');
    zone.setAttribute('fill', 'none');
  }

  private loop(): void {
    this.angle = (this.angle + this.speed) % 360;

    const needle = document.getElementById('spz-sc-needle');
    needle?.setAttribute('transform', `rotate(${this.angle}, ${CX}, ${CY})`);

    this.rafId = requestAnimationFrame(() => this.loop());
  }

  private bindKey(): void {
    this.handler = (e: KeyboardEvent) => {
      if (!this.inputs.includes(e.code)) return;
      cancelAnimationFrame(this.rafId);
      window.removeEventListener('keydown', this.handler!);
      this.handler = null;

      const inZone = this.angle >= this.zoneStart
        && this.angle <= this.zoneStart + this.zoneSize;

      if (inZone) {
        this.flashResult(true);
        setTimeout(() => this.nextChallenge(), 300);
      } else {
        this.flashResult(false);
        setTimeout(() => this.finish(false), 400);
      }
    };
    window.addEventListener('keydown', this.handler);
  }

  private flashResult(success: boolean): void {
    const needle = document.getElementById('spz-sc-needle');
    if (needle) needle.setAttribute('stroke', success ? '#22c55e' : '#ef4444');
    const zone = document.getElementById('spz-sc-zone');
    if (zone) zone.setAttribute('stroke', success ? '#22c55e' : '#ef4444');
  }

  private finish(success: boolean): void {
    cancelAnimationFrame(this.rafId);
    if (this.handler) {
      window.removeEventListener('keydown', this.handler);
      this.handler = null;
    }
    this.el.classList.remove('spz-skillcheck--visible');
    this.el.innerHTML = '';
    fetchNUI('spz:skillcheck:result', { success });
  }

  cancel(): void {
    this.finish(false);
  }

  isActive(): boolean {
    return this.el.classList.contains('spz-skillcheck--visible');
  }
}

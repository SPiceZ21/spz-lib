/**
 * SPZ-Lib UI — Progress
 * Linear bar and circular progress with label, animations, cancellation.
 */

import { fetchNUI } from './index';

export interface ProgressOptions {
  duration:    number;
  label?:      string;
  type?:       'bar' | 'circle';
  canCancel?:  boolean;
  position?:   'middle' | 'bottom';
}

export class Progress {
  private el:       HTMLElement;
  private timer:    ReturnType<typeof setTimeout> | null = null;
  private startAt:  number = 0;
  private rafId:    number = 0;

  constructor() {
    this.el = document.getElementById('spz-progress')!;
  }

  show(opts: ProgressOptions): void {
    this.cancel(false);

    const type     = opts.type     ?? 'bar';
    const position = opts.position ?? 'bottom';

    this.el.className = `spz-progress spz-progress--${type} spz-progress--${position}`;
    this.el.innerHTML = type === 'circle'
      ? this.circleTemplate(opts)
      : this.barTemplate(opts);

    this.el.classList.add('spz-progress--visible');
    this.startAt = performance.now();
    this.tick(opts.duration);

    if (opts.canCancel) {
      this.bindCancel();
    }
  }

  private barTemplate(opts: ProgressOptions): string {
    return `
      <div class="spz-progress__bar-wrap">
        ${opts.label ? `<p class="spz-progress__label">${opts.label}</p>` : ''}
        <div class="spz-progress__track">
          <div class="spz-progress__fill" id="spz-prog-fill"></div>
        </div>
        ${opts.canCancel ? '<p class="spz-progress__cancel-hint">Press X to cancel</p>' : ''}
      </div>
    `;
  }

  private circleTemplate(opts: ProgressOptions): string {
    const r = 36;
    const circ = 2 * Math.PI * r;
    return `
      <div class="spz-progress__circle-wrap">
        <svg viewBox="0 0 88 88" class="spz-progress__svg">
          <circle class="spz-progress__svg-track" cx="44" cy="44" r="${r}"/>
          <circle class="spz-progress__svg-fill" id="spz-prog-fill"
            cx="44" cy="44" r="${r}"
            stroke-dasharray="${circ}"
            stroke-dashoffset="${circ}"
          />
        </svg>
        ${opts.label ? `<p class="spz-progress__label">${opts.label}</p>` : ''}
        ${opts.canCancel ? '<p class="spz-progress__cancel-hint">X to cancel</p>' : ''}
      </div>
    `;
  }

  private tick(duration: number): void {
    const fill = document.getElementById('spz-prog-fill');
    const isCircle = this.el.classList.contains('spz-progress--circle');
    const r    = 36;
    const circ = 2 * Math.PI * r;

    const update = () => {
      const elapsed = performance.now() - this.startAt;
      const pct     = Math.min(elapsed / duration, 1);

      if (fill) {
        if (isCircle) {
          (fill as SVGCircleElement).style.strokeDashoffset = String(circ * (1 - pct));
        } else {
          (fill as HTMLElement).style.width = `${pct * 100}%`;
        }
      }

      if (pct < 1) {
        this.rafId = requestAnimationFrame(update);
      }
    };

    this.rafId = requestAnimationFrame(update);
    this.timer = setTimeout(() => this.done(), duration);
  }

  private bindCancel(): void {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'KeyX') {
        window.removeEventListener('keydown', handler);
        this.cancel(true);
      }
    };
    window.addEventListener('keydown', handler);
  }

  private done(): void {
    this.cleanup();
    fetchNUI('spz:progress:done', { cancelled: false });
  }

  cancel(notify = true): void {
    if (!this.el.classList.contains('spz-progress--visible')) return;
    this.cleanup();
    if (notify) fetchNUI('spz:progress:done', { cancelled: true });
  }

  private cleanup(): void {
    cancelAnimationFrame(this.rafId);
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.el.classList.remove('spz-progress--visible');
  }

  isActive(): boolean {
    return this.el.classList.contains('spz-progress--visible');
  }
}

/**
 * SPZ-Lib UI — Notifications
 * Stacked toast notifications with type theming, icons, and auto-dismiss.
 */

export interface NotifyOptions {
  title?:         string;
  description?:   string;
  type?:          'info' | 'success' | 'warning' | 'error';
  duration?:      number;
  position?:      NotifyPosition;
  id?:            string;
  icon?:          string;
  iconColor?:     string;
}

type NotifyPosition =
  | 'top-right' | 'top-left' | 'top-center'
  | 'bottom-right' | 'bottom-left' | 'bottom-center';

const ACCENT: Record<string, string> = {
  info:    '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  error:   '#ef4444',
};

const ICON: Record<string, string> = {
  info:    '●',
  success: '✓',
  warning: '▲',
  error:   '✕',
};

const MAX_VISIBLE = 6;

export class Notifications {
  private containers = new Map<NotifyPosition, HTMLElement>();
  private active     = new Map<string, HTMLElement>();
  private counter    = 0;

  constructor() {
    this.getContainer('top-right'); // pre-warm default
  }

  private getContainer(pos: NotifyPosition): HTMLElement {
    if (this.containers.has(pos)) return this.containers.get(pos)!;

    const el = document.createElement('div');
    el.className = `spz-notif-stack spz-notif-stack--${pos}`;
    document.getElementById('spz-notifications')!.appendChild(el);
    this.containers.set(pos, el);
    return el;
  }

  show(opts: NotifyOptions): void {
    const type     = opts.type     ?? 'info';
    const duration = opts.duration ?? 4000;
    const pos      = (opts.position ?? 'top-right') as NotifyPosition;
    const id       = opts.id ?? `notif-${++this.counter}`;
    const color    = ACCENT[type];
    const icon     = opts.icon ?? ICON[type];

    // Deduplicate by id
    if (opts.id && this.active.has(id)) {
      this.dismiss(id, true);
    }

    const stack = this.getContainer(pos);

    // Prune oldest if over cap
    if (stack.childElementCount >= MAX_VISIBLE) {
      const oldest = stack.firstElementChild as HTMLElement;
      if (oldest?.dataset.id) this.dismiss(oldest.dataset.id, true);
    }

    const el = document.createElement('div');
    el.className  = 'spz-notif';
    el.dataset.id = id;
    el.style.setProperty('--accent', color);

    el.innerHTML = `
      <div class="spz-notif__icon" style="color:${opts.iconColor ?? color}">${icon}</div>
      <div class="spz-notif__body">
        ${opts.title       ? `<p class="spz-notif__title">${opts.title}</p>` : ''}
        ${opts.description ? `<p class="spz-notif__desc">${opts.description}</p>` : ''}
      </div>
      <div class="spz-notif__bar" style="animation-duration:${duration}ms"></div>
    `;

    el.addEventListener('click', () => this.dismiss(id));

    const isBottom = pos.startsWith('bottom');
    if (isBottom) stack.appendChild(el);
    else          stack.prepend(el);

    // Trigger enter animation next frame
    requestAnimationFrame(() => el.classList.add('spz-notif--visible'));

    this.active.set(id, el);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: string, immediate = false): void {
    const el = this.active.get(id);
    if (!el) return;

    this.active.delete(id);
    if (immediate) {
      el.remove();
      return;
    }

    el.classList.remove('spz-notif--visible');
    el.classList.add('spz-notif--leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 400);
  }
}

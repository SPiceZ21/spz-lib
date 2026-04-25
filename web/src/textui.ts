/**
 * SPZ-Lib UI — TextUI
 * Floating contextual prompt (key hint overlay).
 */

export interface TextUIOptions {
  position?:      'right-center' | 'left-center' | 'top-center' | 'bottom-center';
  icon?:          string;
  iconColor?:     string;
  align?:         'left' | 'center' | 'right';
  style?:         Partial<CSSStyleDeclaration>;
}

export class TextUI {
  private el:      HTMLElement;
  private visible: boolean = false;

  constructor() {
    this.el = document.getElementById('spz-textui')!;
  }

  show(opts: { text: string } & TextUIOptions): void {
    const pos   = opts.position ?? 'right-center';
    const icon  = opts.icon ?? '';
    const align = opts.align ?? 'left';

    this.el.className = `spz-textui spz-textui--${pos}`;
    this.el.style.textAlign = align;

    this.el.innerHTML = `
      ${icon ? `<span class="spz-textui__icon" style="color:${opts.iconColor ?? 'var(--spz-primary)'}">${icon}</span>` : ''}
      <span class="spz-textui__text">${opts.text}</span>
    `;

    // Apply custom style overrides
    if (opts.style) {
      Object.assign(this.el.style, opts.style);
    }

    if (!this.visible) {
      this.el.classList.add('spz-textui--visible');
      this.visible = true;
    }
  }

  hide(): void {
    this.el.classList.remove('spz-textui--visible');
    this.visible = false;
  }

  isOpen(): boolean {
    return this.visible;
  }
}

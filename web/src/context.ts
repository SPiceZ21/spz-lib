/**
 * SPZ-Lib UI — Context Menu
 * Positioned panel with icons, submenus, and metadata rows.
 */

import { fetchNUI } from './index';

export interface ContextItem {
  label:        string;
  description?: string;
  icon?:        string;
  iconColor?:   string;
  metadata?:    { label: string; value: string | number }[];
  progress?:    number;
  disabled?:    boolean;
  readOnly?:    boolean;
  close?:       boolean;
  args?:        unknown;
  menu?:        string;
  event?:       string;
  serverEvent?: string;
}

export interface ContextOptions {
  id:        string;
  title:     string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  canClose?: boolean;
  options:   ContextItem[];
}

export class Context {
  private el:       HTMLElement;
  private registry  = new Map<string, ContextOptions>();
  private stack:    string[] = [];

  constructor() {
    this.el = document.getElementById('spz-context')!;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.el.classList.contains('spz-ctx--visible')) {
        this.back();
      }
    });
  }

  register(data: ContextOptions): void {
    this.registry.set(data.id, data);
  }

  show(data: ContextOptions | { id: string }): void {
    if ('options' in data) this.registry.set(data.id, data as ContextOptions);
    this.stack = [data.id];
    this.render(data.id);
  }

  private render(id: string): void {
    const ctx = this.registry.get(id);
    if (!ctx) return;

    const pos = ctx.position ?? 'top-left';
    this.el.className = `spz-ctx spz-ctx--${pos}`;

    const backBtn = this.stack.length > 1
      ? `<button class="spz-ctx__back" id="spz-ctx-back">‹ Back</button>` : '';

    this.el.innerHTML = `
      <div class="spz-ctx__header">
        ${backBtn}
        <span class="spz-ctx__title">${ctx.title}</span>
        ${ctx.canClose !== false ? '<button class="spz-ctx__close" id="spz-ctx-close">✕</button>' : ''}
      </div>
      <div class="spz-ctx__list">
        ${ctx.options.map((o, i) => this.renderItem(o, i)).join('')}
      </div>
    `;

    this.el.querySelector('#spz-ctx-back')?.addEventListener('click', () => this.back());
    this.el.querySelector('#spz-ctx-close')?.addEventListener('click', () => this.exitAll());

    this.el.querySelectorAll<HTMLElement>('[data-ctx-idx]').forEach(row => {
      const i = parseInt(row.dataset.ctxIdx!);
      const o = ctx.options[i];
      if (o.disabled || o.readOnly) return;

      row.addEventListener('click', () => {
        if (o.menu) {
          this.stack.push(o.menu);
          this.render(o.menu);
          return;
        }
        fetchNUI('spz:context:select', { id: ctx.id, index: i, args: o.args });
        if (o.close !== false) this.exitAll();
      });
    });

    this.el.classList.add('spz-ctx--visible');
  }

  private renderItem(o: ContextItem, i: number): string {
    const disabled = o.disabled || o.readOnly;
    return `
      <div class="spz-ctx__item${disabled ? ' spz-ctx__item--disabled' : ''}${o.menu ? ' spz-ctx__item--submenu' : ''}"
           data-ctx-idx="${i}">
        ${o.icon ? `<span class="spz-ctx__icon" style="color:${o.iconColor ?? 'var(--spz-primary)'}">${o.icon}</span>` : ''}
        <div class="spz-ctx__item-body">
          <span class="spz-ctx__item-label">${o.label}</span>
          ${o.description ? `<span class="spz-ctx__item-desc">${o.description}</span>` : ''}
          ${o.progress !== undefined ? `
            <div class="spz-ctx__progress"><div class="spz-ctx__progress-fill" style="width:${o.progress}%"></div></div>
          ` : ''}
          ${(o.metadata ?? []).map(m =>
            `<div class="spz-ctx__meta"><span>${m.label}</span><span>${m.value}</span></div>`
          ).join('')}
        </div>
        ${o.menu ? '<span class="spz-ctx__chevron">›</span>' : ''}
      </div>
    `;
  }

  private back(): void {
    if (this.stack.length <= 1) { this.exitAll(); return; }
    this.stack.pop();
    this.render(this.stack[this.stack.length - 1]);
  }

  private exitAll(): void {
    fetchNUI('spz:context:close', {});
    this.hide();
  }

  hide(): void {
    this.el.classList.remove('spz-ctx--visible');
    this.stack = [];
  }
}

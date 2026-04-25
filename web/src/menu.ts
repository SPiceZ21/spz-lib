/**
 * SPZ-Lib UI — Keyboard Menu
 * Arrow-key navigable list with icons, checkboxes, and side-scroll options.
 */

import { fetchNUI } from './index';

export interface MenuItem {
  label:        string;
  description?: string;
  icon?:        string;
  iconColor?:   string;
  checked?:     boolean;
  values?:      (string | number)[];
  defaultIndex?: number;
  args?:        unknown;
  disabled?:    boolean;
}

export interface MenuOptions {
  id:          string;
  title:       string;
  position?:   'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  options:     MenuItem[];
}

export class Menu {
  private el:       HTMLElement;
  private data:     MenuOptions | null = null;
  private cursor:   number = 0;
  private scrollIdx: number[] = [];
  private checks:   boolean[] = [];
  private handler:  ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    this.el = document.getElementById('spz-menu')!;
  }

  show(opts: MenuOptions): void {
    this.data    = opts;
    this.cursor  = 0;
    this.scrollIdx = opts.options.map(o => o.defaultIndex ?? 0);
    this.checks    = opts.options.map(o => o.checked ?? false);

    const pos = opts.position ?? 'top-left';
    this.el.className = `spz-menu spz-menu--${pos}`;
    this.render();
    this.el.classList.add('spz-menu--visible');
    this.bindKeys();
  }

  private render(): void {
    if (!this.data) return;
    const item = this.data.options[this.cursor];

    this.el.innerHTML = `
      <div class="spz-menu__header">${this.data.title}</div>
      <div class="spz-menu__list">
        ${this.data.options.map((o, i) => this.renderItem(o, i)).join('')}
      </div>
      ${item?.description ? `<div class="spz-menu__desc">${item.description}</div>` : ''}
    `;

    // Scroll selected into view
    const active = this.el.querySelector('.spz-menu__item--active');
    active?.scrollIntoView({ block: 'nearest' });

    // Bind click handlers
    this.el.querySelectorAll<HTMLElement>('.spz-menu__item').forEach((row, i) => {
      row.addEventListener('click', () => {
        if (this.data?.options[i].disabled) return;
        this.cursor = i;
        this.select();
      });
      // Side scroll arrows
      row.querySelector('.spz-menu__arrow--left')
        ?.addEventListener('click', (e) => { e.stopPropagation(); this.scroll(i, -1); });
      row.querySelector('.spz-menu__arrow--right')
        ?.addEventListener('click', (e) => { e.stopPropagation(); this.scroll(i, 1); });
    });
  }

  private renderItem(o: MenuItem, i: number): string {
    const isActive = i === this.cursor;
    const isDisabled = o.disabled;
    const hasValues = o.values && o.values.length > 0;
    const hasCheck = o.checked !== undefined;

    return `
      <div class="spz-menu__item${isActive ? ' spz-menu__item--active' : ''}${isDisabled ? ' spz-menu__item--disabled' : ''}">
        ${o.icon ? `<span class="spz-menu__icon" style="color:${o.iconColor ?? 'var(--spz-primary)'}">${o.icon}</span>` : ''}
        <span class="spz-menu__label">${o.label}</span>
        ${hasValues ? `
          <div class="spz-menu__scroll">
            <button class="spz-menu__arrow spz-menu__arrow--left">‹</button>
            <span class="spz-menu__scroll-val">${o.values![this.scrollIdx[i]]}</span>
            <button class="spz-menu__arrow spz-menu__arrow--right">›</button>
          </div>
        ` : ''}
        ${hasCheck ? `
          <span class="spz-menu__check${this.checks[i] ? ' spz-menu__check--on' : ''}">
            ${this.checks[i] ? '✓' : '○'}
          </span>
        ` : ''}
      </div>
    `;
  }

  private bindKeys(): void {
    this.handler = (e: KeyboardEvent) => {
      if (!this.data) return;
      const len = this.data.options.length;
      switch (e.key) {
        case 'ArrowUp':   e.preventDefault(); this.cursor = (this.cursor - 1 + len) % len; this.render(); break;
        case 'ArrowDown': e.preventDefault(); this.cursor = (this.cursor + 1) % len; this.render(); break;
        case 'ArrowLeft': this.scroll(this.cursor, -1); break;
        case 'ArrowRight':this.scroll(this.cursor,  1); break;
        case 'Enter':     this.select(); break;
        case 'Escape':    this.exitMenu(); break;
      }
    };
    window.addEventListener('keydown', this.handler);
  }

  private scroll(index: number, dir: -1 | 1): void {
    const o = this.data?.options[index];
    if (!o?.values) return;
    const len = o.values.length;
    this.scrollIdx[index] = (this.scrollIdx[index] + dir + len) % len;
    fetchNUI('spz:menu:scroll', { index, direction: dir > 0 ? 'right' : 'left', scrollIndex: this.scrollIdx[index] });
    this.render();
  }

  private select(): void {
    const o = this.data?.options[this.cursor];
    if (!o || o.disabled) return;

    if (o.checked !== undefined) {
      this.checks[this.cursor] = !this.checks[this.cursor];
      fetchNUI('spz:menu:check', { index: this.cursor, checked: this.checks[this.cursor] });
      this.render();
      return;
    }

    fetchNUI('spz:menu:select', {
      index:       this.cursor,
      scrollIndex: this.scrollIdx[this.cursor],
      args:        o.args,
    });
    this.hide();
  }

  private exitMenu(): void {
    fetchNUI('spz:menu:close', {});
    this.hide();
  }

  hide(): void {
    if (this.handler) {
      window.removeEventListener('keydown', this.handler);
      this.handler = null;
    }
    this.el.classList.remove('spz-menu--visible');
    this.data   = null;
  }
}

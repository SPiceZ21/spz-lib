/**
 * SPZ-Lib UI — Radial Menu
 * Circular context menu. Up to 8 items arranged around a hub.
 * Default open key: Z (handled in Lua, NUI just shows/hides).
 */

import { fetchNUI } from './index';

export interface RadialItem {
  id:       string;
  label:    string;
  icon?:    string;
  menu?:    string;
  disabled?: boolean;
}

export interface RadialOptions {
  items: RadialItem[];
}

const ITEM_RADIUS = 115; // px from center to item center

export class Radial {
  private el:      HTMLElement;
  private items:   RadialItem[] = [];
  private hovered: number = -1;
  private stack:   RadialItem[][] = [];
  private registry = new Map<string, RadialItem[]>();

  constructor() {
    this.el = document.getElementById('spz-radial')!;

    this.el.addEventListener('mousemove', (e) => {
      const rect   = this.el.getBoundingClientRect();
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const dx     = e.clientX - rect.left - cx;
      const dy     = e.clientY - rect.top  - cy;
      const dist   = Math.sqrt(dx * dx + dy * dy);

      if (dist < 32) { this.setHovered(-1); return; }

      let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      if (angle < 0) angle += 360;

      const step  = 360 / this.items.length;
      const idx   = Math.round(angle / step) % this.items.length;
      this.setHovered(idx);
    });

    this.el.addEventListener('click', () => {
      if (this.hovered < 0) return;
      const item = this.items[this.hovered];
      if (!item || item.disabled) return;

      if (item.menu) {
        const sub = this.registry.get(item.menu);
        if (sub) { this.stack.push(this.items); this.setItems(sub); return; }
      }

      fetchNUI('spz:radial:select', { id: item.id });
      this.hide();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.el.classList.contains('spz-radial--visible')) {
        if (this.stack.length) {
          this.setItems(this.stack.pop()!);
        } else {
          fetchNUI('spz:radial:close', {});
          this.hide();
        }
      }
    });
  }

  registerSub(id: string, items: RadialItem[]): void {
    this.registry.set(id, items);
  }

  show(opts: RadialOptions): void {
    this.stack = [];
    this.setItems(opts.items);
    this.el.classList.add('spz-radial--visible');
  }

  update(opts: RadialOptions): void {
    this.setItems(opts.items);
  }

  private setItems(items: RadialItem[]): void {
    this.items   = items;
    this.hovered = -1;
    this.render();
  }

  private render(): void {
    const n    = this.items.length;
    const step = 360 / n;

    const itemsHTML = this.items.map((item, i) => {
      const angle = step * i - 90;
      const rad   = angle * Math.PI / 180;
      const x     = ITEM_RADIUS * Math.cos(rad);
      const y     = ITEM_RADIUS * Math.sin(rad);
      const isActive = i === this.hovered;

      return `
        <div class="spz-radial__item${isActive ? ' spz-radial__item--active' : ''}${item.disabled ? ' spz-radial__item--disabled' : ''}"
             style="transform:translate(calc(-50% + ${x}px), calc(-50% + ${y}px))">
          <div class="spz-radial__icon">${item.icon ?? '●'}</div>
          <div class="spz-radial__label">${item.label}</div>
        </div>
      `;
    });

    this.el.innerHTML = `
      <div class="spz-radial__hub">
        ${this.stack.length ? '‹' : '●'}
      </div>
      ${itemsHTML.join('')}
    `;
  }

  private setHovered(idx: number): void {
    if (idx === this.hovered) return;
    this.hovered = idx;
    this.render();
  }

  hide(): void {
    this.el.classList.remove('spz-radial--visible');
    this.items = [];
    this.stack = [];
    this.hovered = -1;
    this.el.innerHTML = '';
  }
}

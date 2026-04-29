/**
 * SPZ-Lib UI — Radial Menu (Honeycomb)
 * Premium interaction hub using the RadialMenu component.
 */

import { fetchNUI } from './index';

// We access preact and components via global window
declare const preact: any;
declare const RadialMenu: any;

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

export class Radial {
  private el: HTMLElement;
  private isOpen: boolean = false;
  private items: RadialItem[] = [];
  private stack: RadialItem[][] = [];
  private registry = new Map<string, RadialItem[]>();

  constructor() {
    this.el = document.getElementById('spz-radial')!;
    this.render();
  }

  registerSub(id: string, items: RadialItem[]): void {
    this.registry.set(id, items);
  }

  show(opts: RadialOptions): void {
    this.stack = [];
    this.items = opts.items;
    this.isOpen = true;
    this.render();
  }

  update(opts: RadialOptions): void {
    this.items = opts.items;
    this.render();
  }

  hide(): void {
    this.isOpen = false;
    this.render();
  }

  private handleSelect(id: string): void {
    fetchNUI('spz:radial:select', { id });
    this.hide();
  }

  private handleClose(): void {
    if (this.stack.length > 0) {
      this.items = this.stack.pop()!;
      this.render();
    } else {
      fetchNUI('spz:radial:close', {});
      this.hide();
    }
  }

  private render(): void {
    // Map items to include actions for the component
    const mappedItems = this.items.map(item => ({
      ...item,
      action: () => {
        if (item.menu) {
          const sub = this.registry.get(item.menu);
          if (sub) {
            this.stack.push(this.items);
            this.items = sub;
            this.render();
            return;
          }
        }
        this.handleSelect(item.id);
      }
    }));

    preact.render(
      preact.h(RadialMenu, {
        isOpen: this.isOpen,
        items: mappedItems,
        onClose: () => this.handleClose()
      }),
      this.el
    );
  }
}

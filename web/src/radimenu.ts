/**
 * SPZ-Lib UI — Radial Menu (standalone)
 * Honeycomb radial picker mounted on #spz-radimenu.
 */

import { fetchNUI } from './index';

declare const preact: any;
declare const RadialMenu: any;

export interface RadiMenuItem {
  id:        string;
  label:     string;
  icon?:     string;
  menu?:     string;
  disabled?: boolean;
}

export interface RadiMenuOptions {
  items: RadiMenuItem[];
}

export class RadiMenu {
  private el:       HTMLElement;
  private isOpen:   boolean = false;
  private items:    RadiMenuItem[] = [];
  private stack:    RadiMenuItem[][] = [];
  private registry  = new Map<string, RadiMenuItem[]>();

  constructor() {
    this.el = document.getElementById('spz-radimenu')!;
    this.render();
  }

  registerSub(id: string, items: RadiMenuItem[]): void {
    this.registry.set(id, items);
  }

  show(opts: RadiMenuOptions): void {
    this.stack  = [];
    this.items  = opts.items;
    this.isOpen = true;
    this.render();
  }

  update(opts: RadiMenuOptions): void {
    this.items = opts.items;
    this.render();
  }

  hide(): void {
    this.isOpen = false;
    this.render();
  }

  private handleSelect(id: string): void {
    fetchNUI('spz:radimenu:select', { id });
    this.hide();
  }

  private handleClose(): void {
    if (this.stack.length > 0) {
      this.items = this.stack.pop()!;
      this.render();
    } else {
      fetchNUI('spz:radimenu:close', {});
      this.hide();
    }
  }

  private render(): void {
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
      },
    }));

    preact.render(
      preact.h(RadialMenu, {
        isOpen:  this.isOpen,
        items:   mappedItems,
        onClose: () => this.handleClose(),
      }),
      this.el
    );
  }
}

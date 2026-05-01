/**
 * SPZ-Lib UI — Third Eye
 * Eye-icon trigger with staggered side-menu options.
 */

import { fetchNUI } from './index';

declare const preact: any;
declare const ThirdEye: any;

export interface ThirdOption {
  id:        string;
  label:     string;
  icon?:     string;
  disabled?: boolean;
}

export interface ThirdOptions {
  options: ThirdOption[];
}

export class Third {
  private el:      HTMLElement;
  private visible: boolean = false;
  private isOpen:  boolean = false;
  private options: ThirdOption[] = [];

  constructor() {
    this.el = document.getElementById('spz-third')!;
    this.render();
  }

  show(opts: ThirdOptions): void {
    this.options = opts.options;
    this.visible = true;
    this.isOpen  = false;
    this.render();
  }

  hide(): void {
    this.visible = false;
    this.isOpen  = false;
    this.render();
  }

  private handleToggle(state: boolean): void {
    this.isOpen = state;
    this.render();
  }

  private render(): void {
    const mappedOptions = this.options.map(opt => ({
      ...opt,
      action: () => {
        fetchNUI('spz:third:select', { id: opt.id });
        this.hide();
      },
    }));

    preact.render(
      preact.h(ThirdEye, {
        visible:  this.visible,
        isOpen:   this.isOpen,
        options:  mappedOptions,
        onToggle: (state: boolean) => this.handleToggle(state),
      }),
      this.el
    );
  }
}

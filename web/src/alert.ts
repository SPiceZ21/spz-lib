/**
 * SPZ-Lib UI — Alert Dialog
 * Blocking confirm/cancel modal. Returns result to Lua via fetchNUI.
 */

import { fetchNUI } from './index';

export interface AlertOptions {
  header:    string;
  content:   string;
  centered?: boolean;
  cancel?:   boolean;
  size?:     'xs' | 'sm' | 'md' | 'lg' | 'xl';
  labels?:   { confirm?: string; cancel?: string };
}

const SIZE_MAP: Record<string, string> = {
  xs: '340px', sm: '440px', md: '560px', lg: '680px', xl: '780px',
};

export class Alert {
  private el: HTMLElement;

  constructor() {
    this.el = document.getElementById('spz-alert')!;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.el.classList.contains('spz-alert--visible')) {
        this.resolve('cancel');
      }
    });
  }

  show(opts: AlertOptions): void {
    const width      = SIZE_MAP[opts.size ?? 'sm'];
    const confirmLbl = opts.labels?.confirm ?? 'Confirm';
    const cancelLbl  = opts.labels?.cancel  ?? 'Cancel';

    this.el.innerHTML = `
      <div class="spz-alert__backdrop"></div>
      <div class="spz-alert__box${opts.centered ? ' spz-alert__box--centered' : ''}"
           style="max-width:${width}">
        <h2 class="spz-alert__header">${opts.header}</h2>
        <div class="spz-alert__content">${opts.content}</div>
        <div class="spz-alert__footer">
          ${opts.cancel !== false ? `<button class="spz-btn spz-btn--ghost" id="spz-alert-cancel">${cancelLbl}</button>` : ''}
          <button class="spz-btn spz-btn--primary" id="spz-alert-confirm">${confirmLbl}</button>
        </div>
      </div>
    `;

    this.el.querySelector('#spz-alert-confirm')
      ?.addEventListener('click', () => this.resolve('confirm'));
    this.el.querySelector('#spz-alert-cancel')
      ?.addEventListener('click', () => this.resolve('cancel'));
    this.el.querySelector('.spz-alert__backdrop')
      ?.addEventListener('click', () => opts.cancel !== false && this.resolve('cancel'));

    this.el.classList.add('spz-alert--visible');
  }

  private resolve(result: 'confirm' | 'cancel'): void {
    this.close();
    fetchNUI('spz:alert:result', { result });
  }

  close(): void {
    this.el.classList.remove('spz-alert--visible');
    this.el.innerHTML = '';
  }
}

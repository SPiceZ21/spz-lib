/**
 * SPZ-Lib UI — Input Dialog
 * Dynamic form builder. Supports text, number, checkbox, select, slider, textarea.
 */

import { fetchNUI } from './index';

export type FieldType =
  | 'text' | 'number' | 'checkbox' | 'select'
  | 'multi-select' | 'slider' | 'textarea' | 'password';

export interface DialogField {
  type:         FieldType;
  label:        string;
  description?: string;
  required?:    boolean;
  default?:     unknown;
  min?:         number;
  max?:         number;
  step?:        number;
  options?:     { label: string; value: string }[];
  rows?:        number;  // textarea rows
}

export interface DialogOptions {
  heading:      string;
  rows:         DialogField[];
  allowCancel?: boolean;
  size?:        'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export class Dialog {
  private el: HTMLElement;

  constructor() {
    this.el = document.getElementById('spz-dialog')!;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.el.classList.contains('spz-dialog--visible')) {
        this.resolve(null);
      }
    });
  }

  show(opts: DialogOptions): void {
    const canCancel = opts.allowCancel !== false;

    this.el.innerHTML = `
      <div class="spz-dialog__backdrop"></div>
      <div class="spz-dialog__box">
        <div class="spz-dialog__header">
          <h2>${opts.heading}</h2>
          ${canCancel ? '<button class="spz-dialog__close" id="spz-dialog-close">✕</button>' : ''}
        </div>
        <div class="spz-dialog__body" id="spz-dialog-body">
          ${opts.rows.map((f, i) => this.renderField(f, i)).join('')}
        </div>
        <div class="spz-dialog__footer">
          ${canCancel ? '<button class="spz-btn spz-btn--ghost" id="spz-dialog-cancel">Cancel</button>' : ''}
          <button class="spz-btn spz-btn--primary" id="spz-dialog-submit">Submit</button>
        </div>
      </div>
    `;

    if (canCancel) {
      this.el.querySelector('#spz-dialog-close')?.addEventListener('click', () => this.resolve(null));
      this.el.querySelector('#spz-dialog-cancel')?.addEventListener('click', () => this.resolve(null));
      this.el.querySelector('.spz-dialog__backdrop')?.addEventListener('click', () => this.resolve(null));
    }

    this.el.querySelector('#spz-dialog-submit')
      ?.addEventListener('click', () => this.submit(opts.rows));

    // Wire up slider live labels
    this.el.querySelectorAll<HTMLInputElement>('input[type=range]').forEach(input => {
      const label = this.el.querySelector<HTMLElement>(`#val-${input.id}`);
      if (label) input.addEventListener('input', () => label.textContent = input.value);
    });

    this.el.classList.add('spz-dialog--visible');
  }

  private renderField(field: DialogField, index: number): string {
    const id  = `spz-field-${index}`;
    const def = field.default;

    const desc = field.description
      ? `<p class="spz-dialog__field-desc">${field.description}</p>` : '';
    const req  = field.required ? '<span class="spz-required">*</span>' : '';

    let input = '';
    switch (field.type) {
      case 'text':
      case 'password':
        input = `<input class="spz-input" id="${id}" type="${field.type}"
                   value="${def ?? ''}" placeholder="${field.label}">`;
        break;
      case 'number':
        input = `<input class="spz-input" id="${id}" type="number"
                   value="${def ?? ''}"
                   ${field.min !== undefined ? `min="${field.min}"` : ''}
                   ${field.max !== undefined ? `max="${field.max}"` : ''}
                   ${field.step !== undefined ? `step="${field.step}"` : ''}>`;
        break;
      case 'checkbox':
        input = `<label class="spz-checkbox">
                   <input type="checkbox" id="${id}" ${def ? 'checked' : ''}>
                   <span class="spz-checkbox__box"></span>
                   <span class="spz-checkbox__label">${field.label}</span>
                 </label>`;
        break;
      case 'select':
        input = `<select class="spz-input" id="${id}">
          ${(field.options ?? []).map(o =>
            `<option value="${o.value}" ${def === o.value ? 'selected' : ''}>${o.label}</option>`
          ).join('')}
        </select>`;
        break;
      case 'multi-select':
        input = `<select class="spz-input" id="${id}" multiple size="4">
          ${(field.options ?? []).map(o =>
            `<option value="${o.value}" ${Array.isArray(def) && (def as string[]).includes(o.value) ? 'selected' : ''}>${o.label}</option>`
          ).join('')}
        </select>`;
        break;
      case 'slider': {
        const min = field.min ?? 0;
        const max = field.max ?? 100;
        const val = (def as number) ?? min;
        input = `<div class="spz-slider-wrap">
          <input class="spz-slider" id="${id}" type="range" min="${min}" max="${max}"
                 step="${field.step ?? 1}" value="${val}">
          <span class="spz-slider__val" id="val-${id}">${val}</span>
        </div>`;
        break;
      }
      case 'textarea':
        input = `<textarea class="spz-input spz-input--textarea" id="${id}"
                   rows="${field.rows ?? 3}">${def ?? ''}</textarea>`;
        break;
    }

    const labelBlock = field.type !== 'checkbox'
      ? `<label class="spz-dialog__label" for="${id}">${field.label} ${req}</label>` : '';

    return `<div class="spz-dialog__field">${labelBlock}${input}${desc}</div>`;
  }

  private submit(rows: DialogField[]): void {
    const values: unknown[] = rows.map((f, i) => {
      const el = this.el.querySelector(`#spz-field-${i}`);
      if (!el) return null;
      switch (f.type) {
        case 'checkbox':   return (el as HTMLInputElement).checked;
        case 'number':     return parseFloat((el as HTMLInputElement).value);
        case 'slider':     return parseFloat((el as HTMLInputElement).value);
        case 'multi-select':
          return Array.from((el as HTMLSelectElement).selectedOptions).map(o => o.value);
        default:           return (el as HTMLInputElement | HTMLTextAreaElement).value;
      }
    });
    this.resolve(values);
  }

  private resolve(result: unknown[] | null): void {
    this.close();
    fetchNUI('spz:dialog:result', { result });
  }

  close(): void {
    this.el.classList.remove('spz-dialog--visible');
    this.el.innerHTML = '';
  }
}

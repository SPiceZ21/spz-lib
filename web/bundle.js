/**
 * SPZ-Lib UI — bundle.js
 * Hand-compiled from TypeScript sources. Single IIFE, no dependencies.
 */
(function () {
  'use strict';

  // ── fetchNUI ──────────────────────────────────────────────────────────────────
  function fetchNUI(event, data) {
    return fetch('https://' + GetParentResourceName() + '/' + event, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data !== undefined ? data : {}),
    });
  }

  // ── Notifications ─────────────────────────────────────────────────────────────
  var NOTIFY_ACCENT = { info: '#3b82f6', success: '#22c55e', warning: '#f59e0b', error: '#ef4444' };
  var NOTIFY_ICON   = { info: '●', success: '✓', warning: '▲', error: '✕' };
  var MAX_VISIBLE   = 6;

  function Notifications() {
    this.containers = new Map();
    this.active     = new Map();
    this.counter    = 0;
    this._getContainer('top-right');
  }

  Notifications.prototype._getContainer = function (pos) {
    if (this.containers.has(pos)) return this.containers.get(pos);
    var el = document.createElement('div');
    el.className = 'spz-notif-stack spz-notif-stack--' + pos;
    document.getElementById('spz-notifications').appendChild(el);
    this.containers.set(pos, el);
    return el;
  };

  Notifications.prototype.show = function (opts) {
    var type     = opts.type     || 'info';
    var duration = opts.duration || 4000;
    var pos      = opts.position || 'top-right';
    var id       = opts.id || ('notif-' + (++this.counter));
    var color    = NOTIFY_ACCENT[type] || NOTIFY_ACCENT.info;
    var icon     = opts.icon || NOTIFY_ICON[type];

    if (opts.id && this.active.has(id)) this.dismiss(id, true);

    var stack = this._getContainer(pos);
    if (stack.childElementCount >= MAX_VISIBLE) {
      var oldest = stack.firstElementChild;
      if (oldest && oldest.dataset.id) this.dismiss(oldest.dataset.id, true);
    }

    var el = document.createElement('div');
    el.className  = 'spz-notif';
    el.dataset.id = id;
    el.style.setProperty('--accent', color);
    el.innerHTML =
      '<div class="spz-notif__icon" style="color:' + (opts.iconColor || color) + '">' + icon + '</div>' +
      '<div class="spz-notif__body">' +
        (opts.title       ? '<p class="spz-notif__title">' + opts.title + '</p>' : '') +
        (opts.description ? '<p class="spz-notif__desc">'  + opts.description + '</p>' : '') +
      '</div>' +
      '<div class="spz-notif__bar" style="animation-duration:' + duration + 'ms"></div>';

    var self = this;
    el.addEventListener('click', function () { self.dismiss(id); });

    if (pos.startsWith('bottom')) stack.appendChild(el);
    else                          stack.prepend(el);

    requestAnimationFrame(function () { el.classList.add('spz-notif--visible'); });
    this.active.set(id, el);
    setTimeout(function () { self.dismiss(id); }, duration);
  };

  Notifications.prototype.dismiss = function (id, immediate) {
    var el = this.active.get(id);
    if (!el) return;
    this.active.delete(id);
    if (immediate) { el.remove(); return; }
    el.classList.remove('spz-notif--visible');
    el.classList.add('spz-notif--leaving');
    el.addEventListener('animationend', function () { el.remove(); }, { once: true });
    setTimeout(function () { el.remove(); }, 400);
  };

  // ── TextUI ────────────────────────────────────────────────────────────────────
  function TextUI() {
    this.el      = document.getElementById('spz-textui');
    this.visible = false;
  }

  TextUI.prototype.show = function (opts) {
    var pos   = opts.position || 'right-center';
    var icon  = opts.icon     || '';
    var align = opts.align    || 'left';

    this.el.className = 'spz-textui spz-textui--' + pos;
    this.el.style.textAlign = align;
    this.el.innerHTML =
      (icon ? '<span class="spz-textui__icon" style="color:' + (opts.iconColor || 'var(--spz-primary)') + '">' + icon + '</span>' : '') +
      '<span class="spz-textui__text">' + opts.text + '</span>';

    if (opts.style) Object.assign(this.el.style, opts.style);
    if (!this.visible) {
      this.el.classList.add('spz-textui--visible');
      this.visible = true;
    }
  };

  TextUI.prototype.hide = function () {
    this.el.classList.remove('spz-textui--visible');
    this.visible = false;
  };

  TextUI.prototype.isOpen = function () { return this.visible; };

  // ── Progress ──────────────────────────────────────────────────────────────────
  function Progress() {
    this.el      = document.getElementById('spz-progress');
    this.timer   = null;
    this.startAt = 0;
    this.rafId   = 0;
  }

  Progress.prototype.show = function (opts) {
    this.cancel(false);
    var type     = opts.type     || 'bar';
    var position = opts.position || 'bottom';
    this.el.className = 'spz-progress spz-progress--' + type + ' spz-progress--' + position;
    this.el.innerHTML = type === 'circle' ? this._circleTemplate(opts) : this._barTemplate(opts);
    this.el.classList.add('spz-progress--visible');
    this.startAt = performance.now();
    this._tick(opts.duration);
    if (opts.canCancel) this._bindCancel();
  };

  Progress.prototype._barTemplate = function (opts) {
    return '<div class="spz-progress__bar-wrap">' +
      (opts.label ? '<p class="spz-progress__label">' + opts.label + '</p>' : '') +
      '<div class="spz-progress__track"><div class="spz-progress__fill" id="spz-prog-fill"></div></div>' +
      (opts.canCancel ? '<p class="spz-progress__cancel-hint">Press X to cancel</p>' : '') +
      '</div>';
  };

  Progress.prototype._circleTemplate = function (opts) {
    var r    = 36;
    var circ = 2 * Math.PI * r;
    return '<div class="spz-progress__circle-wrap">' +
      '<svg viewBox="0 0 88 88" class="spz-progress__svg">' +
        '<circle class="spz-progress__svg-track" cx="44" cy="44" r="' + r + '"/>' +
        '<circle class="spz-progress__svg-fill" id="spz-prog-fill" cx="44" cy="44" r="' + r + '"' +
          ' stroke-dasharray="' + circ + '" stroke-dashoffset="' + circ + '"/>' +
      '</svg>' +
      (opts.label ? '<p class="spz-progress__label">' + opts.label + '</p>' : '') +
      (opts.canCancel ? '<p class="spz-progress__cancel-hint">X to cancel</p>' : '') +
      '</div>';
  };

  Progress.prototype._tick = function (duration) {
    var self    = this;
    var fill    = document.getElementById('spz-prog-fill');
    var isCirc  = this.el.classList.contains('spz-progress--circle');
    var r       = 36;
    var circ    = 2 * Math.PI * r;

    function update() {
      var elapsed = performance.now() - self.startAt;
      var pct     = Math.min(elapsed / duration, 1);
      if (fill) {
        if (isCirc) fill.style.strokeDashoffset = String(circ * (1 - pct));
        else        fill.style.width = (pct * 100) + '%';
      }
      if (pct < 1) self.rafId = requestAnimationFrame(update);
    }

    this.rafId = requestAnimationFrame(update);
    this.timer = setTimeout(function () { self._done(); }, duration);
  };

  Progress.prototype._bindCancel = function () {
    var self = this;
    function handler(e) {
      if (e.code === 'KeyX') {
        window.removeEventListener('keydown', handler);
        self.cancel(true);
      }
    }
    window.addEventListener('keydown', handler);
  };

  Progress.prototype._done = function () {
    this._cleanup();
    fetchNUI('spz:progress:done', { cancelled: false });
  };

  Progress.prototype.cancel = function (notify) {
    if (!this.el.classList.contains('spz-progress--visible')) return;
    this._cleanup();
    if (notify !== false) fetchNUI('spz:progress:done', { cancelled: true });
  };

  Progress.prototype._cleanup = function () {
    cancelAnimationFrame(this.rafId);
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.el.classList.remove('spz-progress--visible');
  };

  Progress.prototype.isActive = function () {
    return this.el.classList.contains('spz-progress--visible');
  };

  // ── Alert ─────────────────────────────────────────────────────────────────────
  var SIZE_MAP = { xs: '340px', sm: '440px', md: '560px', lg: '680px', xl: '780px' };

  function Alert() {
    var self = this;
    this.el  = document.getElementById('spz-alert');
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && self.el.classList.contains('spz-alert--visible'))
        self._resolve('cancel');
    });
  }

  Alert.prototype.show = function (opts) {
    var self       = this;
    var width      = SIZE_MAP[opts.size || 'sm'];
    var confirmLbl = (opts.labels && opts.labels.confirm) || 'Confirm';
    var cancelLbl  = (opts.labels && opts.labels.cancel)  || 'Cancel';
    var canCancel  = opts.cancel !== false;

    this.el.innerHTML =
      '<div class="spz-alert__backdrop"></div>' +
      '<div class="spz-alert__box' + (opts.centered ? ' spz-alert__box--centered' : '') + '" style="max-width:' + width + '">' +
        '<h2 class="spz-alert__header">' + opts.header + '</h2>' +
        '<div class="spz-alert__content">' + opts.content + '</div>' +
        '<div class="spz-alert__footer">' +
          (canCancel ? '<button class="spz-btn spz-btn--ghost" id="spz-alert-cancel">' + cancelLbl + '</button>' : '') +
          '<button class="spz-btn spz-btn--primary" id="spz-alert-confirm">' + confirmLbl + '</button>' +
        '</div>' +
      '</div>';

    var confirmBtn = this.el.querySelector('#spz-alert-confirm');
    var cancelBtn  = this.el.querySelector('#spz-alert-cancel');
    var backdrop   = this.el.querySelector('.spz-alert__backdrop');
    if (confirmBtn) confirmBtn.addEventListener('click', function () { self._resolve('confirm'); });
    if (cancelBtn)  cancelBtn.addEventListener('click',  function () { self._resolve('cancel'); });
    if (backdrop && canCancel) backdrop.addEventListener('click', function () { self._resolve('cancel'); });

    this.el.classList.add('spz-alert--visible');
  };

  Alert.prototype._resolve = function (result) {
    this.close();
    fetchNUI('spz:alert:result', { result: result });
  };

  Alert.prototype.close = function () {
    this.el.classList.remove('spz-alert--visible');
    this.el.innerHTML = '';
  };

  // ── Dialog ────────────────────────────────────────────────────────────────────
  function Dialog() {
    var self = this;
    this.el  = document.getElementById('spz-dialog');
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && self.el.classList.contains('spz-dialog--visible'))
        self._resolve(null);
    });
  }

  Dialog.prototype.show = function (opts) {
    var self      = this;
    var canCancel = opts.allowCancel !== false;

    this.el.innerHTML =
      '<div class="spz-dialog__backdrop"></div>' +
      '<div class="spz-dialog__box">' +
        '<div class="spz-dialog__header">' +
          '<h2>' + opts.heading + '</h2>' +
          (canCancel ? '<button class="spz-dialog__close" id="spz-dialog-close">✕</button>' : '') +
        '</div>' +
        '<div class="spz-dialog__body" id="spz-dialog-body">' +
          opts.rows.map(function (f, i) { return self._renderField(f, i); }).join('') +
        '</div>' +
        '<div class="spz-dialog__footer">' +
          (canCancel ? '<button class="spz-btn spz-btn--ghost" id="spz-dialog-cancel">Cancel</button>' : '') +
          '<button class="spz-btn spz-btn--primary" id="spz-dialog-submit">Submit</button>' +
        '</div>' +
      '</div>';

    if (canCancel) {
      var closeBtn  = this.el.querySelector('#spz-dialog-close');
      var cancelBtn = this.el.querySelector('#spz-dialog-cancel');
      var backdrop  = this.el.querySelector('.spz-dialog__backdrop');
      if (closeBtn)  closeBtn.addEventListener('click',  function () { self._resolve(null); });
      if (cancelBtn) cancelBtn.addEventListener('click', function () { self._resolve(null); });
      if (backdrop)  backdrop.addEventListener('click',  function () { self._resolve(null); });
    }

    this.el.querySelector('#spz-dialog-submit')
      .addEventListener('click', function () { self._submit(opts.rows); });

    this.el.querySelectorAll('input[type=range]').forEach(function (input) {
      var label = self.el.querySelector('#val-' + input.id);
      if (label) input.addEventListener('input', function () { label.textContent = input.value; });
    });

    this.el.classList.add('spz-dialog--visible');
  };

  Dialog.prototype._renderField = function (field, index) {
    var id  = 'spz-field-' + index;
    var def = field.default;
    var desc = field.description ? '<p class="spz-dialog__field-desc">' + field.description + '</p>' : '';
    var req  = field.required    ? '<span class="spz-required">*</span>' : '';
    var input = '';

    switch (field.type) {
      case 'text':
      case 'password':
        input = '<input class="spz-input" id="' + id + '" type="' + field.type + '" value="' + (def || '') + '" placeholder="' + field.label + '">';
        break;
      case 'number':
        input = '<input class="spz-input" id="' + id + '" type="number" value="' + (def !== undefined ? def : '') + '"' +
          (field.min !== undefined ? ' min="' + field.min + '"' : '') +
          (field.max !== undefined ? ' max="' + field.max + '"' : '') +
          (field.step !== undefined ? ' step="' + field.step + '"' : '') + '>';
        break;
      case 'checkbox':
        input = '<label class="spz-checkbox"><input type="checkbox" id="' + id + '"' + (def ? ' checked' : '') + '>' +
          '<span class="spz-checkbox__box"></span><span class="spz-checkbox__label">' + field.label + '</span></label>';
        break;
      case 'select':
        input = '<select class="spz-input" id="' + id + '">' +
          (field.options || []).map(function (o) {
            return '<option value="' + o.value + '"' + (def === o.value ? ' selected' : '') + '>' + o.label + '</option>';
          }).join('') + '</select>';
        break;
      case 'multi-select':
        input = '<select class="spz-input" id="' + id + '" multiple size="4">' +
          (field.options || []).map(function (o) {
            return '<option value="' + o.value + '"' + (Array.isArray(def) && def.includes(o.value) ? ' selected' : '') + '>' + o.label + '</option>';
          }).join('') + '</select>';
        break;
      case 'slider': {
        var min = field.min !== undefined ? field.min : 0;
        var max = field.max !== undefined ? field.max : 100;
        var val = def !== undefined ? def : min;
        input = '<div class="spz-slider-wrap"><input class="spz-slider" id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="' + (field.step || 1) + '" value="' + val + '">' +
          '<span class="spz-slider__val" id="val-' + id + '">' + val + '</span></div>';
        break;
      }
      case 'textarea':
        input = '<textarea class="spz-input spz-input--textarea" id="' + id + '" rows="' + (field.rows || 3) + '">' + (def || '') + '</textarea>';
        break;
    }

    var labelBlock = field.type !== 'checkbox'
      ? '<label class="spz-dialog__label" for="' + id + '">' + field.label + ' ' + req + '</label>' : '';
    return '<div class="spz-dialog__field">' + labelBlock + input + desc + '</div>';
  };

  Dialog.prototype._submit = function (rows) {
    var self   = this;
    var values = rows.map(function (f, i) {
      var el = self.el.querySelector('#spz-field-' + i);
      if (!el) return null;
      switch (f.type) {
        case 'checkbox': return el.checked;
        case 'number':
        case 'slider':   return parseFloat(el.value);
        case 'multi-select':
          return Array.from(el.selectedOptions).map(function (o) { return o.value; });
        default: return el.value;
      }
    });
    this._resolve(values);
  };

  Dialog.prototype._resolve = function (result) {
    this.close();
    fetchNUI('spz:dialog:result', { result: result });
  };

  Dialog.prototype.close = function () {
    this.el.classList.remove('spz-dialog--visible');
    this.el.innerHTML = '';
  };

  // ── Menu ──────────────────────────────────────────────────────────────────────
  function Menu() {
    this.el        = document.getElementById('spz-menu');
    this.data      = null;
    this.cursor    = 0;
    this.scrollIdx = [];
    this.checks    = [];
    this.handler   = null;
  }

  Menu.prototype.show = function (opts) {
    this.data      = opts;
    this.cursor    = 0;
    this.scrollIdx = opts.options.map(function (o) { return o.defaultIndex || 0; });
    this.checks    = opts.options.map(function (o) { return o.checked || false; });

    var pos = opts.position || 'top-left';
    this.el.className = 'spz-menu spz-menu--' + pos;
    this._render();
    this.el.classList.add('spz-menu--visible');
    this._bindKeys();
  };

  Menu.prototype._render = function () {
    if (!this.data) return;
    var self = this;
    var item = this.data.options[this.cursor];

    this.el.innerHTML =
      '<div class="spz-menu__header">' + this.data.title + '</div>' +
      '<div class="spz-menu__list">' +
        this.data.options.map(function (o, i) { return self._renderItem(o, i); }).join('') +
      '</div>' +
      (item && item.description ? '<div class="spz-menu__desc">' + item.description + '</div>' : '');

    var active = this.el.querySelector('.spz-menu__item--active');
    if (active) active.scrollIntoView({ block: 'nearest' });

    this.el.querySelectorAll('.spz-menu__item').forEach(function (row, i) {
      row.addEventListener('click', function () {
        if (self.data.options[i].disabled) return;
        self.cursor = i;
        self._select();
      });
      var left  = row.querySelector('.spz-menu__arrow--left');
      var right = row.querySelector('.spz-menu__arrow--right');
      if (left)  left.addEventListener('click',  function (e) { e.stopPropagation(); self._scroll(i, -1); });
      if (right) right.addEventListener('click', function (e) { e.stopPropagation(); self._scroll(i, 1); });
    });
  };

  Menu.prototype._renderItem = function (o, i) {
    var isActive   = i === this.cursor;
    var hasValues  = o.values && o.values.length > 0;
    var hasCheck   = o.checked !== undefined;
    return '<div class="spz-menu__item' + (isActive ? ' spz-menu__item--active' : '') + (o.disabled ? ' spz-menu__item--disabled' : '') + '">' +
      (o.icon ? '<span class="spz-menu__icon" style="color:' + (o.iconColor || 'var(--spz-primary)') + '">' + o.icon + '</span>' : '') +
      '<span class="spz-menu__label">' + o.label + '</span>' +
      (hasValues ?
        '<div class="spz-menu__scroll">' +
          '<button class="spz-menu__arrow spz-menu__arrow--left">‹</button>' +
          '<span class="spz-menu__scroll-val">' + o.values[this.scrollIdx[i]] + '</span>' +
          '<button class="spz-menu__arrow spz-menu__arrow--right">›</button>' +
        '</div>' : '') +
      (hasCheck ?
        '<span class="spz-menu__check' + (this.checks[i] ? ' spz-menu__check--on' : '') + '">' +
          (this.checks[i] ? '✓' : '○') +
        '</span>' : '') +
      '</div>';
  };

  Menu.prototype._bindKeys = function () {
    var self = this;
    this.handler = function (e) {
      if (!self.data) return;
      var len = self.data.options.length;
      switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); self.cursor = (self.cursor - 1 + len) % len; self._render(); break;
        case 'ArrowDown':  e.preventDefault(); self.cursor = (self.cursor + 1) % len; self._render(); break;
        case 'ArrowLeft':  self._scroll(self.cursor, -1); break;
        case 'ArrowRight': self._scroll(self.cursor,  1); break;
        case 'Enter':      self._select(); break;
        case 'Escape':     self._exitMenu(); break;
      }
    };
    window.addEventListener('keydown', this.handler);
  };

  Menu.prototype._scroll = function (index, dir) {
    var o = this.data && this.data.options[index];
    if (!o || !o.values) return;
    var len = o.values.length;
    this.scrollIdx[index] = (this.scrollIdx[index] + dir + len) % len;
    fetchNUI('spz:menu:scroll', { index: index, direction: dir > 0 ? 'right' : 'left', scrollIndex: this.scrollIdx[index] });
    this._render();
  };

  Menu.prototype._select = function () {
    var o = this.data && this.data.options[this.cursor];
    if (!o || o.disabled) return;
    if (o.checked !== undefined) {
      this.checks[this.cursor] = !this.checks[this.cursor];
      fetchNUI('spz:menu:check', { index: this.cursor, checked: this.checks[this.cursor] });
      this._render();
      return;
    }
    fetchNUI('spz:menu:select', { index: this.cursor, scrollIndex: this.scrollIdx[this.cursor], args: o.args });
    this.hide();
  };

  Menu.prototype._exitMenu = function () {
    fetchNUI('spz:menu:close', {});
    this.hide();
  };

  Menu.prototype.hide = function () {
    if (this.handler) {
      window.removeEventListener('keydown', this.handler);
      this.handler = null;
    }
    this.el.classList.remove('spz-menu--visible');
    this.data = null;
  };

  // ── Context ───────────────────────────────────────────────────────────────────
  function Context() {
    var self   = this;
    this.el    = document.getElementById('spz-context');
    this.reg   = new Map();
    this.stack = [];

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && self.el.classList.contains('spz-ctx--visible'))
        self._back();
    });
  }

  Context.prototype.register = function (data) { this.reg.set(data.id, data); };

  Context.prototype.show = function (data) {
    if ('options' in data) this.reg.set(data.id, data);
    this.stack = [data.id];
    this._render(data.id);
  };

  Context.prototype._render = function (id) {
    var self = this;
    var ctx  = this.reg.get(id);
    if (!ctx) return;

    var pos = ctx.position || 'top-left';
    this.el.className = 'spz-ctx spz-ctx--' + pos;

    var backBtn = this.stack.length > 1
      ? '<button class="spz-ctx__back" id="spz-ctx-back">‹ Back</button>' : '';

    this.el.innerHTML =
      '<div class="spz-ctx__header">' +
        backBtn +
        '<span class="spz-ctx__title">' + ctx.title + '</span>' +
        (ctx.canClose !== false ? '<button class="spz-ctx__close" id="spz-ctx-close">✕</button>' : '') +
      '</div>' +
      '<div class="spz-ctx__list">' +
        ctx.options.map(function (o, i) { return self._renderItem(o, i); }).join('') +
      '</div>';

    var backEl  = this.el.querySelector('#spz-ctx-back');
    var closeEl = this.el.querySelector('#spz-ctx-close');
    if (backEl)  backEl.addEventListener('click',  function () { self._back(); });
    if (closeEl) closeEl.addEventListener('click', function () { self._exitAll(); });

    this.el.querySelectorAll('[data-ctx-idx]').forEach(function (row) {
      var i = parseInt(row.dataset.ctxIdx);
      var o = ctx.options[i];
      if (o.disabled || o.readOnly) return;
      row.addEventListener('click', function () {
        if (o.menu) { self.stack.push(o.menu); self._render(o.menu); return; }
        fetchNUI('spz:context:select', { id: ctx.id, index: i, args: o.args });
        if (o.close !== false) self._exitAll();
      });
    });

    this.el.classList.add('spz-ctx--visible');
  };

  Context.prototype._renderItem = function (o, i) {
    var disabled = o.disabled || o.readOnly;
    var meta = (o.metadata || []).map(function (m) {
      return '<div class="spz-ctx__meta"><span>' + m.label + '</span><span>' + m.value + '</span></div>';
    }).join('');
    return '<div class="spz-ctx__item' + (disabled ? ' spz-ctx__item--disabled' : '') + (o.menu ? ' spz-ctx__item--submenu' : '') + '" data-ctx-idx="' + i + '">' +
      (o.icon ? '<span class="spz-ctx__icon" style="color:' + (o.iconColor || 'var(--spz-primary)') + '">' + o.icon + '</span>' : '') +
      '<div class="spz-ctx__item-body">' +
        '<span class="spz-ctx__item-label">' + o.label + '</span>' +
        (o.description ? '<span class="spz-ctx__item-desc">' + o.description + '</span>' : '') +
        (o.progress !== undefined ? '<div class="spz-ctx__progress"><div class="spz-ctx__progress-fill" style="width:' + o.progress + '%"></div></div>' : '') +
        meta +
      '</div>' +
      (o.menu ? '<span class="spz-ctx__chevron">›</span>' : '') +
      '</div>';
  };

  Context.prototype._back = function () {
    if (this.stack.length <= 1) { this._exitAll(); return; }
    this.stack.pop();
    this._render(this.stack[this.stack.length - 1]);
  };

  Context.prototype._exitAll = function () {
    fetchNUI('spz:context:close', {});
    this.hide();
  };

  Context.prototype.hide = function () {
    this.el.classList.remove('spz-ctx--visible');
    this.stack = [];
  };

  // ── Radial ────────────────────────────────────────────────────────────────────
  var ITEM_RADIUS = 115;

  function Radial() {
    var self     = this;
    this.el      = document.getElementById('spz-radial');
    this.items   = [];
    this.hovered = -1;
    this.stack   = [];
    this.reg     = new Map();

    this.el.addEventListener('mousemove', function (e) {
      var rect  = self.el.getBoundingClientRect();
      var cx    = rect.width  / 2;
      var cy    = rect.height / 2;
      var dx    = e.clientX - rect.left - cx;
      var dy    = e.clientY - rect.top  - cy;
      var dist  = Math.sqrt(dx * dx + dy * dy);

      if (dist < 32) { self._setHovered(-1); return; }

      var angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      if (angle < 0) angle += 360;

      var step = 360 / self.items.length;
      var idx  = Math.round(angle / step) % self.items.length;
      self._setHovered(idx);
    });

    this.el.addEventListener('click', function () {
      if (self.hovered < 0) return;
      var item = self.items[self.hovered];
      if (!item || item.disabled) return;
      if (item.menu) {
        var sub = self.reg.get(item.menu);
        if (sub) { self.stack.push(self.items); self._setItems(sub); return; }
      }
      fetchNUI('spz:radial:select', { id: item.id });
      self.hide();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && self.el.classList.contains('spz-radial--visible')) {
        if (self.stack.length) {
          self._setItems(self.stack.pop());
        } else {
          fetchNUI('spz:radial:close', {});
          self.hide();
        }
      }
    });
  }

  Radial.prototype.registerSub = function (id, items) { this.reg.set(id, items); };

  Radial.prototype.show = function (opts) {
    this.stack = [];
    this._setItems(opts.items);
    this.el.classList.add('spz-radial--visible');
  };

  Radial.prototype.update = function (opts) { this._setItems(opts.items); };

  Radial.prototype._setItems = function (items) {
    this.items   = items;
    this.hovered = -1;
    this._render();
  };

  Radial.prototype._render = function () {
    var self = this;
    var n    = this.items.length;
    var step = 360 / n;

    var itemsHTML = this.items.map(function (item, i) {
      var angle    = step * i - 90;
      var rad      = angle * Math.PI / 180;
      var x        = ITEM_RADIUS * Math.cos(rad);
      var y        = ITEM_RADIUS * Math.sin(rad);
      var isActive = i === self.hovered;
      return '<div class="spz-radial__item' + (isActive ? ' spz-radial__item--active' : '') + (item.disabled ? ' spz-radial__item--disabled' : '') + '"' +
        ' style="transform:translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px))">' +
        '<div class="spz-radial__icon">' + (item.icon || '●') + '</div>' +
        '<div class="spz-radial__label">' + item.label + '</div>' +
        '</div>';
    });

    this.el.innerHTML =
      '<div class="spz-radial__hub">' + (this.stack.length ? '‹' : '●') + '</div>' +
      itemsHTML.join('');
  };

  Radial.prototype._setHovered = function (idx) {
    if (idx === this.hovered) return;
    this.hovered = idx;
    this._render();
  };

  Radial.prototype.hide = function () {
    this.el.classList.remove('spz-radial--visible');
    this.items   = [];
    this.stack   = [];
    this.hovered = -1;
    this.el.innerHTML = '';
  };

  // ── SkillCheck ────────────────────────────────────────────────────────────────
  var SC_R    = 60;
  var SC_CX   = 80;
  var SC_CY   = 80;

  var PRESETS = {
    easy:   { areaSize: 50, speedMultiplier: 1.0 },
    medium: { areaSize: 40, speedMultiplier: 1.5 },
    hard:   { areaSize: 25, speedMultiplier: 1.75 },
  };

  function SkillCheck() {
    this.el        = document.getElementById('spz-skillcheck');
    this.rafId     = 0;
    this.angle     = 0;
    this.speed     = 2;
    this.zoneStart = 0;
    this.zoneSize  = 50;
    this.inputs    = ['KeyE'];
    this.queue     = [];
    this.handler   = null;
  }

  SkillCheck.prototype.start = function (opts) {
    var difficulties = Array.isArray(opts.difficulty) ? opts.difficulty : [opts.difficulty];
    this.queue  = difficulties.map(function (d) {
      return typeof d === 'string' ? PRESETS[d] : d;
    });
    this.inputs = opts.inputs || ['KeyE'];
    this._nextChallenge();
  };

  SkillCheck.prototype._nextChallenge = function () {
    if (!this.queue.length) { this._finish(true); return; }
    var preset = this.queue.shift();

    this.angle     = 0;
    this.speed     = preset.speedMultiplier * 2.5;
    this.zoneSize  = preset.areaSize;
    this.zoneStart = 20 + Math.random() * (320 - preset.areaSize);

    this._render();
    this.el.classList.add('spz-skillcheck--visible');
    this._bindKey();
    this._loop();
  };

  SkillCheck.prototype._render = function () {
    var self     = this;
    var keyLabel = this.inputs.map(function (k) { return k.replace('Key', ''); }).join(' / ');

    this.el.innerHTML =
      '<div class="spz-skillcheck__wrap">' +
        '<svg viewBox="0 0 160 160" class="spz-skillcheck__svg" id="spz-sc-svg">' +
          '<circle class="spz-sc-track" cx="' + SC_CX + '" cy="' + SC_CY + '" r="' + SC_R + '"/>' +
          '<path class="spz-sc-zone" id="spz-sc-zone"/>' +
          '<line class="spz-sc-needle" id="spz-sc-needle"' +
            ' x1="' + SC_CX + '" y1="' + SC_CY + '"' +
            ' x2="' + SC_CX + '" y2="' + (SC_CY - SC_R + 4) + '"' +
            ' transform="rotate(0, ' + SC_CX + ', ' + SC_CY + ')"/>' +
        '</svg>' +
        '<div class="spz-skillcheck__key">' + keyLabel + '</div>' +
      '</div>';

    this._updateZone();
  };

  SkillCheck.prototype._updateZone = function () {
    var zone = document.getElementById('spz-sc-zone');
    if (!zone) return;

    var startRad = (this.zoneStart - 90)                  * Math.PI / 180;
    var endRad   = (this.zoneStart + this.zoneSize - 90)  * Math.PI / 180;
    var x1 = SC_CX + SC_R * Math.cos(startRad);
    var y1 = SC_CY + SC_R * Math.sin(startRad);
    var x2 = SC_CX + SC_R * Math.cos(endRad);
    var y2 = SC_CY + SC_R * Math.sin(endRad);
    var large = this.zoneSize > 180 ? 1 : 0;

    zone.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' A ' + SC_R + ' ' + SC_R + ' 0 ' + large + ' 1 ' + x2 + ' ' + y2);
    zone.setAttribute('stroke-width', '8');
    zone.setAttribute('fill', 'none');
  };

  SkillCheck.prototype._loop = function () {
    var self = this;
    this.angle = (this.angle + this.speed) % 360;
    var needle = document.getElementById('spz-sc-needle');
    if (needle) needle.setAttribute('transform', 'rotate(' + this.angle + ', ' + SC_CX + ', ' + SC_CY + ')');
    this.rafId = requestAnimationFrame(function () { self._loop(); });
  };

  SkillCheck.prototype._bindKey = function () {
    var self    = this;
    this.handler = function (e) {
      if (!self.inputs.includes(e.code)) return;
      cancelAnimationFrame(self.rafId);
      window.removeEventListener('keydown', self.handler);
      self.handler = null;

      var inZone = self.angle >= self.zoneStart && self.angle <= self.zoneStart + self.zoneSize;
      if (inZone) {
        self._flashResult(true);
        setTimeout(function () { self._nextChallenge(); }, 300);
      } else {
        self._flashResult(false);
        setTimeout(function () { self._finish(false); }, 400);
      }
    };
    window.addEventListener('keydown', this.handler);
  };

  SkillCheck.prototype._flashResult = function (success) {
    var needle = document.getElementById('spz-sc-needle');
    var zone   = document.getElementById('spz-sc-zone');
    var color  = success ? '#22c55e' : '#ef4444';
    if (needle) needle.setAttribute('stroke', color);
    if (zone)   zone.setAttribute('stroke', color);
  };

  SkillCheck.prototype._finish = function (success) {
    cancelAnimationFrame(this.rafId);
    if (this.handler) {
      window.removeEventListener('keydown', this.handler);
      this.handler = null;
    }
    this.el.classList.remove('spz-skillcheck--visible');
    this.el.innerHTML = '';
    fetchNUI('spz:skillcheck:result', { success: success });
  };

  SkillCheck.prototype.cancel = function () { this._finish(false); };
  SkillCheck.prototype.isActive = function () { return this.el.classList.contains('spz-skillcheck--visible'); };

  // ── Bootstrap ─────────────────────────────────────────────────────────────────
  var notifications = new Notifications();
  var textUI        = new TextUI();
  var progress      = new Progress();
  var alert         = new Alert();
  var dialog        = new Dialog();
  var menu          = new Menu();
  var context       = new Context();
  var radial        = new Radial();
  var skillCheck    = new SkillCheck();

  window.addEventListener('message', function (ev) {
    var action = ev.data && ev.data.action;
    var data   = ev.data && ev.data.data;
    if (!action) return;

    switch (action) {
      case 'spz:notify':            notifications.show(data);   break;
      case 'spz:textui:show':       textUI.show(data);          break;
      case 'spz:textui:hide':       textUI.hide();              break;
      case 'spz:progress:show':     progress.show(data);        break;
      case 'spz:progress:cancel':   progress.cancel();          break;
      case 'spz:alert:show':        alert.show(data);           break;
      case 'spz:alert:close':       alert.close();              break;
      case 'spz:dialog:show':       dialog.show(data);          break;
      case 'spz:dialog:close':      dialog.close();             break;
      case 'spz:menu:show':         menu.show(data);            break;
      case 'spz:menu:hide':         menu.hide();                break;
      case 'spz:context:show':      context.show(data);         break;
      case 'spz:context:hide':      context.hide();             break;
      case 'spz:radial:show':        radial.show(data);                         break;
      case 'spz:radial:hide':        radial.hide();                             break;
      case 'spz:radial:update':      radial.update(data);                       break;
      case 'spz:radial:registerSub': radial.registerSub(data.id, data.items);   break;
      case 'spz:skillcheck:start':  skillCheck.start(data);     break;
    }
  });

})();

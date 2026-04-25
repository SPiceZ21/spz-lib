/**
 * SPZ-Lib UI — NUI entry point
 * Bootstraps all modules and routes window messages to the correct handler.
 */

import { Notifications } from './notifications';
import { TextUI }        from './textui';
import { Progress }      from './progress';
import { Alert }         from './alert';
import { Dialog }        from './dialog';
import { Menu }          from './menu';
import { Context }       from './context';
import { Radial }        from './radial';
import { SkillCheck }    from './skillcheck';

export const fetchNUI = (event: string, data?: unknown): Promise<Response> =>
  fetch(`https://${GetParentResourceName()}/${event}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data ?? {}),
  });

declare function GetParentResourceName(): string;

// ── Module singletons ─────────────────────────────────────────────────────────
const notifications = new Notifications();
const textUI        = new TextUI();
const progress      = new Progress();
const alert         = new Alert();
const dialog        = new Dialog();
const menu          = new Menu();
const context       = new Context();
const radial        = new Radial();
const skillCheck    = new SkillCheck();

// ── Message router ────────────────────────────────────────────────────────────
window.addEventListener('message', (ev: MessageEvent) => {
  const { action, data } = ev.data as { action: string; data: unknown };
  if (!action) return;

  switch (action) {
    // Notifications
    case 'spz:notify':
      notifications.show(data as Parameters<Notifications['show']>[0]);
      break;

    // TextUI
    case 'spz:textui:show':
      textUI.show(data as Parameters<TextUI['show']>[0]);
      break;
    case 'spz:textui:hide':
      textUI.hide();
      break;

    // Progress
    case 'spz:progress:show':
      progress.show(data as Parameters<Progress['show']>[0]);
      break;
    case 'spz:progress:cancel':
      progress.cancel();
      break;

    // Alert
    case 'spz:alert:show':
      alert.show(data as Parameters<Alert['show']>[0]);
      break;
    case 'spz:alert:close':
      alert.close();
      break;

    // Dialog (input)
    case 'spz:dialog:show':
      dialog.show(data as Parameters<Dialog['show']>[0]);
      break;
    case 'spz:dialog:close':
      dialog.close();
      break;

    // Menu
    case 'spz:menu:show':
      menu.show(data as Parameters<Menu['show']>[0]);
      break;
    case 'spz:menu:hide':
      menu.hide();
      break;

    // Context
    case 'spz:context:show':
      context.show(data as Parameters<Context['show']>[0]);
      break;
    case 'spz:context:hide':
      context.hide();
      break;

    // Radial
    case 'spz:radial:show':
      radial.show(data as Parameters<Radial['show']>[0]);
      break;
    case 'spz:radial:hide':
      radial.hide();
      break;
    case 'spz:radial:update':
      radial.update(data as Parameters<Radial['update']>[0]);
      break;

    // SkillCheck
    case 'spz:skillcheck:start':
      skillCheck.start(data as Parameters<SkillCheck['start']>[0]);
      break;
  }
});

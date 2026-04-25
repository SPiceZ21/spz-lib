fx_version 'cerulean'
game 'gta5'

name 'spz-lib'
description 'SPiceZ-Core — Shared utility library'
version '1.0.0'
author 'SPiceZ-Core'

-- NUI page (UI branch)
ui_page 'web/index.html'

files {
  'web/index.html',
  'web/bundle.js',
}

shared_scripts {
  'init.lua',           -- lib global table
  'config.lua',
  'shared/main.lua',
  'shared/callbacks.lua',
  'shared/notify.lua',
  'shared/timer.lua',
  'shared/logger.lua',
  'shared/math.lua',
  'shared/table.lua',
  'shared/string.lua',
}

client_scripts {
  -- UI exports (client-only NUI wrappers)
  'client/ui/notify.lua',
  'client/ui/textui.lua',
  'client/ui/progress.lua',
  'client/ui/alert.lua',
  'client/ui/dialog.lua',
  'client/ui/menu.lua',
  'client/ui/context.lua',
  'client/ui/radial.lua',
  'client/ui/skillcheck.lua',
  -- Core client utilities
  'client/callbacks.lua',
}

dependencies {
  'oxmysql',
}

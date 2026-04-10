fx_version 'cerulean'
game 'gta5'

name 'spz-lib'
description 'SPiceZ-Core — Shared utility library'
version '1.0.0'
author 'SPiceZ-Core'

shared_scripts {
  'shared/main.lua',
  'shared/callbacks.lua',
  'shared/notify.lua',
  'shared/timer.lua',
  'shared/logger.lua',
  'shared/math.lua',
  'shared/table.lua',
  'shared/string.lua',
}

dependencies {
  'oxmysql',
}

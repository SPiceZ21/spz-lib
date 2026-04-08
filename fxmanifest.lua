fx_version 'cerulean'
game 'gta5'

description 'spz-lib — Shared Utility Library'
version '1.0.0'

shared_scripts {
    'config.lua',
    'shared/main.lua',
    'shared/callbacks.lua',
    'shared/notify.lua',
    'shared/timer.lua',
    'shared/logger.lua',
    'shared/math.lua',
    'shared/table.lua',
    'shared/string.lua'
}

client_scripts {
    'client/callbacks.lua'
}

exports {
    'GetVersion',
    'SetLogLevel'
}

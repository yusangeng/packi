import { info } from '../print'

const helpeInformation = `
Usage: pki <command> <...parameters>

where <command> is one of:
    help: Get help information.
    add: Add a github repo as project template.
    init: Initialize project in an empty folder.

Example:
    pki add tslib https://github.com/yusangeng/packi-template-tslib
    pki init tslib foobar
`

export default function help() : number {
  info(helpeInformation)

  return 0
}
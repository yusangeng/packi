import fs from 'fs'
import path from 'path'
import fileExists from 'file-exists'
import userHome from 'user-home'

type GlobalData = {
  [name: string]: any,
  templates: {
    [name: string]: string
  }
}

const globalDataFilename = path.resolve(userHome, './.packi.json')

if (!fileExists.sync(globalDataFilename)) {
  write({
    templates: {
      tslib: 'http://github.com/yusangeng/packi-template-tslib/archive/master.zip'
    }
  })
}

export function read () : GlobalData {
  const data = JSON.parse(fs.readFileSync(globalDataFilename, { encoding: 'utf8' }))
  return data as GlobalData
}

export function write (data: GlobalData) : void {
  fs.writeFileSync(globalDataFilename, JSON.stringify(data, null, 2), { encoding: 'utf8' })
}
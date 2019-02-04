import path from 'path'
import { printPackageInfo, info, error } from "./print"

const actionPath = path.resolve(__dirname, './actions')

export default class App {
  appArgs: string[]
  cwd: string
  command: string

  constructor (args: string[], cwd: string) {
    this.appArgs = args.slice(2)
    this.cwd = cwd
    this.command = this.appArgs[0]

    printPackageInfo()
  }

  async run () : Promise<number> {
    const { command } = this
    let cammandAction = null

    try {
      const libPath = `${actionPath}/${command}`

      cammandAction = require(libPath).default

      if (typeof cammandAction !== 'function') {
        error(`Bad command: ${command}.`)
        return 1
      }
    } catch (err) {
      if (!cammandAction) {
        error(`Can NOT find action: "${command}", error message: ${err.message}.`)
        error(`Please execute "pki help" for help.`)
        return 1
      }

      error(err.message)
      return 1
    }

    let retCode = 0

    try {
      retCode = await cammandAction(this.cwd, ...this.appArgs)
    } catch (err) {
      error(err.message)
      retCode = 1
    }

    return retCode
  }
}

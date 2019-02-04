import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

export function printPackageInfo () : void {
  const pack = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), {
    encoding: 'utf8'
  }))

  const { name, version } = pack
  const t = `>>>>---- ${name} - ${version} ----<<<<\n`

  console.log('\n')
  info(t)
}

export function debugLine (text: string) : void {
  console.log(`packi ${chalk.bgHex('#563F2E')(' DEBG ')}  ${text}`)
}

export function infoLine (text: string) : void {
  console.log(`packi ${chalk.bgHex('#6F3381')(' INFO ')}  ${text}`)
}

export function warnLine (text: string) : void {
  console.log(`packi ${chalk.bgHex('#CA7A2C')(' WARN ')}  ${text}`)
}

export function errorLine (text: string) : void {
  console.log(`packi ${chalk.bgHex('#E83015')(' ERRO ')}  ${text}`)
}

export function printLines (text: string, fn: (text: string) => void) : void {
  const lines = text.split('\n')

  if (lines.length === 1) {
    fn(text)
    return
  }

  lines.forEach(line => fn(line))
}

export function debug (text: string) : void {
  printLines(text, debugLine)
}

export function info (text: string) : void {
  printLines(text, infoLine)
}

export function warn (text: string) : void {
  printLines(text, warnLine)
}

export function error (text: string) : void {
  printLines(text, errorLine)
}
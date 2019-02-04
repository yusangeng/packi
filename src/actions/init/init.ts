import fs from 'fs'
import path from 'path'
import rm from 'rimraf'
import { promisify } from 'es6-promisify'
import { info, error } from '../../print'
import { read } from '../../globalData'
import downloadTemplate from './downloadTemplate'
import execEJS from './execEJS'

function isPathEmpty (path: string) : boolean {
  const files = fs.readdirSync(path)
  return files.length === 0
}

export default async function init (cwd: string, appName: string,
  templateName: string, projectName: string) : Promise<number> {
  if (!isPathEmpty(cwd)) {
    error('Current working directory is NOT empty.')
    return 1
  }

  const data = read()
  const { templates } = data

  const url = templates[templateName]

  if (!url) {
    error(`Bad template name: ${templateName}.`)
    error(`Please execute "pki help" for help.`)
    return 1
  }

  info(`Template URL: ${url}`)

  projectName = projectName || path.basename(cwd)
  info(`Project name: ${projectName}`)
  
  const tempDir = await downloadTemplate(cwd, url)

  info(`Deleting temperate files...`)
  rm.sync(tempDir)

  await execEJS(cwd, projectName)

  return 0
}


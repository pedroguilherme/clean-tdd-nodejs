import { Express, Router } from 'express'
import { readdirSync, lstatSync } from 'fs'
import { join } from 'path'

const isValidRouteFile = (file: string): boolean => {
  return !file.endsWith('.map') && !file.endsWith('.test.ts')
}

const importValidRoutesFile = (pathDir: string, router: Router): void => {
  readdirSync(pathDir).map(async file => {
    if (isValidRouteFile(file)) {
      (await import(join(pathDir, file))).default(router)
    }
  })
}

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(join(__dirname, '../routes')).map(async dir => {
    const pathDir = join(__dirname, '../routes', dir)
    if (lstatSync(pathDir).isDirectory()) {
      importValidRoutesFile(pathDir, router)
    }
  })
}

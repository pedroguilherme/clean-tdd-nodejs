import { Router } from 'express'
import { makeSignUpController } from '../fatories/signup/signup-factory'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
}

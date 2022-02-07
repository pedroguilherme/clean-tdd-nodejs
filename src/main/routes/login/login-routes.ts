import { Router } from 'express'
import { makeSignUpController } from '../../fatories/signup/signup-factory'
import { expressRouteAdapter } from '../../adapters/express/express-route-adapter'
import { makeLoginController } from '../../fatories/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
  router.post('/login', expressRouteAdapter(makeLoginController()))
}

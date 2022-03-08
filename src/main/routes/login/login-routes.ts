import { Router } from 'express'
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-controller-factory'
import { expressRouteAdapter } from '@/main/adapters/express-route-adapter'
import { makeLoginController } from '@/main/factories/controllers/login/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
  router.post('/login', expressRouteAdapter(makeLoginController()))
}

import { Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { makeDbLoadAccountByToken } from '@/main/factories//usecases/account/load-account-by-token/db-load-account-by-token-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return makeLogControllerDecorator(new AuthMiddleware(makeDbLoadAccountByToken(), role))
}

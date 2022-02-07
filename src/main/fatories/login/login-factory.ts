import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../presentation/controller/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt/jwt-adapter'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'

export const makeLoginController = (): Controller => {
  const salt = 12
  const secret = 'secret_key'
  const hashCompare = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(secret)
  const accountRepository = new AccountMongoRepository()
  const authentication = new DbAuthentication(accountRepository, hashCompare, encrypter, accountRepository)
  const loginController = new LoginController(makeLoginValidation(), authentication)
  const logRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logRepository)
}

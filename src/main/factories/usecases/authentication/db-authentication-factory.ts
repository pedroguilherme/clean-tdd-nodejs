import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { makeBcryptAdapter } from '../../adapters/bcrypt-adapter-factory'
import { makeJwtAdapter } from '../../adapters/jwt-adapter-factory'
import { makeAccountMongoRepository } from '../../repository/account-mongo-repository-factory'

export const makeDbAuthentication = (): DbAuthentication => {
  const accountRepository = makeAccountMongoRepository()
  return new DbAuthentication(
    accountRepository,
    makeBcryptAdapter(),
    makeJwtAdapter(),
    accountRepository
  )
}

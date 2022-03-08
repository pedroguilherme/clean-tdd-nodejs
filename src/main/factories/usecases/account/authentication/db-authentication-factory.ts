import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication'
import { makeBcryptAdapter } from '@/main/factories/adapters/bcrypt-adapter-factory'
import { makeJwtAdapter } from '@/main/factories/adapters/jwt-adapter-factory'
import { makeAccountMongoRepository } from '@/main/factories/repository/account-mongo-repository-factory'

export const makeDbAuthentication = (): DbAuthentication => {
  const accountRepository = makeAccountMongoRepository()
  return new DbAuthentication(
    accountRepository,
    makeBcryptAdapter(),
    makeJwtAdapter(),
    accountRepository
  )
}

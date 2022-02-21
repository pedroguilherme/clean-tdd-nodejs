import { DbAddAccount } from '../../../../../data/usecases/account/add-account/db-add-account'
import { makeBcryptAdapter } from '../../../adapters/bcrypt-adapter-factory'
import { makeAccountMongoRepository } from '../../../repository/account-mongo-repository-factory'

export const makeDbAddAccount = (): DbAddAccount => {
  const accountMongoRepository = makeAccountMongoRepository()
  return new DbAddAccount(makeBcryptAdapter(), accountMongoRepository, accountMongoRepository)
}

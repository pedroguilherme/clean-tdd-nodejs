import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account'
import { makeBcryptAdapter } from '../../adapters/bcrypt-adapter-factory'
import { makeAccountMongoRepository } from '../../repository/account-mongo-repository-factory'

export const makeDbAddAccount = (): DbAddAccount => {
  return new DbAddAccount(makeBcryptAdapter(), makeAccountMongoRepository())
}

import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { makeBcryptAdapter } from '@/main/factories/adapters/bcrypt-adapter-factory'
import { makeAccountMongoRepository } from '@/main/factories/repository/account-mongo-repository-factory'

export const makeDbAddAccount = (): DbAddAccount => {
  const accountMongoRepository = makeAccountMongoRepository()
  return new DbAddAccount(makeBcryptAdapter(), accountMongoRepository, accountMongoRepository)
}

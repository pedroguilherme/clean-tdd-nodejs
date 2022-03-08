import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeAccountMongoRepository = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

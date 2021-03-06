import { makeAccountMongoRepository } from '@/main/factories/repository/account-mongo-repository-factory'
import { makeJwtAdapter } from '@/main/factories/adapters/jwt-adapter-factory'
import {
  DbLoadAccountByToken
} from '@/data/usecases/account/load-account-by-token/db-load-account-by-token'

export const makeDbLoadAccountByToken = (): DbLoadAccountByToken => {
  return new DbLoadAccountByToken(makeJwtAdapter(), makeAccountMongoRepository())
}

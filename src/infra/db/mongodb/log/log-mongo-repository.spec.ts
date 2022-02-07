import { MongoHelper } from '../helpers/mongodb'
import { ServerError } from '../../../../presentation/errors'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log-mongo-repository'

describe('Log Mongo Repository', function () {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError(new ServerError('any_stack'))
    const errorSave = await errorCollection.countDocuments()
    expect(errorSave).toBe(1)
  })
})

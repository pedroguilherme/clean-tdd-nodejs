import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb'

export class LogMongoRepository implements LogErrorRepository {
  async logError (error: Error): Promise<void> {
    const errors = await MongoHelper.getCollection('errors')
    await errors.insertOne({
      name: error.name,
      message: error.message,
      stack: error.stack,
      created_at: new Date()
    })
  }
}

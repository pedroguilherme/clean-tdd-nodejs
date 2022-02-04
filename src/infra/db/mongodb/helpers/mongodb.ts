import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,

  async connect (uri: string) {
    this.client = await MongoClient
      .connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
}

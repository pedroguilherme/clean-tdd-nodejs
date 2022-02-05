import { MongoClient, Collection, WithId, Document } from 'mongodb'

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
  },

  map (collection: WithId<Document>): any {
    const { _id, ...collectionWithouId } = collection
    return Object.assign({}, collectionWithouId, { id: _id.toString() })
  }
}

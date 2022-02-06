import { MongoClient, Collection, WithId, Document } from 'mongodb'

export const MongoHelper = {
  uri: '' as string,
  client: null as MongoClient | null,

  async connect (uri: string) {
    if (this.isConnected()) {
      await this.disconnect()
    }
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client?.close()
    this.client = null
  },

  isConnected (): boolean {
    return this.client !== null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map (collection: WithId<Document>): any {
    const { _id, ...collectionWithouId } = collection
    return Object.assign({}, collectionWithouId, { id: _id.toString() })
  }
}

import { MongoHelper as sut } from './mongodb'

describe('Mongo Helper', function () {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('should reconect if mongodb is down', async function () {
    let accoutCollection = sut.getCollection('accounts')
    expect(accoutCollection).toBeTruthy()
    await sut.disconnect()
    accoutCollection = sut.getCollection('accounts')
    expect(accoutCollection).toBeTruthy()
  })

  it('should return true if connected', async function () {
    await sut.connect(process.env.MONGO_URL ?? '')
    expect(sut.isConnected()).toBe(true)
  })
})

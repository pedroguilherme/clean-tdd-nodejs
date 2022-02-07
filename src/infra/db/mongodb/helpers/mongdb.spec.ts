import { MongoHelper as sut } from './mongodb'

describe('Mongo Helper', function () {
  beforeEach(async () => {
    await sut.connect(process.env.MONGO_URL ?? '')
  })

  afterEach(async () => {
    await sut.disconnect()
  })

  test('should reconect if mongodb is down', async function () {
    let accoutCollection = await sut.getCollection('accounts')
    expect(accoutCollection).toBeTruthy()
    await sut.disconnect()
    accoutCollection = await sut.getCollection('accounts')
    expect(accoutCollection).toBeTruthy()
  })

  test('should return true if connected', async function () {
    expect(sut.isConnected()).toBe(true)
  })
})

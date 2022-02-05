import supertest from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongodb'

describe('SignUp Routes', function () {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await supertest(app)
      .post('/api/signup')
      .send({
        name: 'Pedro',
        email: 'pedro@teste.com.br',
        password: '12345',
        passwordConfirmation: '12345'
      })
      .expect(201)
  })
})

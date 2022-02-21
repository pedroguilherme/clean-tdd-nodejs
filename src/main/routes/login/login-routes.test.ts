import supertest from 'supertest'
import app from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongodb'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import env from '../../config/env'

describe('Login Routes', function () {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST / signup', function () {
    test('Should return 201 on signup', async () => {
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

  describe('POST / login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', env.salt)
      await accountCollection.insertOne({
        name: 'Pedro',
        email: 'pedro@teste.com.br',
        password: password
      })

      await supertest(app)
        .post('/api/login')
        .send({
          email: 'pedro@teste.com.br',
          password: '123'
        })
        .expect(200)
    })
    test('Should return 401 on login fails', async () => {
      await supertest(app)
        .post('/api/login')
        .send({
          email: 'pedro@teste.com.br',
          password: '123'
        })
        .expect(401)
    })
  })
})

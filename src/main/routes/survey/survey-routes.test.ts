import supertest from 'supertest'
import app from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongodb'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '../../config/env'

describe('Survey Routes', function () {
  let surveyCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('POST / surveys', function () {
    test('Should return 403 if no accessToken is provided', async () => {
      await supertest(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image-typescript.testing',
            answer: 'any_answer'
          }, {
            image: 'http://image-php.testing',
            answer: 'any_answer_2'
          }]
        })
        .expect(403)
    })
    test('Should return 204 with valid token is provided', async () => {
      const password = await hash('123', env.salt)
      const account = await accountCollection.insertOne({
        name: 'Pedro',
        email: 'pedro@teste.com.br',
        password: password,
        role: 'admin'
      })

      const accessToken = sign(account.insertedId.toString(), env.jwtSecret)
      await accountCollection.updateOne({ _id: account.insertedId }, { $set: { accessToken } })

      await supertest(app)
        .post('/api/surveys')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image-typescript.testing',
            answer: 'any_answer'
          }, {
            image: 'http://image-php.testing',
            answer: 'any_answer_2'
          }]
        })
        .expect(204)
    })
  })
  describe('GET / surveys', function () {
    test('Should return 403 on load if no accessToken is provided', async () => {
      await supertest(app)
        .get('/api/surveys')
        .expect(403)
    })
  })
})

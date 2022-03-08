import supertest from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import app from '@/main/config/app'
import env from '@/main/config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (role?: string): Promise<string> => {
  const password = await hash('123', env.salt)

  const user: any = {
    name: 'Pedro',
    email: 'pedro@teste.com.br',
    password: password
  }

  if (role) {
    user.role = role
  }

  const account = await accountCollection.insertOne(user)

  const accessToken = sign(account.insertedId.toString(), env.jwtSecret)
  await accountCollection.updateOne({ _id: account.insertedId }, { $set: { accessToken } })

  return accessToken
}

describe('Survey Routes', function () {
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
    it('Should return 403 if no accessToken is provided', async () => {
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
    it('Should return 204 with valid token is provided', async () => {
      const accessToken = await makeAccessToken('admin')

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
    it('Should return 403 on load if no accessToken is provided', async () => {
      await supertest(app)
        .get('/api/surveys')
        .expect(403)
    })
    it('Should return 200 with valid token is provided', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          image: 'http://image-typescript.testing',
          answer: 'any_answer'
        }]
      })

      await supertest(app)
        .get('/api/surveys')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(res => {
          expect(res.status).toBe(200)
          expect(res.body[0].question).toBe('Question')
        })
    })
  })
})

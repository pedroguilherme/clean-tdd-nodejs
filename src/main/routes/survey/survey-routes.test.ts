import supertest from 'supertest'
import app from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongodb'
import { Collection } from 'mongodb'

describe('Survey Routes', function () {
  let surveyCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  describe('POST / surveys', function () {
    test('Should return 204 on survey', async () => {
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
        .expect(204)
    })
  })
})

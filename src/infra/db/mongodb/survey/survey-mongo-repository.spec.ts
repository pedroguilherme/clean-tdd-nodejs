import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeFakeAddSurveyModel = (): AddSurveyModel => ({
  question: 'any_question',
  date: new Date(),
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'other_answer'
    }
  ]
})

describe('Account Mongo Repository', function () {
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

  test('Should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add(makeFakeAddSurveyModel())
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })

  test('Should load all surveys on success', async () => {
    await surveyCollection.insertMany([
      {
        question: 'any_question',
        date: new Date(),
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ]
      },
      {
        question: 'other_question',
        date: new Date(),
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ]
      }
    ])
    const sut = makeSut()
    const surveys = await sut.loadAll()
    expect(surveys.length).toBe(2)
    expect(surveys[0].question).toBe('any_question')
    expect(surveys[1].question).toBe('other_question')
  })

  test('Should load empty list', async () => {
    const sut = makeSut()
    const surveys = await sut.loadAll()
    expect(surveys.length).toBe(0)
  })
})

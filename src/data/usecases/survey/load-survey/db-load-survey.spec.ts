import { LoadSurvey } from '../../../../domain/usecases/survey/load-survey'
import { LoadSurveyRepository } from '../../../protocols/db/survey/load-survey-repository'
import { DbLoadSurvey } from './db-load-survey'
import { SurveyModel } from '../../../../domain/models/survey'

interface SutTypes {
  sut: LoadSurvey
  loadSurveyRepositoryStub: LoadSurveyRepository
}

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      date: new Date(),
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  ]
}

const makeLoadSurveyRepository = (): LoadSurveyRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }

  return new LoadSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyRepository()
  const sut = new DbLoadSurvey(loadSurveyRepositoryStub)
  return {
    sut,
    loadSurveyRepositoryStub
  }
}

describe('Db LoadSurvey', function () {
  it('should call LoadSurveyRepository one time', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalledTimes(1)
  })
})

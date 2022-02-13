import { SurveyMongoRepository } from '../../../infra/db/mongodb/survey/survey-mongo-repository'
import { AddSurveyRepository } from '../../../data/protocols/db/survey/add-survey-repository'

export const makeSurveyMongoRepository = (): AddSurveyRepository => {
  return new SurveyMongoRepository()
}

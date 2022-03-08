import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeSurveyMongoRepository = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

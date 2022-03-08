import { makeSurveyMongoRepository } from '@/main/factories/repository/survey-mongo-repository-factory'
import { DbLoadSurvey } from '@/data/usecases/survey/load-survey/db-load-survey'
import { LoadSurvey } from '@/domain/usecases/survey/load-survey'

export const makeDbLoadSurvey = (): LoadSurvey => {
  const surveyRepository = makeSurveyMongoRepository()
  return new DbLoadSurvey(surveyRepository)
}

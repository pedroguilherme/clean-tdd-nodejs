import { AddSurvey } from '../../../../domain/usecases/add-survey'
import { DbAddSurvey } from '../../../../data/usecases/add-survey/db-add-survey'
import { makeSurveyMongoRepository } from '../../repository/survey-mongo-repository-factory'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyRepository = makeSurveyMongoRepository()
  return new DbAddSurvey(
    surveyRepository
  )
}

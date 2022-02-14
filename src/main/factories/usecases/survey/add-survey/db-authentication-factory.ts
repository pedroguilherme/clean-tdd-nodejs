import { AddSurvey } from '../../../../../domain/usecases/survey/add-survey'
import { DbAddSurvey } from '../../../../../data/usecases/survey/add-survey/db-add-survey'
import { makeSurveyMongoRepository } from '../../../repository/survey-mongo-repository-factory'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyRepository = makeSurveyMongoRepository()
  return new DbAddSurvey(
    surveyRepository
  )
}

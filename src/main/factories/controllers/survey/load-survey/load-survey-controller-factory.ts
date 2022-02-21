import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { Controller } from '../../../../../presentation/protocols'
import { LoadSurveyController } from '../../../../../presentation/controller/survey/load-survey/load-survey-controller'
import { makeDbLoadSurvey } from '../../../usecases/survey/db-load-survey-factory'

export const makeLoadSurveyController = (): Controller => {
  return makeLogControllerDecorator(new LoadSurveyController(makeDbLoadSurvey()))
}

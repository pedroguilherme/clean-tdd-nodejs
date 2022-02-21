import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from '../../../usecases/survey/db-add-survey-factory'
import { Controller } from '../../../../../presentation/protocols'
import { AddSurveyController } from '../../../../../presentation/controller/survey/add-survey/add-survey-controller'

export const makeAddSurveyController = (): Controller => {
  return makeLogControllerDecorator(new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey()))
}

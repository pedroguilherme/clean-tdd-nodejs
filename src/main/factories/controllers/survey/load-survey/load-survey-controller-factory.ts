import { makeLogControllerDecorator } from '@/main/factories//decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { LoadSurveyController } from '@/presentation/controller/survey/load-survey/load-survey-controller'
import { makeDbLoadSurvey } from '@/main/factories//usecases/survey/db-load-survey-factory'

export const makeLoadSurveyController = (): Controller => {
  return makeLogControllerDecorator(new LoadSurveyController(makeDbLoadSurvey()))
}

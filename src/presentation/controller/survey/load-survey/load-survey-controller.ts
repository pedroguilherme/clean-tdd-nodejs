import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { ok } from '../../../helpers/http/http'
import { LoadSurvey } from '../../../../domain/usecases/survey/load-survey'

export class LoadSurveyController implements Controller {
  constructor (
    private readonly loadSurvey: LoadSurvey
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurvey.load()
    return ok({})
  }
}

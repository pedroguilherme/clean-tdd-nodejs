import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { noContent, ok, serverError } from '../../../helpers/http/http'
import { LoadSurvey } from '../../../../domain/usecases/survey/load-survey'

export class LoadSurveyController implements Controller {
  constructor (
    private readonly loadSurvey: LoadSurvey
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()

      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

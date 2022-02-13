import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols'
import { created } from '../../../helpers/http/http'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return await new Promise(resolve => resolve(created({})))
  }
}

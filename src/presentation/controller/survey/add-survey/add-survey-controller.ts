import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols'
import { badRequest, created } from '../../../helpers/http/http'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)

    if (error) {
      return badRequest(error)
    }

    return await new Promise(resolve => resolve(created({})))
  }
}

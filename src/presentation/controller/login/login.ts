import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers/http'
import { MissingParamError } from '../../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const body = httpRequest.body
    for (const key of ['email', 'password']) {
      if (!body[key]) {
        return badRequest(new MissingParamError(key))
      }
    }
    return { statusCode: 0, body: {} }
  }
}

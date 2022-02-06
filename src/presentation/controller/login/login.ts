import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers/http'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const body = httpRequest.body
    for (const key of ['email', 'password']) {
      if (!body[key]) {
        return badRequest(new MissingParamError(key))
      }
    }

    if (!this.emailValidator.isValid(body.email)) {
      return badRequest(new InvalidParamError('email'))
    }

    return { statusCode: 0, body: {} }
  }
}

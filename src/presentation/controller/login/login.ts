import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './authentication-protocols-exp'
import { badRequest, serverError, unauthorizedError } from '../../helpers/http'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const body = httpRequest.body
      for (const key of ['email', 'password']) {
        if (!body[key]) {
          return badRequest(new MissingParamError(key))
        }
      }

      if (!this.emailValidator.isValid(body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const auth = await this.authentication.auth(body.email, body.password)

      if (!auth) {
        return unauthorizedError()
      }

      return { statusCode: 200, body: {} }
    } catch (error) {
      return serverError(error)
    }
  }
}

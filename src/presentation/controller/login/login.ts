import { Controller, HttpRequest, HttpResponse, Authentication } from './authentication-protocols-exp'
import { badRequest, ok, serverError, unauthorizedError } from '../../helpers/http'
import { Validation } from '../../helpers/validators/validation'

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const body = httpRequest.body

      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }

      const accessToken = await this.authentication.auth(body.email, body.password)

      if (!accessToken) {
        return unauthorizedError()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}

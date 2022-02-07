import { Authentication, Controller, HttpRequest, HttpResponse } from './login-controller-protocols-exp'
import { badRequest, ok, serverError, unauthorizedError } from '../../helpers/http/http'
import { Validation } from '../../protocols/validation'

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

      const accessToken = await this.authentication.auth({ email: body.email, password: body.password })

      if (!accessToken) {
        return unauthorizedError()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}

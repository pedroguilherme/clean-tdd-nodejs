import { forbidden, ok, serverError } from '../helpers/http/http'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken, HttpRequest, HttpResponse, Middleware } from './auth-middleware-protocols-exp'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.headers?.Authorization) {
        return forbidden(new AccessDeniedError())
      }

      const accessToken = httpRequest.headers.Authorization
        .replace('Bearer', '')
        .trim()
      const account = await this.loadAccountByToken.load(accessToken, this.role)

      if (!account) {
        return forbidden(new AccessDeniedError())
      }

      return ok({ accountId: account.id })
    } catch (error) {
      return serverError(error)
    }
  }
}

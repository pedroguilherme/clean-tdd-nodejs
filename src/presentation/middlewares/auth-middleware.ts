import { Middleware } from '../protocols/middleware'
import { HttpRequest, HttpResponse } from '../protocols'
import { forbidden, noContent } from '../helpers/http/http'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.headers?.Authorization) {
      return forbidden(new AccessDeniedError())
    }

    const accessToken = httpRequest.headers.Authorization
      .replace('Bearer', '')
      .trim()
    await this.loadAccountByToken.load(accessToken)

    return await new Promise(resolve => resolve(noContent()))
  }
}

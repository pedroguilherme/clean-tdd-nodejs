import { Middleware } from '../protocols/middleware'
import { HttpRequest, HttpResponse } from '../protocols'
import { forbidden } from '../helpers/http/http'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
  }
}

import { forbidden } from '../helpers/http/http'
import { Middleware } from '../protocols/middleware'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'

const makeSut = (): {
  sut: Middleware
} => {
  return {
    sut: new AuthMiddleware()
  }
}

describe('Auth Middleware', function () {
  it('should return 403 if no Authorization: Bearer exist in headers', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})

import { forbidden, ok } from '../helpers/http/http'
import { Middleware } from '../protocols/middleware'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from '../protocols'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {
    Authorization: 'Bearer any_token'
  }
})

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email',
  name: 'valid_name',
  password: 'hashed_password'
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string): Promise<AccountModel | null> {
      return await new Promise(resolve => resolve(makeFakeAccountModel()))
    }
  }

  return new LoadAccountByTokenStub()
}

interface SutTypes {
  sut: Middleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', function () {
  it('should return 403 if no Authorization: Bearer exist in headers', async function () {
    const { sut } = makeSut()
    let httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    httpResponse = await sut.handle({ headers: {} })
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('should call LoadAccountByToken with correct accessToken', async function () {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
  it('should return 403 if LoadAccountByToken returns null', async function () {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('should return 200 if LoadAccountByToken returns an account', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })
})

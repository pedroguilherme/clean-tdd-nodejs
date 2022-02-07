import { LoginController } from './login'
import { Controller, HttpRequest, Authentication, AuthenticationModel } from './authentication-protocols-exp'
import { badRequest, ok, serverError, unauthorizedError } from '../../helpers/http/http'
import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

const makeHttpRequest = (modelo: any): HttpRequest => ({
  body: {
    email: modelo.param === 'email' ? '' : (modelo.email ?? 'any_email@email.com'),
    password: modelo.param === 'password' ? '' : (modelo.password ?? 'any_password')
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise<string>(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

const makeSut = (): {
  sut: Controller
  validationStub: Validation
  authenticationStub: Authentication
} => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    validationStub,
    authenticationStub
  }
}

describe('Login Controller', function () {
  it('should call Authentication with correct values', async function () {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeHttpRequest({})
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({ email: httpRequest.body.email, password: httpRequest.body.password })
  })
  it('should return 401 if invalid credential are provided ', async function () {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpRequest = makeHttpRequest({})
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorizedError())
  })
  it('should return 500 if Authentication throws', async function () {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const httpResponse = await sut.handle((makeHttpRequest({})))
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('should return 200 if valid credential are provide ', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.handle((makeHttpRequest({})))
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest({})
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeHttpRequest({}))
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})

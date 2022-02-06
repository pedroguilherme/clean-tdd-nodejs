import { LoginController } from './login'
import { Controller, HttpRequest, EmailValidator, Authentication } from './authentication-protocols-exp'
import { badRequest, serverError, unauthorizedError } from '../../helpers/http'
import { InvalidParamError, MissingParamError } from '../../errors'

const makeHttpRequest = (modelo: any): HttpRequest => ({
  body: {
    email: modelo.param === 'email' ? '' : (modelo.email ?? 'any_email@email.com'),
    password: modelo.param === 'password' ? '' : (modelo.password ?? 'any_password')
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise<string>(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

const makeSut = (): {
  sut: Controller
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
} => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', function () {
  it('should return 400 if no email is provided', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest({ param: 'email' }))
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  it('should return 400 if no password is provided', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.handle((makeHttpRequest({ param: 'password' })))
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  it('should call email validator if correct email', async function () {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle((makeHttpRequest({})))
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
  it('should return 400 if as invalid email is provided', async function () {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)
    const httpResponse = await sut.handle((makeHttpRequest({})))
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  it('should return 500 if EmailValidator throws', async function () {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const httpResponse = await sut.handle((makeHttpRequest({})))
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('should call Authentication with correct values', async function () {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeHttpRequest({})
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })
  it('should return 401 if invalid credential are provided ', async function () {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpRequest = makeHttpRequest({})
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorizedError())
  })
})

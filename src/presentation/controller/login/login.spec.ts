import { LoginController } from './login'
import { Controller, HttpRequest } from '../../protocols'
import { badRequest, serverError } from '../../helpers/http'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

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

const makeSut = (): {
  sut: Controller
  emailValidatorStub: EmailValidator
} => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
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
})

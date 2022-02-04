import { faker } from '@faker-js/faker'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { AccountModel, AddAccount, AddAccountModel, EmailValidator, SignUp } from './signup-protocols'
import { SignUpController } from './signup'

const makeBody = (modelo: {
  param?: string
  name?: string
  email?: string
  password?: string
  passwordConfirmation?: string
}): SignUp => {
  const password = faker.internet.password()
  return {
    name: modelo.param === 'name' ? '' : (modelo.name ?? faker.name.firstName()),
    email: modelo.param === 'email' ? '' : (modelo.email ?? faker.internet.email()),
    password: modelo.param === 'password' ? '' : (modelo.password ?? password),
    passwordConfirmation: modelo.param === 'passwordConfirmation' ? '' : (modelo.passwordConfirmation ?? password)
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      return {
        id: 1,
        name: account.name,
        email: account.email,
        password: account.password
      }
    }
  }
  return new AddAccountStub()
}

const makeSut = (): {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
} => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', function () {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: makeBody({ param: 'name' })
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: makeBody({ param: 'email' })
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: makeBody({ param: 'password' })
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: makeBody({ param: 'passwordConfirmation' })
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: makeBody({ email: 'invalid_email' })
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: makeBody({ email: 'teste@teste.com' })
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('teste@teste.com')
  })

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: makeBody({})
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 400 if password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: makeBody({ passwordConfirmation: 'invalid_password_confirmation' })
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: makeBody({})
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: makeBody({})
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 201 if valid data is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: makeBody({})
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual({
      id: 1,
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })
})

import { MissingParamError, ServerError } from '../../errors'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  HttpResponse,
  Validation
} from './signup-controller-protocols-exp'
import { SignUpController } from './signup-controller'
import { badRequest, serverError } from '../../helpers/http/http'

const makeHttpRequest = (modelo: {
  param?: string
  name?: string
  email?: string
  password?: string
  passwordConfirmation?: string
}): HttpRequest => {
  const password = 'any_password'
  return {
    body: {
      name: modelo.param === 'name' ? '' : (modelo.name ?? 'any_name'),
      email: modelo.param === 'email' ? '' : (modelo.email ?? 'any_email@email.com'),
      password: modelo.param === 'password' ? '' : (modelo.password ?? password),
      passwordConfirmation: modelo.param === 'passwordConfirmation' ? '' : (modelo.passwordConfirmation ?? password)
    }
  }
}

const makeHttpResponse = (modelo: {
  statusCode?: number
  id?: string
  name?: string
  email?: string
  password?: string
}): HttpResponse => {
  return {
    statusCode: modelo.statusCode ?? 200,
    body: {
      id: modelo.id ?? '1',
      name: modelo.name ?? 'any_name',
      email: modelo.email ?? 'any_email@email.com',
      password: modelo.password ?? 'any_password'
    }
  }
}

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: '1',
        name: account.name,
        email: account.email,
        password: account.password
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
} => {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', function () {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeHttpRequest({}))
    const body = makeHttpRequest({}).body
    delete body.passwordConfirmation
    expect(addSpy).toHaveBeenCalledWith(body)
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeHttpRequest({}))
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest({}))
    expect(httpResponse).toEqual(makeHttpResponse({ statusCode: 201 }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest({})
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeHttpRequest({}))
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
import { LoginController } from './login'
import { Controller } from '../../protocols'
import { badRequest } from '../../helpers/http'
import { MissingParamError } from '../../errors'

const makeSut = (): {
  sut: Controller
} => {
  const sut = new LoginController()
  return {
    sut
  }
}

describe('Login Controller', function () {
  it('should return 400 if no email is provided', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        password: 'any_password'
      }
    })
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})

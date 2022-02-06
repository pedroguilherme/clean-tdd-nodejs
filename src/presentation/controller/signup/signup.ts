import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, Validation } from './signup-protocols-exp'
import { InvalidParamError } from '../../errors'
import { badRequest, created, serverError } from '../../helpers/http'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const body = httpRequest.body

      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }

      // Validação do e-mail
      if (!this.emailValidator.isValid(body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name: body.name,
        email: body.email,
        password: body.password
      })

      return created(account)
    } catch (error) {
      return serverError(error)
    }
  }
}

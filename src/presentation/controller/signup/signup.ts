import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from './signup-protocols-exp'
import { badRequest, created, serverError } from '../../helpers/http'

export class SignUpController implements Controller {
  constructor (
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

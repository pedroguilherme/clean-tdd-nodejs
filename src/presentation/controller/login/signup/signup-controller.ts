import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validation,
  Authentication
} from './signup-controller-protocols-exp'
import { badRequest, created, forbidden, serverError } from '../../../helpers/http/http'
import { ParamInUseError } from '../../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
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

      if (!account) {
        return forbidden(new ParamInUseError('email'))
      }

      const accessToken = await this.authentication.auth({
        email: account.email,
        password: body.password
      })

      return created({ ...account, accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}

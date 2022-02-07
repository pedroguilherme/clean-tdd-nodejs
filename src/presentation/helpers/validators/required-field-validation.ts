import { Validation } from '../../protocols/validation'
import { MissingParamError } from '../../errors'

export class RequiredFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string
  ) {
  }

  public validate (input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}

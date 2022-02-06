import { Validation } from './validation'
import { InvalidParamError } from '../../errors'

export class CompareFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {
  }

  public validate (input: any): Error | null {
    if (this.fieldName !== this.fieldToCompareName) {
      return new InvalidParamError(this.fieldToCompareName)
    }
    return null
  }
}

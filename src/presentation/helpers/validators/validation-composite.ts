import { Validation } from '../../protocols/validation'

export class ValidationComposite implements Validation {
  constructor (
    private readonly validation: Validation[]
  ) {
  }

  public validate (input: any): Error | null {
    for (const validation of this.validation) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
    return null
  }
}

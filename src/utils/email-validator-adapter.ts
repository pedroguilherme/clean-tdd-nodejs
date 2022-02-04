import { EmailValidator } from '../presentation/protocols/email-validator'

export class EmailValidatorAdapter implements EmailValidator {
  public isValid (email: string): boolean {
    return false
  }
}

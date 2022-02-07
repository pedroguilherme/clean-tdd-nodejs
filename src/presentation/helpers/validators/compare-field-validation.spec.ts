import { InvalidParamError } from '../../errors'
import { Validation } from './validation'
import { CompareFieldValidation } from './compare-field-validation'

const makeSut = (): Validation => {
  return new CompareFieldValidation('password', 'passwordConfirmation')
}

describe('Compare Field Validation', function () {
  test('Should return error if no correct value is provided', () => {
    const sut = makeSut()
    const error = sut.validate({ password: 'any_password', passwordConfirmation: 'invalid_password' })
    expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  test('Should return null if correct value is provided', () => {
    const sut = makeSut()
    const error = sut.validate({ password: 'any_password', passwordConfirmation: 'any_password' })
    expect(error).toBeNull()
  })
})

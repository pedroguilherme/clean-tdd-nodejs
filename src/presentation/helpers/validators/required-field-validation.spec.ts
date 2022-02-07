import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'
import { Validation } from './validation'

const makeSut = (): Validation => {
  return new RequiredFieldValidation('name')
}

describe('Required Field Validation', function () {
  test('Should return error if no correct value is provided', () => {
    const sut = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('name'))
  })
  test('Should return null if correct value is provided', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toBeNull()
  })
})

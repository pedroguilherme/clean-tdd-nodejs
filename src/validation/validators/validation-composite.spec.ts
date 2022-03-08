import { Validation } from '@/presentation/protocols'
import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '@/presentation/errors'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    public validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): {
  sut: Validation
  validationStubs: Validation[]
} => {
  const validationStubs = [
    makeValidationStub(),
    makeValidationStub()
  ]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', function () {
  test('Should return error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate({ filed: 'any_value' })
    expect(error).toEqual(new Error())
  })
  test('Should return the first error if more then one validation fails ', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError(''))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate({ filed: 'any_value' })
    expect(error).toEqual(new MissingParamError(''))
  })
  test('Should return null if validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toBeNull()
  })
})

import { Controller, HttpRequest, Validation } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    public validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

interface typeSut {
  sut: Controller
  validationStub: Validation
}

const makeSut = (): typeSut => {
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('AddSurvey Controller', function () {
  it('should call Validation with correct values', async function () {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})

import { Controller, HttpRequest, Validation } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest } from '../../../helpers/http/http'

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

  it('should return 400 if Validation fails', async function () {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})

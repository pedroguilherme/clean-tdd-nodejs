import { ValidationComposite, RequiredFieldValidation } from '../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { Validation } from '../../../../presentation/protocols'

jest.mock('../../../../validation/validators/validation-composite')

describe('Survey Validation Factory', function () {
  it('should call ValidationComposite with all validations', function () {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})

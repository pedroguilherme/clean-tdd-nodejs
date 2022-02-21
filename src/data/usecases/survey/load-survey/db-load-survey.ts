import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurvey } from '../../../../domain/usecases/survey/load-survey'
import { LoadSurveyRepository } from '../../../protocols/db/survey/load-survey-repository'

export class DbLoadSurvey implements LoadSurvey {
  constructor (
    private readonly loadSurveyRepository: LoadSurveyRepository
  ) {
  }

  async load (): Promise<SurveyModel[]> {
    return await this.loadSurveyRepository.loadAll()
  }
}

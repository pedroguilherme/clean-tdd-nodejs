import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '../../../../domain/usecases/survey/add-survey'
import { MongoHelper } from '../helpers/mongodb'
import { LoadSurveyRepository } from '../../../../data/protocols/db/survey/load-survey-repository'
import { SurveyModel } from '../../../../domain/models/survey'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository {
  async add (addSurveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.insertOne(addSurveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const surveys = await surveyCollection.find().toArray() as unknown
    return surveys as SurveyModel[]
  }
}

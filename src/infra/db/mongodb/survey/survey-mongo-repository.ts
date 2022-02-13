import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongodb'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (addSurveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.insertOne(addSurveyData)
  }
}

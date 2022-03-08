import { SurveyAnswer } from '@/domain/models/survey'

export interface AddSurveyModel {
  question: string
  date: Date
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add (data: AddSurveyModel): Promise<void>
}

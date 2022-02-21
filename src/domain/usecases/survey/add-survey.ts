export interface AddSurveyModel {
  question: string
  date: Date
  answers: SurveyAnswer[]
}

export interface SurveyAnswer {
  image?: string
  answer: string
}

export interface AddSurvey {
  add (data: AddSurveyModel): Promise<void>
}

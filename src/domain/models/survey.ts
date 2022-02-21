export interface SurveyModel {
  id: string
  question: string
  date: Date
  answers: SurveyAnswer[]
}

export interface SurveyAnswer {
  image?: string
  answer: string
}

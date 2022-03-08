export type SurveyModel = {
  id: string
  question: string
  date: Date
  answers: SurveyAnswer[]
}

export type SurveyAnswer = {
  image?: string
  answer: string
}

export class ParamInUseError extends Error {
  constructor (
    paramName: string
  ) {
    super(`Param already used: ${paramName}`)
    this.name = 'ParamInUseError'
  }
}

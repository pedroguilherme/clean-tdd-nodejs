export interface LogErrorRepository {
  logError(error: Error): Promise<void>
}

import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
import env from '../../../main/config/env'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  },
  verify (): string {
    return 'any_value'
  }
}))

const makeSut = (): JwtAdapter => new JwtAdapter(env.jwtSecret)

describe('Jwt Adapter', function () {
  it('should call sign with correct values ', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, env.jwtSecret)
  })
  it('should return a token on sign success', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })
  it('should JwtAdapter throws if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(
      () => {
        throw new Error()
      }
    )
    const accessToken = sut.encrypt('any_id')
    await expect(accessToken).rejects.toThrow(new Error())
  })
  it('should call verify with correct values', async () => {
    const sut = makeSut()
    const verifySpy = jest.spyOn(jwt, 'verify')
    await sut.decrypt('any_token')
    expect(verifySpy).toHaveBeenCalledWith('any_token', env.jwtSecret)
  })
  it('should return a value on verify success', async () => {
    const sut = makeSut()
    const value = await sut.decrypt('any_token')
    expect(value).toBe('any_value')
  })
})

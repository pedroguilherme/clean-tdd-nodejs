import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) {
  }

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }

  decrypt (value: string): string | null {
    try {
      const verify = jwt.verify(value, this.secret)
      return verify ? verify as string : null
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return null
      }

      throw error
    }
  }
}

import { Hasher } from '../../data/protocols/criptography/hasher'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
  constructor (
    private readonly salt: number
  ) {
  }

  async encrypt (value: string): Promise<string> {
    const hashValue = bcrypt.hash(value, this.salt)
    return await hashValue
  }
}

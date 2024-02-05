import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/utils/constants';

export class hashHelper {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltOrRounds);
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

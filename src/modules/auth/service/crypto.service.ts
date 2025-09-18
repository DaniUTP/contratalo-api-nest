import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly encryptionKey: Buffer;
  private readonly ivLength = 16;

  constructor(private readonly configService: ConfigService) {
    const encryptionKeyFromEnv = this.configService.get<string>('ENCRYPTION_KEY');

    if (!encryptionKeyFromEnv) {
      throw new Error('ENCRYPTION_KEY no está definida en las variables de entorno');
    }

    this.encryptionKey = crypto.scryptSync(
      encryptionKeyFromEnv,
      'salt',
      32
    );
  }

  encrypt(data: any): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher: crypto.CipherGCM = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), 'utf8'),
      cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, encrypted, authTag]).toString('hex');
  }

  decrypt(encryptedData: string): any {
    const buffer = Buffer.from(encryptedData, 'hex');

    const iv = buffer.subarray(0, this.ivLength);
    const encrypted = buffer.subarray(this.ivLength, buffer.length - 16);
    const authTag = buffer.subarray(buffer.length - 16);

    const decipher: crypto.DecipherGCM = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    return JSON.parse(decrypted.toString('utf8'));
  }
}
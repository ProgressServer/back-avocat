import { Injectable } from '@angular/core';
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: 'root'
})
export class SecuriteService {
  private CRYPTO_PASSWORD = 'Zi7BvurRsXnMGMU';
  constructor() { }

  /**
   * Permet de crypter un message
   * @param data | string le message a crypter
   */
  encryptData(data: string): string {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.CRYPTO_PASSWORD).toString();
    } catch (e) {
      return data;
    }
  }

  /**
   * Permet de decrypter un message
   * @param data | string permet de decrypter un message
   */
  decryptData(data: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.CRYPTO_PASSWORD);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      return data;
    }
  }
}

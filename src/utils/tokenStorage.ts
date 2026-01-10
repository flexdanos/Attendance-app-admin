import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'ChurchConnect_2024_SecureKey';

export const encryptToken = (token: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Token encryption failed:', error);
    return token;
  }
};

export const decryptToken = (encryptedToken: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Token decryption failed:', error);
    return encryptedToken;
  }
};

export const setEncryptedToken = (key: string, token: string): void => {
  if (typeof window !== 'undefined') {
    const encrypted = encryptToken(token);
    localStorage.setItem(key, encrypted);
  }
};

export const getDecryptedToken = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decryptToken(encrypted);
  }
  return null;
};

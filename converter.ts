// Error handling version
export class PublicKeyConverter {
    static pemToBase64(pemString: string): string {
        if (!pemString.includes('-----BEGIN PUBLIC KEY-----') ||
            !pemString.includes('-----END PUBLIC KEY-----')) {
            throw new Error('Invalid PEM format: Missing header or footer');
        }

        return pemString
            .replace('-----BEGIN PUBLIC KEY-----', '')
            .replace('-----END PUBLIC KEY-----', '')
            .replace(/\s/g, '');
    }

    static base64ToBytes(base64: string): Uint8Array {
        try {
            const binaryStr: string = atob(base64);
            const bytes: Uint8Array = new Uint8Array(binaryStr.length);

            for (let i = 0; i < binaryStr.length; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
            }

            return bytes;
        } catch (error) {
            throw new Error('Invalid base64 encoding');
        }
    }

    static bytesToBigInt(bytes: Uint8Array): bigint {
        if (bytes.length === 0) {
            throw new Error('Empty byte array');
        }

        try {
            const hexString: string = Array.from(bytes)
                .map((b: number) => b.toString(16).padStart(2, '0'))
                .join('');

            return BigInt('0x' + hexString);
        } catch (error) {
            throw new Error('Failed to convert bytes to BigInt');
        }
    }

    static convert(pemString: string): bigint {
        const base64: string = this.pemToBase64(pemString);
        const bytes: Uint8Array = this.base64ToBytes(base64);
        return this.bytesToBigInt(bytes);
    }
}
import { generateInputs } from "noir-jwt";
import * as fs from "fs"
// import TOML from '@iarna/toml'

const jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTczOTk4ODc1M30.SPbZJJpyk6jqLBRIum_da6rigJFzXG4hrl7bzd7uL__KAbfeJA0hyfur6r9f4ScJWUYA8ogsZDliE-cX3H-Xdm-xqxOoiZHGhk4M7TTzQMr7NyIumMxLC9-WaEFLiCk0laG2ryFkx1JbnAKJGTngmthhazTTJZHYib-7y7MrIH6aVZX6IegEOHtUnqxKOiOYkYtWxhhRf4SgAyZVzXj2xowqJUfo2lWSYZLFuZ7jNuVSi4gXls8WArOIN0UCcHGg1o2PG8StY7sHAu0yVO03bpjZYcrNw26jFKbrHItdO5Qw8sL217ShcFKRwHbJEQZI1poBqJ3m8CgSRxdm5-XDtw"

async function main() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),  // 65537
            hash: 'SHA-256'
        },
        true,  // extractable
        ['sign', 'verify']
    );

    const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    const privateJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
    console.log("\nPublic JWK\n\n", JSON.stringify(publicJwk))
    console.log("\nPrivate JWK\n\n", JSON.stringify(privateJwk), "\n\n")

    const maxSignedDataLength = 128

    const inputs = await generateInputs({
        jwt: jwt,
        pubkey: keyPair.publicKey,
        maxSignedDataLength: maxSignedDataLength,
    });

    // const tomlString = TOML.stringify(inputs)
    // fs.writeFileSync('./circuit/Prover.toml', tomlString)

    fs.writeFile('inputs.json', JSON.stringify(inputs, (key, value) => {
        // Convert BigInt to string with 'n' suffix
        if (typeof value === 'bigint') {
            return value.toString();
        }
        return value;
    }, 2), (err) => {
        if (err) throw err;
        console.log('File written successfully');
    });
}
main()

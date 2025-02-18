import * as fs from "fs"

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
    // console.log("\nPublic JWK\n\n", JSON.stringify(publicJwk))
    // console.log("\nPrivate JWK\n\n", JSON.stringify(privateJwk), "\n\n")

    fs.writeFileSync("./privateKey.json", JSON.stringify(privateJwk))
    fs.writeFileSync("./publicKey.json", JSON.stringify(publicJwk))
}
main()
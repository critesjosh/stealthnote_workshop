import { generateInputs } from "noir-jwt";
import * as fs from "fs"
// import TOML from '@iarna/toml'

/*
Example JWT: 

{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": "true",
  "iat": 1739988753,
  "nonce": "6a32388c0d1be7835a6630b7b58f6796cc7ddc78698d12470d98d3c3d62792a4"
}

*/

const jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOiJ0cnVlIiwiaWF0IjoxNzM5OTg4NzUzLCJub25jZSI6IjZhMzIzODhjMGQxYmU3ODM1YTY2MzBiN2I1OGY2Nzk2Y2M3ZGRjNzg2OThkMTI0NzBkOThkM2MzZDYyNzkyYTQifQ.puxXuztYI1_Re09vND4t5nYlMWMwRBdEpKxxalOiWP9XkWcxt5tOwalXNUSmONCBnWC9OnkZqbsCco0WQ5XiBteZXu7SJdaUDa9w10vXYskLTf6-oTJT30GVlO8_a1qlrlQKO13bBF_2IWqiq27jl7erXDCfugoLEZTrVYcLluLqEfzaoKelYghNZVdmv4QOv-OcIBQJ83IfZLZSFLgnPpGb2YGCDi8lfAnKSdCwMmG9f5R3FjPBVzawdCZh38lj2n73omXfOIHT_kx4ibpN_NES6mkYAJVftaaMNXYzUVZBbUGjHj7zFDWiu_2SoMkcNjwe-zN1IfRXbeIhv_seJQ"

async function main() {
    let publicJwk = JSON.parse(fs.readFileSync("./publicKey.json", "utf-8"))
    let pubkey = await crypto.subtle.importKey("jwk", publicJwk, {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
    }, true, ["verify"])

    const maxSignedDataLength = 232

    const inputs = await generateInputs({
        jwt,
        pubkey,
        maxSignedDataLength,
    });

    // const tomlString = TOML.stringify(inputs)
    // fs.writeFileSync('./circuit/Prover.toml', tomlString)

    fs.writeFile('inputs.json', JSON.stringify(inputs, (key, value) => {
        // Convert BigInt to string with 'n' suffix
        if (typeof value === 'bigint') {
            return value.toString();
        }
        // Convert array values to strings
        if (Array.isArray(value)) {
            return value.map(item => item.toString());
        }
        if (typeof value === 'number') {
            return value.toString();
        }
        return value;
    }, 2), (err) => {
        if (err) throw err;
        console.log('File written successfully');
    });
}
main()

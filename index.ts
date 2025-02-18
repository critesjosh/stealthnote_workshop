import { generateInputs } from "noir-jwt";
import * as fs from "fs"
// import TOML from '@iarna/toml'

/*
Example JWT: 

{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1739988753,
  "nonce": "6a32388c0d1be7835a6630b7b58f6796cc7ddc78698d12470d98d3c3d62792a4"
}

*/

const jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTczOTk4ODc1Mywibm9uY2UiOiI2YTMyMzg4YzBkMWJlNzgzNWE2NjMwYjdiNThmNjc5NmNjN2RkYzc4Njk4ZDEyNDcwZDk4ZDNjM2Q2Mjc5MmE0In0.OPnPPh76cvaaghFtx_0Kyqa0YEy_XnLk1JRcGYTpufs9n0cVXUg3mC-XQsYvaHGI2wpBmisKVU9V5gjtYipKXMArr8ZRzEPnRa8UoYwfVdWCJ5iiSDnrKAoADA4unu-GU8KR1whja5hzpzElHu8gqtXNogn-e4JeF51m5PY9YUpmCJXMgsacps6Fu-vfTIXNGTCmGCNx7Pa1jLJr5NzEWKt6mthCmwHSFZZYjMAjhpnXJV5e1dfTTF4ALVWvn9Fx112Hwc4zIXuwRLyd-IdwOTtuJxXsZ_JzrToDkPJTMdETzHf5XfrJ-irQEFkHbvfTHEfIsrTpNWM10P43m5uQdQ"
let chunks = jwt.split(".")
chunks.map(c => {
    console.log(c.length)
})

async function main() {
    let publicJwk = JSON.parse(fs.readFileSync("./publicKey.json", "utf-8"))
    let pubkey = await crypto.subtle.importKey("jwk", publicJwk, {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
    }, true, ["verify"])

    const maxSignedDataLength = 900

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
// main()

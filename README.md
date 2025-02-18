# Stealthnote Workshop

1. `nargo new stealthnote_workshop`
2. add to Nargo.toml

```toml
[dependencies]
jwt = { tag = "v0.3.1", git = "https://github.com/zkemail/noir-jwt" }
```

3. Update main.nr

```rust
use jwt::JWT;

global MAX_DATA_LENGTH: u32 = 900;
global MAX_NONCE_LENGTH: u32 = 32;

fn main(
    data: BoundedVec<u8, MAX_DATA_LENGTH>,
    base64_decode_offset: u32,
    pubkey_modulus_limbs: pub [Field; 18],
    redc_params_limbs: [Field; 18],
    signature_limbs: [Field; 18],
    domain: pub BoundedVec<u8, MAX_DOMAIN_LENGTH>,
    nonce: pub BoundedVec<u8, MAX_NONCE_LENGTH>,
) {
    let jwt = JWT::init(
        data,
        base64_decode_offset,
        pubkey_modulus_limbs,
        redc_params_limbs,
        signature_limbs,
    );

    jwt.verify();

    // Validate key value pair in payload JSON
    jwt.assert_claim_string::<300, 5, MAX_NONCE_LENGTH>("nonce".as_bytes(), nonce);
}
```

4. `nargo check`
   1. A Prover.toml is generated, with blank inputs. Let's generate some to test the program.
5. `npm install noir-jwt @types/node tsx`
6. `yarn keygen`
7. `yarn start`
8.

## Helpful resources

- https://jwt.io/

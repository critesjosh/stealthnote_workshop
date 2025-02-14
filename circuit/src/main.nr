use jwt::JWT;

global MAX_DATA_LENGTH: u32 = 900;
global MAX_NONCE_LENGTH: u32 = 32;

fn main(
    data: BoundedVec<u8, MAX_DATA_LENGTH>,
    base64_decode_offset: u32,
    pubkey_modulus_limbs: pub [Field; 18],
    redc_params_limbs: [Field; 18],
    signature_limbs: [Field; 18],
    // domain: pub BoundedVec<u8, MAX_DOMAIN_LENGTH>,
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

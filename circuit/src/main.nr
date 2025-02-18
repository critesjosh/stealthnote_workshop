use jwt::JWT;

global MAX_DATA_LENGTH: u32 = 900;
global MAX_NONCE_LENGTH: u32 = 32;

// this circuit is not verifying that the key matches anything
// the verifier does this (public input to the circuit)

// Trust assumption with google: google is attesting to the fact
// that the prover has access to a certain top level domain.
// google is also attesting to the fact
// if the proof becomes public, Google can figure out who's it is
// by matching the nonce
//  - possible to fix using semaphore
//    - create a group for each domain. prove membership to join group
//    - google can find out that you joined the group (which they already know)
//    - they cannot link users to messages like current impl
//  - do it in Aztec. prove membership and then emit message in public log

// partial hashing
// stealthnote uses ephemeral
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
    jwt.assert_claim_string::<188, 5, MAX_NONCE_LENGTH>("nonce".as_bytes(), nonce);
}

/* eslint-disable */
/*
 * Original Code
 * https://github.com/ethereumjs/ethereumjs-util/blob/master/index.js
 */

import secp256k1 from 'secp256k1';
import scryptsy from 'scryptsy';
import crypto, { randomBytes } from 'crypto';
import uuidv4 from 'uuid/v4';
import { sha3_256 as sha3256, keccak256 } from 'js-sha3';
import { addHxPrefix } from './data/Hexadecimal';
import { sign } from './data/Util';
import { isPrivateKey, isPublicKey } from './data/Validator';
import { WalletError } from './Exception';
import { isString, isObject } from './data/Type';

export default class Wallet {
	constructor(privKey, pubKey) {
		if (privKey && pubKey) {
			const error = new WalletError('Both a private and a public key cannot be supplied to the constructor.')
			throw error.toString()
		}

		if (!privKey && !pubKey) {
			const error = new WalletError('A private or a public key must be supplied to the constructor.')
			throw error.toString()
		}

		if (privKey && !isPrivateKey(privKey)) {
			const error = new WalletError(`[${privKey}] is not a valid private key.`)
			throw error.toString()
		}

		if (pubKey && !isPublicKey(pubKey)) {
			const error = new WalletError(`[${pubKey}] is not a valid public key.`)
			throw error.toString()
		}

		this._privKey = privKey;
		this._pubKey = pubKey;
	}

	static create() {
		let privKey;

		do {
			privKey = randomBytes(32);
		} while (!secp256k1.privateKeyVerify(privKey));

		return new Wallet(privKey);
	}

	static loadPrivateKey(privKey) {
		if (!isPrivateKey(privKey)) {
			const error = new WalletError(`[${privKey}] is not a valid private key.`)
			throw error.toString()
		}

		const pkBuffer = Buffer.from(privKey, 'hex');
		return new Wallet(pkBuffer);
	}

	static loadKeystore(keystore, password, nonStrict) {
		if (!isString(password)) {
			const error = new WalletError("Password is invalid.")
			throw error.toString()
		}

		const json = isObject(keystore) ? keystore : JSON.parse(nonStrict ? keystore.toLowerCase() : keystore);

		if (json.version !== 3) {
			const error = new WalletError("This is not a V3 wallet.")
			throw error.toString()
		}

		let derivedKey;
		let kdfparams;
		if (json.crypto.kdf === 'scrypt') {
			kdfparams = json.crypto.kdfparams;
			derivedKey = scryptsy(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
		} else if (json.crypto.kdf === 'pbkdf2') {
			kdfparams = json.crypto.kdfparams;

			if (kdfparams.prf !== 'hmac-sha256') {
				const error = new WalletError("It's an unsupported parameters to PBKDF2.")
				throw error.toString()
			}

			derivedKey = crypto.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
		} else {
			const error = new WalletError("It's an unsupported key derivation scheme.")
			throw error.toString()
		}

		const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');

		const mac = keccak256(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));
		if (mac.toString('hex') !== json.crypto.mac) {
			const error = new WalletError("Key derivation is failed (possibly wrong passphrase).")
			throw error.toString()
		}

		const decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'));
		const seed = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

		return new Wallet(seed);
	}

	store(password, opts) {
		if (!this._privKey) {
			const error = new WalletError("This is a public key only wallet.")
			throw error.toString()
		}

		opts = opts || {};
		const salt = opts.salt || crypto.randomBytes(32);
		const iv = opts.iv || crypto.randomBytes(16);

		let derivedKey;
		const kdf = opts.kdf || 'scrypt';
		const kdfparams = {
			dklen: opts.dklen || 32,
			salt: salt.toString('hex'),
		};

		if (kdf === 'scrypt') {
			kdfparams.n = opts.n || 16384;
			kdfparams.r = opts.r || 8;
			kdfparams.p = opts.p || 1;
			derivedKey = scryptsy(Buffer.from(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
		} else if (kdf === 'pbkdf2') {
			kdfparams.c = opts.c || 16384;
			kdfparams.prf = 'hmac-sha256';
			derivedKey = crypto.pbkdf2Sync(Buffer.from(password), salt, kdfparams.c, kdfparams.dklen, 'sha256');
		} else {
			const error = new WalletError("It's an unsupported kdf.")
			throw error.toString()
		}

		const cipher = crypto.createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv);
		if (!cipher) {
			const error = new WalletError("It's an unsupported cipher.")
			throw error.toString()
		}

		const ciphertext = Buffer.concat([cipher.update(this.privKey), cipher.final()]);

		const mac = keccak256(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex')]));

		return {
			version: 3,
			id: uuidv4({ random: opts.uuid || crypto.randomBytes(16) }),
			address: this.getAddress(),
			crypto: {
				ciphertext: ciphertext.toString('hex'),
				cipherparams: {
					iv: iv.toString('hex'),
				},
				cipher: opts.cipher || 'aes-128-ctr',
				kdf,
				kdfparams,
				mac: mac.toString('hex'),
				coinType: 'icx'
			},
		};
	}

	sign(data) {
		const signature = sign(data, this.privKey);
		const b64encoded = btoa(String.fromCharCode.apply(null, signature));
		return b64encoded;
	}

	getPrivateKey() {
		return this.privKey.toString('hex');
	}

	getPublicKey() {
		return this.pubKey.toString('hex');
	}

	getAddress() {
		return this.address;
	}
}

Object.defineProperty(Wallet.prototype, 'privKey', {
	get: function get() {
		if (!this._privKey) {
			const error = new WalletError('This is a public key only wallet.')
			throw error.toString()
		}
		return this._privKey;
	},
});

Object.defineProperty(Wallet.prototype, 'pubKey', {
	get: function get() {
		if (!this._pubKey) {
			return secp256k1.publicKeyCreate(this.privKey, false).slice(1);
		}
		return this._pubKey;
	},
});

Object.defineProperty(Wallet.prototype, 'address', {
	get: function get() {
		return addHxPrefix(sha3256(this.pubKey).slice(-40));
	},
});

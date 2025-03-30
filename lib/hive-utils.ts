// var dhive = require("@hiveio/dhive");
const { Client, PrivateKey } = require("@hiveio/dhive");

// Define custom error classes for better error handling
export class HiveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HiveError';
  }
}

export class InvalidKeyFormatError extends HiveError {
  constructor() {
    super('Invalid posting key format. Posting keys should start with 5.');
    this.name = 'InvalidKeyFormatError';
  }
}

export class AccountNotFoundError extends HiveError {
  constructor(username: string) {
    super(`Account '${username}' not found on the Hive blockchain.`);
    this.name = 'AccountNotFoundError';
  }
}

export class InvalidKeyError extends HiveError {
  constructor() {
    super('The posting key is invalid for the given username.');
    this.name = 'InvalidKeyError';
  }
}

// Initialize the dhive client
const client = new Client(['https://api.hive.blog']);

/**
 * Validates if the posting key provided is valid for the given username
 * @param username Hive username
 * @param postingPrivateKey Private posting key
 * @returns True if the key is valid
 * @throws {InvalidKeyFormatError} If the key format is invalid
 * @throws {AccountNotFoundError} If the account doesn't exist
 * @throws {InvalidKeyError} If the key is invalid for the account
 * @throws {HiveError} For other Hive-related errors
 */
export async function validate_posting_key(
  username: string, 
  postingPrivateKey: string
): Promise<boolean> {
  try {
    // Check if the input looks like a private key (should start with 5)
    if (!postingPrivateKey.startsWith('5')) {
      throw new InvalidKeyFormatError();
    }

    // Retrieve account details
    const [account] = await client.database.getAccounts([username]);

    if (!account) {
      throw new AccountNotFoundError(username);
    }

    // Obtain the public posting key from the account data
    const publicPostingKey = account.posting.key_auths[0][0];

    // Derive the public key from the provided private key
    const derivedPublicKey = PrivateKey.fromString(postingPrivateKey).createPublic().toString();

    // Compare the derived public key with the account's public posting key
    if (publicPostingKey === derivedPublicKey) {
      return true;
    } else {
      throw new InvalidKeyError();
    }
  } catch (error) {
    // Re-throw custom errors
    if (error instanceof HiveError) {
      throw error;
    }
    
    // Convert unknown errors to HiveError
    throw new HiveError(`Error validating posting key: ${error instanceof Error ? error.message : String(error)}`);
  }
}


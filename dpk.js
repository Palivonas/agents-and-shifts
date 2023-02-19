const crypto = require("crypto");

module.exports = {
  deterministicPartitionKey,
}

function deterministicPartitionKey(event, options = {}) {
  const { TRIVIAL_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH, hashFunction } = withDefaultOptions(options);

  if (!event)
    return TRIVIAL_PARTITION_KEY;

  const candidateKey = getPredefinedKey(event, hashFunction)

  if (!candidateKey)
    return hashFunction(JSON.stringify(event));

  if (candidateKey.length > MAX_PARTITION_KEY_LENGTH)
    return hashFunction(candidateKey)

  return candidateKey;
}

function getPredefinedKey(event) {
  const key = event.partitionKey;
  if (!key)
    return undefined;

  if (typeof key !== 'string')
    return JSON.stringify(key);

  if (key.length === 0)
    return undefined;

  return key;
}

function withDefaultOptions(options) {
  return {
    TRIVIAL_PARTITION_KEY: "0",
    MAX_PARTITION_KEY_LENGTH: 256,
    hashFunction: getSha3,
    ...options,
  };
}

function getSha3(text) {
  return crypto.createHash("sha3-512").update(text).digest("hex")
}

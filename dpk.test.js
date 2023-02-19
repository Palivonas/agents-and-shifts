const { deterministicPartitionKey } = require("./dpk");

const MAX_PARTITION_KEY_LENGTH = 256;
const TRIVIAL_PARTITION_KEY = "trivial";

describe("deterministicPartitionKey", () => {
  it("Returns the trivial key when given no input", () => {
    const key = getWithMockHash();
    expect(key).toBe(TRIVIAL_PARTITION_KEY);
  });

  it("Returns pre-defined partition key when it is a string not longer than limit", () => {
    const keyOfMaxLength = 'A'.repeat(MAX_PARTITION_KEY_LENGTH);
    const key = getWithMockHash({ partitionKey: keyOfMaxLength });
    expect(key).toBe(keyOfMaxLength);
  });

  it("Re-hashes the pre-defined key when it is key is too long", () => {
    const keyTooLong = 'A'.repeat(MAX_PARTITION_KEY_LENGTH + 1);
    const key = getWithMockHash({partitionKey: keyTooLong});
    expect(key).toBe(mockHashFn(keyTooLong));
  });

  it("Returns stringified pre-defined partition key when it is not a string, but stringifies within length limit", () => {
    const objectKey = { a: "b" }
    const key = getWithMockHash({ partitionKey: objectKey });
    expect(key).toBe(JSON.stringify(objectKey));
  });

  it("Hashes stringified pre-defined partition key when it stringifies above length limit", () => {
    const objectKeyTooLong = { a: 'A'.repeat(MAX_PARTITION_KEY_LENGTH) }
    const key = getWithMockHash({ partitionKey: objectKeyTooLong });
    expect(key).toBe(mockHashFn(JSON.stringify(objectKeyTooLong)));
  });

  it("Hashes the whole stringified event object when it has no partitionKey pre-defined", () => {
    const event = { someKey: "someData" };
    const preDefinedKey = getWithMockHash(event);
    expect(preDefinedKey).toBe(mockHashFn(JSON.stringify(event)));
  });

  it("Hashes the whole stringified event object when it has a pre-defined partition key, but it is empty", () => {
    const event = { partitionKey: "" };
    const preDefinedKey = getWithMockHash(event);
    expect(preDefinedKey).toBe(mockHashFn(JSON.stringify(event)));
  });

  it("Calculates SHA3-512 hash correctly using default hashing function", () => {
    const event = { someKey: "someData" }
    const preDefinedKey = deterministicPartitionKey(event);
    expect(preDefinedKey).toBe("21bb58aef3a191c7c680b586b3068c37215839ffa1b21c96c861518e5e238e6d3c1a1351ef5fd29e9d7d5bd335f0a5636e9cddb34149e5b6c2adbf03b13709cd");
  })
});

function getWithMockHash(event) {
  return deterministicPartitionKey(event, { TRIVIAL_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH, hashFunction: mockHashFn })
}

function mockHashFn(text) {
  return `hashed_${text}`
}

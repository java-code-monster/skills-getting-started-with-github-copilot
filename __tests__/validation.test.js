/**
 * @jest-environment jsdom
 */

const { validateUsername } = require('../src/static/app.js');

describe('validateUsername', () => {
  test('should return valid for correct username', () => {
    const result = validateUsername('john_doe');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Username is valid');
  });

  test('should return valid for username with numbers', () => {
    const result = validateUsername('user123');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Username is valid');
  });

  test('should return valid for username with underscores', () => {
    const result = validateUsername('user_name_123');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Username is valid');
  });

  test('should reject empty username', () => {
    const result = validateUsername('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username is required');
  });

  test('should reject null username', () => {
    const result = validateUsername(null);
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username is required');
  });

  test('should reject undefined username', () => {
    const result = validateUsername(undefined);
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username is required');
  });

  test('should reject username with only spaces', () => {
    const result = validateUsername('   ');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username is required');
  });

  test('should reject username shorter than 3 characters', () => {
    const result = validateUsername('ab');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username must be at least 3 characters');
  });

  test('should reject username longer than 20 characters', () => {
    const result = validateUsername('a'.repeat(21));
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username must be 20 characters or less');
  });

  test('should accept username with exactly 3 characters', () => {
    const result = validateUsername('abc');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Username is valid');
  });

  test('should accept username with exactly 20 characters', () => {
    const result = validateUsername('a'.repeat(20));
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Username is valid');
  });

  test('should reject username with special characters', () => {
    const result = validateUsername('user@name');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username can only contain letters, numbers, and underscores');
  });

  test('should reject username with spaces', () => {
    const result = validateUsername('user name');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username can only contain letters, numbers, and underscores');
  });

  test('should reject username with hyphens', () => {
    const result = validateUsername('user-name');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username can only contain letters, numbers, and underscores');
  });

  test('should reject username with dots', () => {
    const result = validateUsername('user.name');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username can only contain letters, numbers, and underscores');
  });

  test('should accept username with mixed case', () => {
    const result = validateUsername('JohnDoe');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Username is valid');
  });

  test('should accept username starting with number', () => {
    const result = validateUsername('123user');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Username is valid');
  });

  test('should accept username starting with underscore', () => {
    const result = validateUsername('_username');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Username is valid');
  });
});

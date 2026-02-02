/**
 * @jest-environment jsdom
 */

const { validateUsername, validateTransaction } = require('./src/static/budget.js');

describe('validateUsername', () => {
    test('should return valid for a valid username', () => {
        const result = validateUsername('john_doe');
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('should return valid for username with hyphens', () => {
        const result = validateUsername('john-doe');
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('should return valid for username with numbers', () => {
        const result = validateUsername('user123');
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('should return valid for minimum length username (3 chars)', () => {
        const result = validateUsername('abc');
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('should return valid for maximum length username (20 chars)', () => {
        const result = validateUsername('a'.repeat(20));
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('should reject empty username', () => {
        const result = validateUsername('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Username is required');
    });

    test('should reject null username', () => {
        const result = validateUsername(null);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Username is required');
    });

    test('should reject undefined username', () => {
        const result = validateUsername(undefined);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Username is required');
    });

    test('should reject non-string username', () => {
        const result = validateUsername(123);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Username is required');
    });

    test('should reject username shorter than 3 characters', () => {
        const result = validateUsername('ab');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Username must be at least 3 characters long');
    });

    test('should reject username longer than 20 characters', () => {
        const result = validateUsername('a'.repeat(21));
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Username must be at most 20 characters long');
    });

    test('should reject username with spaces', () => {
        const result = validateUsername('john doe');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Username can only contain letters, numbers, hyphens, and underscores');
    });

    test('should reject username with special characters', () => {
        const result = validateUsername('john@doe');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Username can only contain letters, numbers, hyphens, and underscores');
    });

    test('should reject username with symbols', () => {
        const result = validateUsername('john$doe');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Username can only contain letters, numbers, hyphens, and underscores');
    });

    test('should handle whitespace-only username', () => {
        const result = validateUsername('   ');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Username must be at least 3 characters long');
    });

    test('should trim and validate username', () => {
        const result = validateUsername('  user123  ');
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });
});

describe('validateTransaction', () => {
    test('should return valid for a valid transaction', () => {
        const result = validateTransaction('Groceries', 50.00, 'Food');
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('should return valid for decimal amounts', () => {
        const result = validateTransaction('Coffee', 4.99, 'Food');
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('should return valid for string numbers', () => {
        const result = validateTransaction('Taxi', '25.50', 'Transportation');
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('should reject empty description', () => {
        const result = validateTransaction('', 50.00, 'Food');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Description is required');
    });

    test('should reject whitespace-only description', () => {
        const result = validateTransaction('   ', 50.00, 'Food');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Description is required');
    });

    test('should reject null description', () => {
        const result = validateTransaction(null, 50.00, 'Food');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Description is required');
    });

    test('should reject zero amount', () => {
        const result = validateTransaction('Item', 0, 'Food');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Amount must be a positive number');
    });

    test('should reject negative amount', () => {
        const result = validateTransaction('Item', -10, 'Food');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Amount must be a positive number');
    });

    test('should reject NaN amount', () => {
        const result = validateTransaction('Item', 'abc', 'Food');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Amount must be a positive number');
    });

    test('should reject empty category', () => {
        const result = validateTransaction('Item', 50.00, '');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Category is required');
    });

    test('should reject null category', () => {
        const result = validateTransaction('Item', 50.00, null);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Category is required');
    });

    test('should accept all valid categories', () => {
        const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];
        
        categories.forEach(category => {
            const result = validateTransaction('Test', 10, category);
            expect(result.valid).toBe(true);
            expect(result.error).toBe(null);
        });
    });

    test('should handle large amounts', () => {
        const result = validateTransaction('Big Purchase', 9999.99, 'Shopping');
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('should handle very small amounts', () => {
        const result = validateTransaction('Candy', 0.01, 'Food');
        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });
});

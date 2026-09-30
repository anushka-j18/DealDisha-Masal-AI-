import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { POST as signupHandler } from '../app/api/auth/signup/route';

describe('DealDisha Auth & Signup Suite', () => {
  const testEmail = `testuser_${Date.now()}@dealdisha.io`;

  it('1. should reject signup requests missing required fields', async () => {
    const req = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }),
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Name is required');
  });

  it('2. should reject invalid email formatting', async () => {
    const req = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Agent',
        email: 'invalid-email-string',
        password: 'password123',
        confirmPassword: 'password123',
      }),
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('valid email address');
  });

  it('3. should reject short passwords (< 6 characters)', async () => {
    const req = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Agent',
        email: 'agent@dealdisha.io',
        password: '123',
        confirmPassword: '123',
      }),
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('at least 6 characters');
  });

  it('4. should reject mismatched passwords', async () => {
    const req = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Agent',
        email: 'agent@dealdisha.io',
        password: 'Password123',
        confirmPassword: 'DifferentPassword456',
      }),
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('do not match');
  });

  it('5. should create user account with bcrypt salted hashed password', async () => {
    const plainPassword = 'SuperSecretPassword123!';

    const req = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Ananya Sharma',
        email: testEmail,
        password: plainPassword,
        confirmPassword: plainPassword,
      }),
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe(testEmail);

    // Verify stored user in SQLite DB
    const storedUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    expect(storedUser).toBeDefined();
    expect(storedUser?.name).toBe('Ananya Sharma');

    // Ensure password is NOT stored as plaintext
    expect(storedUser?.passwordHash).not.toBe(plainPassword);

    // Verify bcrypt hash validity
    const match = await bcrypt.compare(plainPassword, storedUser!.passwordHash);
    expect(match).toBe(true);
  });

  it('6. should prevent duplicate email registrations', async () => {
    const req = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Duplicate Buyer',
        email: testEmail,
        password: 'anotherpassword123',
        confirmPassword: 'anotherpassword123',
      }),
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('already exists');
  });
});

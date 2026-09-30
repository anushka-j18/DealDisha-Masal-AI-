import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { POST as signupHandler } from '../app/api/auth/signup/route';
import { POST as loginHandler } from '../app/api/auth/login/route';
import { POST as logoutHandler } from '../app/api/auth/logout/route';
import { GET as getLeadsHandler, POST as createLeadHandler } from '../app/api/leads/route';
import { GET as getSingleLeadHandler, DELETE as deleteLeadHandler } from '../app/api/leads/[id]/route';
import { middleware } from '../middleware';
import { NextRequest } from 'next/server';

describe('DealDisha Auth & Signup Suite', () => {
  const testEmail = `testuser_${Date.now()}@dealdisha.io`;
  const testPassword = 'SuperSecretPassword123!';

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
    const req = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Ananya Sharma',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
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
    expect(storedUser?.passwordHash).not.toBe(testPassword);

    // Verify bcrypt hash validity
    const match = await bcrypt.compare(testPassword, storedUser!.passwordHash);
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

  describe('Login Functionality & Verification', () => {
    it('7. should reject login attempts with missing email or password', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: '',
          password: 'Password123',
        }),
      });

      const res = await loginHandler(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Email address is required');
    });

    it('8. should reject login attempts for non-existent users', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent_user_9999@dealdisha.io',
          password: 'Password123',
        }),
      });

      const res = await loginHandler(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid email or password.');
    });

    it('9. should reject login attempts with incorrect password', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: 'WrongPassword456!',
        }),
      });

      const res = await loginHandler(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid email or password.');
    });

    it('10. should successfully authenticate with correct credentials and set session cookie', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      const res = await loginHandler(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.email).toBe(testEmail);
      expect(data.user.name).toBe('Ananya Sharma');

      // Verify session cookie header set
      const setCookieHeader = res.headers.get('set-cookie');
      expect(setCookieHeader).toContain('dealdisha_session');
    });
  });

  describe('Logout & Protected Routes Access Control', () => {
    it('11. should clear session cookie on logout request', async () => {
      const res = await logoutHandler();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);

      const setCookieHeader = res.headers.get('set-cookie');
      expect(setCookieHeader).toContain('dealdisha_session=;');
      expect(setCookieHeader).toContain('Max-Age=0');
    });

    const protectedPaths = [
      '/',
      '/dashboard',
      '/leads',
      '/leads/lead-1',
      '/add-lead',
      '/profile',
      '/settings',
    ];

    protectedPaths.forEach((path, idx) => {
      it(`12.${idx + 1}. should redirect unauthenticated request to ${path} to /login`, async () => {
        const req = new NextRequest(`http://localhost:3000${path}`);
        const res = await middleware(req);

        expect(res.status).toBe(307); // Temporary Redirect
        expect(res.headers.get('location')).toContain('/login');
      });
    });

    it('13. middleware should reject unauthenticated requests to protected API endpoints with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/leads');
      const res = await middleware(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Unauthorized');
    });
  });

  describe('User Lead Association & Isolation Suite', () => {
    it('14. should associate lead with authenticated user and ignore frontend spoofed userId', async () => {
      // Create User A
      const emailA = `usera_${Date.now()}@dealdisha.io`;
      const signupReq = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: 'User A',
          email: emailA,
          password: 'Password123!',
          confirmPassword: 'Password123!',
        }),
      });
      const signupRes = await signupHandler(signupReq);
      const signupData = await signupRes.json();
      const userA = signupData.user;

      // Login User A
      const loginReq = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: emailA,
          password: 'Password123!',
        }),
      });
      const loginRes = await loginHandler(loginReq);
      const cookieHeader = loginRes.headers.get('set-cookie');
      const sessionToken = cookieHeader?.split('dealdisha_session=')[1]?.split(';')[0];

      // User A creates lead with spoofed frontend userId ("fake-user-id")
      const createReq = new Request('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `dealdisha_session=${sessionToken}`,
        },
        body: JSON.stringify({
          customerName: 'Rahul Varma',
          location: 'Indiranagar, Bangalore',
          propertyRequirement: '3BHK Flat',
          budget: '₹1.5 Crores',
          buyingTimeline: 'Within 1 month',
          customerMessage: 'Urgent buyer looking for 3BHK flat in Indiranagar.',
          userId: 'fake-spoofed-user-id', // Frontend spoof attempt
        }),
      });

      const createRes = await createLeadHandler(createReq);
      const createData = await createRes.json();

      expect(createRes.status).toBe(201);
      expect(createData.success).toBe(true);
      // Verify server ignored fake-spoofed-user-id and assigned real userA.id from session
      expect(createData.lead.userId).toBe(userA.id);
      expect(createData.lead.userId).not.toBe('fake-spoofed-user-id');
    });
  });
});

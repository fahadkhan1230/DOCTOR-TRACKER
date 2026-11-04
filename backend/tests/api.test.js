import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

const cookie = () => `dt_token=${jwt.sign({ sub: '507f1f77bcf86cd799439011' }, process.env.JWT_SECRET, { expiresIn: '1h' })}`;
const ID = '507f1f77bcf86cd799439011';

describe('authorization (no DB needed)', () => {
  const protectedRoutes = [
    ['get', '/api/auth/me'], ['get', '/api/doctors'], ['post', '/api/doctors'], ['get', `/api/doctors/${ID}`],
    ['get', `/api/doctors/${ID}/patients`], ['get', '/api/patients'], ['post', '/api/patients'],
    ['delete', `/api/patients/${ID}`], ['get', '/api/dashboard/stats'], ['get', '/api/dashboard/monthly-stats'],
  ];
  it.each(protectedRoutes)('%s %s -> 401 without cookie', async (m, url) => {
    const res = await request(app)[m](url);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
  it('rejects a tampered token', async () => {
    const res = await request(app).get('/api/doctors').set('Cookie', 'dt_token=abc.def.ghi');
    expect(res.status).toBe(401);
  });
  it('rejects an expired token', async () => {
    const old = jwt.sign({ sub: ID }, process.env.JWT_SECRET, { expiresIn: -10 });
    const res = await request(app).get('/api/doctors').set('Cookie', `dt_token=${old}`);
    expect(res.status).toBe(401);
  });
});

describe('validation (no DB needed)', () => {
  it('login requires valid email + password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nope' });
    expect(res.status).toBe(400);
    expect(res.body.errors.map((e) => e.field)).toEqual(expect.arrayContaining(['email', 'password']));
  });
  it('invalid ObjectId -> 400', async () => {
    const res = await request(app).get('/api/doctors/not-an-id').set('Cookie', cookie());
    expect(res.status).toBe(400);
  });
  it('doctor create validates fields', async () => {
    const res = await request(app).post('/api/doctors').set('Cookie', cookie()).send({ email: 'bad' });
    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e) => e.field);
    expect(fields).toEqual(expect.arrayContaining(['name', 'email', 'phone', 'specialization', 'hospital']));
  });
  it('patient create requires a valid doctor id', async () => {
    const res = await request(app).post('/api/patients').set('Cookie', cookie())
      .send({ name: 'A', age: 30, gender: 'Male', phone: '01700000000', condition: 'Flu', doctorId: 'xyz' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].message).toMatch(/valid doctor/);
  });
  it.each([['page=0'], ['limit=1000'], ['page=abc'], ['dateFrom=garbage']])('rejects bad pagination/filter ?%s', async (qs) => {
    const res = await request(app).get(`/api/doctors?${qs}`).set('Cookie', cookie());
    expect(res.status).toBe(400);
  });
  it('unknown route -> 404 JSON, health ok, helmet headers present', async () => {
    expect((await request(app).get('/api/nope')).status).toBe(404);
    const h = await request(app).get('/api/health');
    expect(h.status).toBe(200);
    expect(h.headers['x-content-type-options']).toBe('nosniff');
    expect(h.headers['x-powered-by']).toBeUndefined();
  });
});

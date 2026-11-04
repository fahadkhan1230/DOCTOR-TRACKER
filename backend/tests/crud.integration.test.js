// Runs only when TEST_MONGODB_URI points to a THROWAWAY database (collections are wiped!).
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import User from '../src/models/User.js';

const uri = process.env.TEST_MONGODB_URI;
describe.skipIf(!uri)('CRUD / search / pagination (real MongoDB)', () => {
  const agent = request.agent(app);
  let docA, docB, pat;
  const doc = (n, extra = {}) => ({ name: n, specialization: 'Cardiology', hospital: 'City', phone: '+8801700000000', email: `${n.replace(/\W/g, '').toLowerCase()}@x.com`, ...extra });

  beforeAll(async () => {
    await mongoose.connect(uri);
    await mongoose.connection.dropDatabase();
    await User.init();
    await User.create({ name: 'Admin', email: 'admin@test.com', password: await bcrypt.hash('Password123', 10) });
    await mongoose.model('Doctor').init();
  });
  afterAll(async () => { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });

  it('rejects bad login, accepts good login, /me works with cookie', async () => {
    expect((await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'wrong' })).status).toBe(401);
    expect((await agent.post('/api/auth/login').send({ email: 'admin@test.com', password: 'Password123' })).status).toBe(200);
    const me = await agent.get('/api/auth/me');
    expect(me.body.data.email).toBe('admin@test.com');
    expect(JSON.stringify(me.body)).not.toMatch(/password/);
  });
  it('doctor CRUD + duplicate email', async () => {
    docA = (await agent.post('/api/doctors').send(doc('Dr Rahman'))).body.data;
    docB = (await agent.post('/api/doctors').send(doc('Dr Karim', { specialization: 'Neurology', hospital: 'Other' }))).body.data;
    expect((await agent.post('/api/doctors').send(doc('Dr Rahman'))).status).toBe(409);
    const upd = await agent.put(`/api/doctors/${docA._id}`).send(doc('Dr Rahman', { hospital: 'New' }));
    expect(upd.body.data.hospital).toBe('New');
    expect((await agent.get('/api/doctors/507f1f77bcf86cd799439011')).status).toBe(404);
  });
  it('patient CRUD, requires real doctor', async () => {
    const body = { name: 'Pat One', age: 40, gender: 'Female', phone: '+8801800000000', condition: 'Asthma', doctorId: docA._id };
    expect((await agent.post('/api/patients').send({ ...body, doctorId: '507f1f77bcf86cd799439011' })).status).toBe(400);
    pat = (await agent.post('/api/patients').send(body)).body.data;
    expect(pat.doctorId.name).toBe('Dr Rahman');
    expect((await agent.put(`/api/patients/${pat._id}`).send({ ...body, age: 41 })).body.data.age).toBe(41);
  });
  it('search, filter, pagination', async () => {
    const s = await agent.get('/api/doctors?search=rahman&page=1&limit=10');
    expect(s.body.pagination.totalRecords).toBe(1);
    expect(s.body.data[0].patientCount).toBe(1);
    expect((await agent.get('/api/doctors?specialization=Neurology')).body.data).toHaveLength(1);
    expect((await agent.get('/api/doctors?limit=1&page=2')).body.pagination).toMatchObject({ currentPage: 2, totalPages: 2, totalRecords: 2 });
    expect((await agent.get(`/api/patients?doctorId=${docA._id}&condition=Asthma`)).body.data).toHaveLength(1);
    expect((await agent.get('/api/patients?search=zzz')).body.data).toHaveLength(0);
    expect((await agent.get('/api/patients?dateFrom=2999-01-01')).body.data).toHaveLength(0);
  });
  it('dashboard returns real aggregates', async () => {
    expect((await agent.get('/api/dashboard/stats')).body.data).toMatchObject({ totalDoctors: 2, totalPatients: 1 });
    expect((await agent.get('/api/dashboard/patients-per-doctor')).body.data[0]).toMatchObject({ name: 'Dr Rahman', patients: 1 });
    expect((await agent.get('/api/dashboard/monthly-stats')).body.data).toHaveLength(6);
    expect((await agent.get('/api/dashboard/specialization-stats')).body.data).toHaveLength(2);
  });
  it('safe doctor deletion: blocked, then reassign', async () => {
    expect((await agent.delete(`/api/doctors/${docA._id}`)).status).toBe(409);
    expect((await agent.delete(`/api/doctors/${docA._id}?reassignTo=${docA._id}`)).status).toBe(400);
    expect((await agent.delete(`/api/doctors/${docA._id}?reassignTo=${docB._id}`)).status).toBe(200);
    expect((await agent.get(`/api/patients/${pat._id}`)).body.data.doctorId._id).toBe(docB._id);
    expect((await agent.delete(`/api/patients/${pat._id}`)).status).toBe(200);
  });
  it('logout clears access', async () => {
    await agent.post('/api/auth/logout');
    expect((await agent.get('/api/doctors')).status).toBe(401);
  });
});

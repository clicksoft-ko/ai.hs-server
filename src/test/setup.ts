import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { SigninDto } from '../routes/signin/dto/signin.dto';
import { app } from '@/app';
import { SignupDto } from '@/routes/signup/dto/signup.dto';

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  process.env.ADMIN_KEY = "admin_key";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let replSet: MongoMemoryReplSet;

beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  process.env.ADMIN_KEY = "admin_key";

  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 2 }
  });
  const mongoUri = replSet.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (replSet) {
    await replSet.stop();
  }
  await mongoose.connection.close();
});
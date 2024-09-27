import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { isProduction } from './constants/env-const';

const PROTO_PATH = path.join(__dirname, './proto/web-app-user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const webAppUserProto = grpc.loadPackageDefinition(packageDefinition) as any;

const webAppUserClient = new webAppUserProto.webAppUser.WebAppUserService(
  isProduction ? "click-app-server-svc.default.svc.cluster.local:5000" : 'localhost:5000',
  grpc.credentials.createInsecure()
);

export { webAppUserClient };

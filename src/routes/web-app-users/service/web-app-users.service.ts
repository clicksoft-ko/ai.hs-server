import { GrpcError } from "@/errors/grpc-error";
import { webAppUserClient } from "@/grpc-app";
import { GetWebAppUsersRequest, GetWebAppUsersResponse } from "../dto/get-web-app-users.dto";
import { Metadata } from "@grpc/grpc-js";
import { DeleteWebAppUserRequest } from "../dto/delete-web-app-user.dto";
import { WebAppUser } from "../dto/web-app-user";

class WebAppUserService {
  async getWebAppUsers(hsUserId: string) {
    return this.CallGrpc<GetWebAppUsersRequest, GetWebAppUsersResponse>("GetWebAppUsers", { hsUserId });
  }
  
  async deleteWebAppUser(id: string) {
    return this.CallGrpc<DeleteWebAppUserRequest, WebAppUser>("DeleteWebAppUser", { id });
  }

  async CallGrpc<TRequest, TResponse>(method: string, request: TRequest): Promise<TResponse> {
    return new Promise<TResponse>((resolve, reject) => {
      const metadata = new Metadata();
      // metadata.add('authorization', 'Bearer token');  // 예: 인증 토큰
      // metadata.add('custom-header', 'customValue');
      webAppUserClient[method](request, metadata, (err: any, response: TResponse) => {
        if (err) {
          reject(new GrpcError({ message: err }));
        } else {
          resolve({ ...response });
        }
      });
    });
  }
}


export const webAppUserService = new WebAppUserService();
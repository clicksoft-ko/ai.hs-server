import { webAppUserClient } from "@/grpc-app";

class WebAppUserService {
  async getWebAppUsers(hsUserId: string) {
    return new Promise<any>((resolve, reject) => {
      webAppUserClient.GetWebAppUsers({ hsUserId }, (err: any, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
}


export const webAppUserService = new WebAppUserService();
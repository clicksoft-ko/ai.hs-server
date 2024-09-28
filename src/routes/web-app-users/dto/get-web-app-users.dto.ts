import { WebAppUser } from "./web-app-user";

export interface GetWebAppUsersRequest {
  hsUserId: string;
}

export interface GetWebAppUsersResponse {
  users: WebAppUser[];
}



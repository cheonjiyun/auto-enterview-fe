export interface IUser {
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  user: {
    key: string;
    name: string;
    email: string;
    role: "ROLE_COMPANY" | "ROLE_CANDIDATE";
  };
}

export interface IUserRecoil extends IUser {
  expires: number;
}

export interface IUserAuth {
  email: string;
  password: string;
}

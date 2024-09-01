import { IUser, IUserAuth } from "../../type/user";
import { http } from "../instances";

export const postSignin = (userData: IUserAuth) => {
  return http.post<IUser>(`login`, userData);
};

export const postSignup = (userData: IUserAuth) => {
  return http.post<IUser>(`/candidates/signup`, userData);
};

export const postCompanySignup = (userData: IUserAuth) => {
  return http.post(`companies/signup`, userData);
};

export const checkEmailDuplication = (email: string) => {
  return http.post<void>("/common/duplicate-email", { email });
};

export const postSendVerificationCode = (email: string) => {
  return http.post<void>("/common/send-verification-code", { email });
};

export const postVerifyEmailCode = (email: string, verificationCode: string) => {
  return http.post<void>("/common/verify-email", { email, verificationCode });
};

export const postFindEmail = (name: string, phoneNumber: string) => {
  return http.post<{ email: string }>("candidates/find-email", { name, phoneNumber });
};

export const postChangePassword = (key: string, oldPassword: string, newPassword: string) => {
  const url = `/common/${key}/password`;
  return http.put<IUser>(url, { oldPassword, newPassword });
};

export const postWithdrawCandidate = (key: string) => {
  const url = `/common/${key}/withdraw`;
  return http.delete(url);
};

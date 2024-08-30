import { CompanyInfo } from "../../type/company";
import { http } from "../instances";

export const getCompanyInfo = (companyKey: string) => {
  return http.get<CompanyInfo>(`/companies/${companyKey}/information`);
};

export const postCompanyInfo = (body: CompanyInfo) => {
  return http.post<CompanyInfo>(`/companies`, body);
};

export const putCompanyInfo = (companyKey: string, body: CompanyInfo) => {
  return http.put<CompanyInfo>(`/companies/${companyKey}/information`, body);
};

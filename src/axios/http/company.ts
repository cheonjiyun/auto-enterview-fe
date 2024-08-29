import { CompanyInfo } from "../../type/company";
import { http } from "../instances";

export const getCompanyInfo = (companyKey: string) => {
  return http.get<CompanyInfo>(`/companies/${companyKey}/infomation`);
};

export const postCompanyInfo = (companyKey: string, body: CompanyInfo) => {
  return http.post<CompanyInfo>(`/companies/${companyKey}/information`, body);
};

export const putCompanyInfo = (companyKey: string, body: CompanyInfo) => {
  return http.put<CompanyInfo>(`/companies/${companyKey}/information`, body);
};

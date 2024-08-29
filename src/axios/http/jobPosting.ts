import { AxiosRequestConfig } from "axios";
import { PostedJobPoting } from "../../type/company";
import { JobInfo, JobPostingDetail, JobPostingResponse } from "../../type/jobPosting";
import { http } from "../instances";

// 전체 공고 조회
export const getJobPostings = (page: number) => {
  return http.get<JobInfo[]>(`common/job-postings?page=${page}`);
};

// 회사 마이페이지 공고 조회
export const getPostedJobPostings = (companyKey: string) => {
  return http.get<PostedJobPoting[]>(`companies/${companyKey}/posted-job-postings`);
};

// 상세 조회
export const getJobPosting = (jobPostingKey: string) => {
  return http.get<JobPostingDetail>(`common/job-postings/${jobPostingKey}`);
};

export const postCompaniesJobPosting = (
  companyKey: string,
  data: FormData,
  config?: AxiosRequestConfig,
) => {
  return http.post<JobPostingResponse>(`companies/${companyKey}/job-postings`, data, config);
};

export const putCompaniesJobPosting = (
  jobPostingKey: string,
  data: FormData,
  config?: AxiosRequestConfig,
) => {
  return http.put<JobPostingResponse>(`job-postings/${jobPostingKey}`, data, config);
};

export const deleteCompaniesJobPosting = (jobPostingKey: string) => {
  return http.delete(`job-postings/${jobPostingKey}`);
};

export const postJobPostingApply = (jobPostingKey: string) => {
  return http.post(`job-postings/${jobPostingKey}/apply`);
};

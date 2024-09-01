import { AxiosRequestConfig } from "axios";
import { PostedJobPoting } from "../../type/company";
import { JobPosting, JobPostingResponse } from "../../type/jobPosting";
import { http } from "../instances";
import { toLocaleDate } from "../../utils/Format";

// 전체 공고 조회
export const getJobPostings = (page: number) => {
  const today = new Date();
  return http.get<JobPosting[]>(
    `common/job-postings?page=${page}&_sort=endDate&endDate_gte=${toLocaleDate(today)}`,
  );
};

// 회사 마이페이지 공고 조회
export const getPostedJobPostings = (companyKey: string) => {
  return http.get<PostedJobPoting[]>(`companies/${companyKey}/posted-job-postings`);
};

// 상세 조회
export const getJobPosting = (jobPostingKey: string) => {
  return http.get<JobPosting>(`common/job-postings/${jobPostingKey}`);
};

export const postCompaniesJobPosting = (
  companyKey: string,
  data: JobPosting,
  config?: AxiosRequestConfig,
) => {
  return http.post<JobPostingResponse>(`companies/${companyKey}/job-postings`, data, config);
};

export const putCompaniesJobPosting = (
  jobPostingKey: string,
  data: JobPosting,
  config?: AxiosRequestConfig,
) => {
  return http.put<JobPostingResponse>(`job-postings/${jobPostingKey}`, data, config);
};

export const deleteCompaniesJobPosting = (jobPostingKey: string) => {
  return http.delete(`job-postings/${jobPostingKey}`);
};

export const applyJobPosting = (
  jobPostingKey: string,
  candidateKey: string,
  endDate: string,
  stepName: string,
  title: string,
) => {
  return http.post(`job-postings/${jobPostingKey}/apply`, {
    candidateKey: candidateKey,
    jobPostingKey: jobPostingKey,
    endDate: endDate,
    stepName: stepName,
    title: title,
  });
};

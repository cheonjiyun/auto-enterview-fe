import { AppliedJobPostingsList } from "../../type/candidate";
import { http } from "../instances";

export const getAppliedJobPostings = (candidateKey: string) => {
  return http.get<AppliedJobPostingsList[]>(`/candidates/${candidateKey}/applied-job-postings`);
};

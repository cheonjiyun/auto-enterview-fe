export interface AppliedJobPostings {
  id: string;
  candidateKey: string;
  AppliedJobPostingsList: AppliedJobPostingsList[];
  // totalPages: 1;
  // totalElements: 2;
}

export interface AppliedJobPostingsList {
  candidateKey: string;
  jobPostingKey: string;
  endDate: string;
  stepName: string;
  title: string;
}

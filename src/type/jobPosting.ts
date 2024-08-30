export interface JobInfos {
  data: JobInfo[];
  itmes: number;
  pages: number;
}

export interface JobInfo {
  id: string;
  jobPostingKey: string;
  companyName: string;
  title: string;
  techStack: string[];
  endDate: string;
}

export interface PostJobPosting {
  title: string;
  jobCategory: string;
  career: number;
  techStack: string[];
  jobPostingStep: string[];
  workLocation: string;
  education: string;
  employmentType: string;
  salary: number;
  workTime: string;
  startDate: string;
  endDate: string;
  jobPostingContent: string;
  passingNumber: number;
}

export interface JobPostingResponse {
  jobPostingKey: string;
  imageUrl: string;
}

export interface JobPostingDetail {
  companyKey: string;
  title: string;
  jobCategory: string;
  career: number;
  techStack: string[];
  step: string[];
  workLocation: string;
  education: string;
  employmentType: string;
  salary: number;
  workTime: string;
  startDate: string;
  endDate: string;
  jobPostingContent: string;
  image: string;
}

export interface JobPostingForCompany {
  jobPostingkey: string;
  title: string;
  jobCategory: string;
  startDateTime: Date;
  endDateTime: Date;
}

export type JobPostingList = JobPostingForCompany[];

// json-server
export interface JobPosting {
  id: string;
  jobPostingKey: string;
  companyKey: string;
  companyName: string;
  title: string;
  jobCategory: string;
  career: number;
  workLocation: string;
  education: string;
  employmentType: string;
  salary: number;
  workTime: string;
  startDate: string;
  endDate: string;
  jobPostingContent: string;
  techStack: string[];
  step: string[];
  passingNumber: number;
  image: string;
}

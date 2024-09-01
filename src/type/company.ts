export interface CompanyInfo {
  id: string;
  companyKey: string;
  companyName?: string;
  employees: number;
  companyAge: string;
  companyUrl: string;
  boss: string;
  address: string;
}

export interface PostedJobPoting {
  jobPostingKey: string;
  title: string;
  career: number;
  endDate: string;
}

export interface InfoItem {
  title: string;
  desc: string | number | Date;
}

export interface RecruitBoardData {
  stepId: number;
  stepName: string;
  candidateTechStackInterviewInfoDtoList: {
    candidateKey: string;
    candidateName: string;
    resumeKey: string;
    techStack: string[];
    scheduleDateTime: string | null;
  }[];
}

export interface RecruitBoardResponse {
  jobPostingKey: string;
  candidateList: RecruitBoardData[];
}

export interface CandidateInfo {
  candidateKey: string;
  candidateName: string;
  resumeKey: string;
  techStack: string[];
  scheduleDateTime: string | null;
}

export interface NextStepBody {
  currentStepId: number;
  candidateKeys: string[];
}

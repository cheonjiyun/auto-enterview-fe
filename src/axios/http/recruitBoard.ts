import { NextStepBody, RecruitBoardResponse } from "../../type/recruitBoard";
import { http } from "../instances";

// recruit-board 페이지 정보 한 번에 불러오기
export const getRecruitBoardData = (jobPostingKey: string) => {
  return http.get<RecruitBoardResponse[]>(`/job-postings/${jobPostingKey}/candidates-list`);
};

// 지원자들 다음 단계로 넘기기
export const putNextStep = (jobPostingKey: string, body: NextStepBody) => {
  return http.put(`/job-postings/${jobPostingKey}/edit-step`, body);
};

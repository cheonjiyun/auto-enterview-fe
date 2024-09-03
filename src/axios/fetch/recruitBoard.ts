import { RecruitBoardResponse } from "../../type/recruitBoard";
import { getRecruitBoardData } from "../http/recruitBoard";

// 단계 및 지원자 목록, 일정 정보
export const fetchCandidates = async (jobPostingKey: string | undefined) => {
  if (!jobPostingKey) return;

  const data: RecruitBoardResponse = await getRecruitBoardData(jobPostingKey);
  return data["candidateList"];
};

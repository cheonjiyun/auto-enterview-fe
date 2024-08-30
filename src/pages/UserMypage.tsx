import styled from "styled-components";
import { Container, Inner, SubTitle, Wrapper } from "../assets/style/Common";
import {
  Dday,
  Info,
  InfoDesc,
  InfoTitle,
  Label,
  LabelWrap,
  ListStep,
  ListTitle,
  RecruitList,
  RecruitLists,
  Top,
  UserInfo,
} from "../assets/style/MypageStyle";
import { useEffect, useState } from "react";
import { getResume } from "../axios/http/resume";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authUserState } from "../recoil/store";
import { getAppliedJobPostings } from "../axios/http/candidate";
import { AppliedJobPostingsList } from "../type/candidate";
import { getDday, getDdayNumber } from "../utils/Format";

const UserMypage = () => {
  const [isResume, setIsResume] = useState(false);
  const [jobPostingList, setJobPostingList] = useState<AppliedJobPostingsList[]>([]);
  const authUser = useRecoilValue(authUserState);

  useEffect(() => {
    if (!authUser) return;
    // 이력서가 등록되어 있는지 확인
    const fetchResume = async () => {
      try {
        const response = await getResume(authUser.user.key);
        if (response.title !== null) setIsResume(true);
      } catch (error) {
        alert("이력서를 불러오는데 문제가 생겼습니다.");
        setIsResume(false);
      }
    };
    fetchResume();
  }, [authUser]);

  useEffect(() => {
    if (!authUser) return;
    // 내가 지원한 공고 목록
    const fetchApplied = async () => {
      try {
        const appliedJobPostingsList = await getAppliedJobPostings(authUser.user.key);
        setJobPostingList(appliedJobPostingsList);
      } catch (error) {
        alert("지원한 공고를 불러오는데 문제가 생겼습니다.");
      }
    };
    fetchApplied();
  }, [authUser]);

  return (
    <Wrapper>
      <Inner className="inner-1200">
        <Container>
          <UserTop>
            <SubTitle>응시자 정보</SubTitle>
            {isResume ? (
              <ReadResume to={`/view-resume/${authUser?.user.key}`}>이력서 보기</ReadResume>
            ) : (
              <CreateResume to="/create-resume">이력서 생성</CreateResume>
            )}
          </UserTop>
          <UserInfo>
            <Info className="text">
              <InfoTitle>이름</InfoTitle>
              <InfoDesc>{authUser?.user.name}</InfoDesc>
            </Info>
            <Info className="text">
              <InfoTitle>이메일</InfoTitle>
              <InfoDesc>{authUser?.user.email}</InfoDesc>
            </Info>
          </UserInfo>
        </Container>
        <Container>
          <SubTitle className="sub-title">내가 지원한 공고 목록</SubTitle>
          <RecruitLists>
            {jobPostingList?.map(jobPosting => (
              <RecruitList key={jobPosting.jobPostingKey}>
                <LabelWrap>
                  <Label dday={getDdayNumber(jobPosting.endDate)} />
                  <Dday>{getDday(jobPosting.endDate)}</Dday>
                </LabelWrap>
                <UserListTitle to={`/jobpost-detail/${jobPosting.jobPostingKey}`}>
                  {jobPosting.title}
                </UserListTitle>
                <ListStep>{jobPosting.stepName}</ListStep>
              </RecruitList>
            ))}
          </RecruitLists>
        </Container>
      </Inner>
    </Wrapper>
  );
};

const UserTop = styled(Top)`
  justify-content: space-between;
`;

const ReadResume = styled(Link)`
  padding: 16px 48px;
  background-color: var(--sub-color);
  border-radius: var(--button-radius);
  font-size: 1.2rem;
  color: #fff;
`;

const CreateResume = styled(ReadResume)`
  background-color: var(--primary-color);
`;

const UserListTitle = styled(ListTitle)`
  max-width: 600px;
  padding-right: 24px;
`;

export default UserMypage;

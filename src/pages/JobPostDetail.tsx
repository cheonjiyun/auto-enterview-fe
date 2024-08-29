import styled from "styled-components";
import { Container, Inner, Wrapper } from "../assets/style/Common";
import { CiEdit } from "react-icons/ci";
import { IconButton } from "../assets/style/ReactIconButton";
import {
  deleteCompaniesJobPosting,
  getJobPosting,
  postJobPostingApply,
} from "../axios/http/jobPosting";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { JobPostingDetail } from "../type/jobPosting";
import { getDateFormat, getDday } from "../utils/Format";
import { CompanyInfo } from "../type/company";
import { Helmet } from "react-helmet-async";
import { getCompanyInfo } from "../axios/http/company";
import { useRecoilValue } from "recoil";
import { authUserState } from "../recoil/store";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";

const JobPostDetail = () => {
  const navigate = useNavigate();
  const authUser = useRecoilValue(authUserState);
  const { jobPostingKey } = useParams();

  const [jobPostingInfo, setJobPostingInfo] = useState<JobPostingDetail>({
    companyKey: "",
    title: "공고제목",
    jobCategory: "",
    career: 4,
    techStack: [],
    step: ["서류전형", "1차면접", "2차면접"],
    workLocation: "",
    education: "4년제",
    employmentType: "정규직",
    salary: 3000,
    workTime: "10:00 ~ 19:00",
    startDate: "2024-07-18",
    endDate: "2024-07-18",
    jobPostingContent: "",
    image: "",
  });
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: "(주)안드로메다",
    employees: 1315,
    companyAge: "2024-07-18",
    companyUrl: "https://www.naver.com",
    boss: "데애표",
    address: "부산광역시 강서구 녹산산단382로14번가길 10~29번지(송정동)",
  });

  useEffect(() => {
    (async () => {
      if (!jobPostingKey) return; // url에 jobPostingKey가 없음

      // 공고내용
      try {
        const response = await getJobPosting(jobPostingKey);
        setJobPostingInfo(response);

        // 회사정보
        const companyResponse = await getCompanyInfo(response.companyKey);
        let companyURL = companyResponse.companyUrl;

        if (!companyURL.startsWith("http://") && !companyURL.startsWith("https://")) {
          companyURL = `https://${companyURL}`;
        }

        setCompanyInfo({
          ...companyResponse,
          companyUrl: companyURL,
        });
      } catch (e) {
        if (axios.isAxiosError(e)) {
          if (e.response?.status == 404) {
            alert("마감 기한이 지난 공고 입니다.");
            if (!authUser) {
              navigate("/");
            } else if (authUser?.user.role == "ROLE_COMPANY") {
              navigate("/company-mypage");
            } else if (authUser?.user.role == "ROLE_CANDIDATE") {
              navigate("/user-mypage");
            }
          }
        }
      }
    })();
  }, [authUser, jobPostingKey, navigate]);

  // 수정하기
  const goEdit = () => {
    navigate("/create-jobpost", {
      state: { jobPostInfo: jobPostingInfo, jobPostingKey: jobPostingKey },
    });
  };

  // 지원하기
  const Apply = async () => {
    if (!jobPostingKey) return; // url에 jobPostingKey가 없음

    if (!authUser) {
      //로그인하지 않았다면 로그인으로 보내기 alert
      if (confirm("로그인 하시겠습니까?")) navigate("/login");
    } else if (confirm("정말 지원하시겠습니까?")) {
      // 로그인한 사용자만
      try {
        await postJobPostingApply(jobPostingKey);
        alert("지원되었습니다.");
      } catch (e) {
        if (axios.isAxiosError(e)) {
          if (e.response?.status == 403) {
            alert("지원할 수 없습니다.");
          } else {
            alert(e.response?.data.message);
          }
        }
      }
    }
  };

  // 삭제하기
  const deleteJobPosting = async () => {
    if (!jobPostingKey) return; // url에 jobPostingKey가 없음

    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteCompaniesJobPosting(jobPostingKey);
        navigate("/company-mypage");
      } catch (e) {
        if (axios.isAxiosError(e)) {
          alert(e.response?.data.message);
        }
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{jobPostingInfo?.title}</title>
      </Helmet>
      <Wrapper className="text">
        <Inner className="inner-1200">
          <Container>
            <Top>
              <DeadLineContainer>
                <div>공고마감일자 | {getDateFormat(new Date(jobPostingInfo.endDate))}</div>
                <Dday>({getDday(jobPostingInfo.endDate)})</Dday>
              </DeadLineContainer>
              {jobPostingInfo.companyKey == authUser?.user.key && (
                <EditDeleteButtonContianer>
                  <IconButton className="delete" onClick={deleteJobPosting}>
                    <MdDeleteForever />
                  </IconButton>
                  <IconButton className="edit" onClick={goEdit}>
                    <CiEdit />
                  </IconButton>
                </EditDeleteButtonContianer>
              )}
            </Top>
            <Title>
              <InfoDesc>{jobPostingInfo?.title}</InfoDesc>
            </Title>
            <InfoContainer>
              <Info>
                <InfoTitle>채용직무</InfoTitle>
                <InfoDesc>{jobPostingInfo?.jobCategory}</InfoDesc>
              </Info>
              <Info>
                <InfoTitle>기술스택</InfoTitle>
                <InfoDesc>
                  {jobPostingInfo?.techStack.length === 1
                    ? jobPostingInfo.techStack[0]
                    : jobPostingInfo.techStack.join(", ")}
                </InfoDesc>
              </Info>
              <Info>
                <InfoTitle>고용형태</InfoTitle>
                <InfoDesc>{jobPostingInfo?.employmentType}</InfoDesc>
              </Info>
              <Info>
                <InfoTitle>근무시간</InfoTitle>
                <InfoDesc>{jobPostingInfo?.workTime}</InfoDesc>
              </Info>
              <Info>
                <InfoTitle>필요경력</InfoTitle>
                <InfoDesc>
                  {jobPostingInfo?.career == -1
                    ? "경력무관"
                    : jobPostingInfo?.career == 0
                      ? "신입"
                      : `${jobPostingInfo?.career}년`}
                </InfoDesc>
              </Info>
              <Info>
                <InfoTitle>필요학력</InfoTitle>
                <InfoDesc>{jobPostingInfo?.education}</InfoDesc>
              </Info>
              <Info>
                <InfoTitle>급여</InfoTitle>
                <InfoDesc>
                  {jobPostingInfo?.salary == -1
                    ? "회사내규에따름"
                    : `${jobPostingInfo?.salary}만원`}
                </InfoDesc>
              </Info>
              <Info>
                <InfoTitle>접수기간</InfoTitle>
                <InfoDesc>
                  {getDateFormat(new Date(jobPostingInfo?.startDate))} ~{" "}
                  {getDateFormat(new Date(jobPostingInfo?.endDate))}
                </InfoDesc>
              </Info>
              <LongInfo>
                <InfoTitle>근무지</InfoTitle>
                <InfoDesc>{jobPostingInfo.workLocation}</InfoDesc>
              </LongInfo>
              <LongInfo>
                <InfoTitle>전형절차</InfoTitle>
                <StepContainer>
                  {jobPostingInfo.step.map((stepName, idx) => {
                    return (
                      <Step key={`${idx} ${stepName}`}>
                        <StepNumber>{idx + 1}단계</StepNumber>
                        <p>{stepName}</p>
                      </Step>
                    );
                  })}
                </StepContainer>
              </LongInfo>
            </InfoContainer>
            <ContentsContianer>
              <h2>공고내용</h2>
              <div style={{ whiteSpace: "pre-line" }}>{jobPostingInfo.jobPostingContent}</div>
              {jobPostingInfo.image && (
                <ContentImage src={jobPostingInfo.image} alt="채용공고 설명 이미지" />
              )}
            </ContentsContianer>
          </Container>
          <Container>
            <h2>회사정보</h2>
            <InfoContainer>
              <CompanyName>{companyInfo.companyName}</CompanyName>
              <Info>
                <InfoTitle>대표자</InfoTitle>
                <InfoDesc>{companyInfo.boss}</InfoDesc>
              </Info>
              <Info>
                <InfoTitle>사원수</InfoTitle>
                <InfoDesc>
                  {companyInfo.employees == 0 ? "" : `${companyInfo.employees}명`}
                </InfoDesc>
              </Info>
              <Info>
                <InfoTitle>회사 홈페이지</InfoTitle>
                <InfoDescLink href={companyInfo.companyUrl} target="_blank">
                  {companyInfo.companyUrl}
                </InfoDescLink>
              </Info>
              <Info>
                <InfoTitle>설립년도</InfoTitle>
                <InfoDesc>
                  {companyInfo.companyAge && `${new Date(companyInfo.companyAge).getFullYear()}년`}
                </InfoDesc>
              </Info>
              <LongInfo>
                <InfoTitle>주소</InfoTitle>
                <InfoDesc>{companyInfo.address}</InfoDesc>
              </LongInfo>
            </InfoContainer>
          </Container>
          {jobPostingInfo.companyKey == authUser?.user.key || (
            <ApplyButton onClick={Apply}>지원하기</ApplyButton>
          )}
        </Inner>
      </Wrapper>
    </>
  );
};

const Top = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DeadLineContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Dday = styled.div`
  color: var(--color-red);
`;

const Title = styled.h2``;

const InfoContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(2, 1fr);
  column-gap: 16px;
  row-gap: 40px;
  padding: 40px;
  background-color: var(--bg-light-blue);
  border-radius: var(--box-radius);

  @media screen and (max-width: 1000px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Info = styled.div`
  display: flex;

  @media screen and (max-width: 500px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const InfoTitle = styled.p`
  width: 150px;
  font-weight: 700;
  flex-shrink: 0;
`;

const InfoDesc = styled.div``;

const InfoDescLink = styled.a`
  text-decoration: underline;
`;

const ContentsContianer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContentImage = styled.img`
  max-width: 100%;
`;

const LongInfo = styled(Info)`
  grid-column-start: 1;
  grid-column-end: 3;

  @media screen and (max-width: 1000px) {
    grid-column-end: 1;
  }
`;

const StepContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;

  @media screen and (max-width: 500px) {
    justify-content: center;
  }
`;

const Step = styled.div`
  width: 160px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;

  &:not(:first-child)::before {
    content: "";
    position: absolute;
    top: calc(8px + 0.4rem);
    left: -20px;
    width: 63px;
    height: 2px;
    background-color: var(--primary-color);
  }

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: calc(8px + 0.4rem);
    left: 117px;
    width: 63px;
    height: 2px;
    background-color: var(--primary-color);
  }
`;

const StepNumber = styled.div`
  width: 74px;
  padding: 8px 16px;
  color: var(--primary-color);
  font-size: 0.8rem;
  font-weight: 700;
  border: 2px solid var(--primary-color);
  border-radius: var(--box-radius);
`;

const CompanyName = styled(LongInfo)`
  font-size: 1.3rem;
  font-weight: 700;
`;

const ApplyButton = styled.button`
  margin: 100px auto;
  padding: 32px 104px;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  background-color: var(--primary-color);
  border-radius: var(--button-radius);

  transition: all 0.1s;
  &:active {
    transform: scale(99%);
  }
`;

const EditDeleteButtonContianer = styled.div`
  display: flex;
  gap: 10px;
  position: absolute;
  top: 0;
  right: 0;
`;

export default JobPostDetail;

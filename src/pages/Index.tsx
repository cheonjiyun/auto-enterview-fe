import styled from "styled-components";
import { Wrapper } from "../assets/style/Common";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authUserState } from "../recoil/store";
import { getJobPostings, postJobPostingApply } from "../axios/http/jobPosting";
import { useEffect, useRef, useState } from "react";
import { JobInfo } from "../type/jobPosting";
import { getDday } from "../utils/Format";
import { getResume } from "../axios/http/resume";
import { getCompanyInfo } from "../axios/http/company";
import axios from "axios";

const Index = () => {
  const authUser = useRecoilValue(authUserState);
  const [jobInfos, setJobInfos] = useState<JobInfo[]>([]);
  const [page, setPage] = useState(1);
  // const totalPage = useRef(0);
  const [isInfoMessage, setIsInfoMessage] = useState(false);

  const navigate = useNavigate();
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => {
            // if (prevPage < totalPage.current) return prevPage + 1;
            // return prevPage;
            return prevPage + 1;
          });
        }
      },
      {
        threshold: 0.1,
      },
    );

    const currentObserverTarget = observerTarget.current;
    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      const response = await getJobPostings(page);
      // totalPage.current = response.pages;

      setJobInfos(prevJobInfos => {
        const newJobInfos = response.filter(
          jobInfo => !prevJobInfos.some(info => info.jobPostingKey === jobInfo.jobPostingKey),
        );
        return [...prevJobInfos, ...newJobInfos];
      });
    })();
  }, [page]);

  useEffect(() => {
    (async () => {
      if (!authUser) {
        setIsInfoMessage(false);
        return;
      }

      if (authUser.user.role === "ROLE_CANDIDATE") {
        const response = await getResume(authUser.user.key);
        if (response.title == null) setIsInfoMessage(true);
      } else if (authUser.user.role === "ROLE_COMPANY") {
        const response = await getCompanyInfo(authUser.user.key);
        if (!response.boss) setIsInfoMessage(true);
      }
    })();
  }, [authUser]);

  const goDetail = (jobPostingKey: string) => {
    navigate(`/jobpost-detail/${jobPostingKey}`);
  };

  const apply = async (jobPostingKey: string) => {
    if (!jobPostingKey) return;

    if (!authUser) {
      if (confirm("로그인 하시겠습니까?")) navigate("/login");
    } else if (confirm("정말 지원하시겠습니까?")) {
      try {
        await postJobPostingApply(jobPostingKey);
        alert("지원되었습니다.");
      } catch (e) {
        if (axios.isAxiosError(e)) {
          if (e.response?.status === 403) {
            alert("지원할 수 없습니다.");
          } else {
            alert(e.response?.data.message);
          }
        }
      }
    }
  };

  return (
    <Wrapper className="inner-1200">
      {isInfoMessage && (
        <InfoMessage>
          {!authUser
            ? ""
            : authUser.user.role === "ROLE_CANDIDATE"
              ? "아직 이력서를 작성하지 않았습니다."
              : "아직 회사정보를 작성하지 않았습니다."}
          <br></br>
          마이페이지에서 작성해주세요.
        </InfoMessage>
      )}
      <Title className="title">채용 공고</Title>
      <JobsContainer>
        {jobInfos.map(jobInfo => (
          <JobContainer onClick={() => goDetail(jobInfo.jobPostingKey)} key={jobInfo.jobPostingKey}>
            <CompanyName>{jobInfo.companyName}</CompanyName>
            <JobTitle>{jobInfo.title}</JobTitle>
            <TechStack>{jobInfo.techStack.map(stack => `#${stack} `)}</TechStack>
            <ApplyButton
              onClick={event => {
                event.stopPropagation();
                apply(jobInfo.jobPostingKey);
              }}
            >
              지원하기
            </ApplyButton>
            <Dday>{getDday(jobInfo.endDate)}</Dday>
          </JobContainer>
        ))}
      </JobsContainer>
      <Observer ref={observerTarget}></Observer>
    </Wrapper>
  );
};

const InfoMessage = styled.p`
  margin-bottom: 100px;
  text-align: center;
  color: var(--color-red);
  line-height: 120%;
`;

const Title = styled.h2`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-gray-200);
`;

const JobsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 16px;
`;

const JobContainer = styled.div`
  position: relative;
  min-width: 270px;
  display: flex;
  align-items: start;
  flex-direction: column;
  padding: 16px;
  background-color: var(--bg-light-blue);
  border-radius: var(--button-radius);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    filter: brightness(98%);
  }
`;

const CompanyName = styled.p`
  width: calc(100% - 40px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const JobTitle = styled.p`
  width: 100%;
  margin-top: 14px;
  font-size: 1.2rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TechStack = styled.p`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 16px;
  color: #707070;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Dday = styled.p`
  right: 16px;
  position: absolute;
  font-size: 0.8rem;
  color: var(--color-red);
`;

const ApplyButton = styled.button`
  align-self: flex-end;
  color: #ffffff;
  padding: 8px 16px;
  background-color: var(--primary-color);
  border-radius: var(--button-radius);
  font-family: "Pretendard";
  font-weight: 400;

  &:hover {
    filter: brightness(110%);
  }

  &:active {
    transform: scale(99%);
  }
`;

const Observer = styled.div`
  height: 10vh;
`;

export default Index;

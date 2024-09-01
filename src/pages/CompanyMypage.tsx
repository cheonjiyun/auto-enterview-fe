import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { GiSaveArrow } from "react-icons/gi";
import { HiOutlinePlus } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container, Inner, SubTitle, UserName, Wrapper } from "../assets/style/Common";
import { IconButton } from "../assets/style/ReactIconButton";
import {
  Dday,
  Info,
  InfoDesc,
  InfoTitle,
  Label,
  LabelWrap,
  ListCareer,
  ListTitle,
  RecruitList,
  RecruitLists,
  Top,
  UserInfo,
} from "../assets/style/MypageStyle";
import { getPostedJobPostings } from "../axios/http/jobPosting";
import { useRecoilValue } from "recoil";
import { authUserState } from "../recoil/store";
import { getDday, getDdayNumber } from "../utils/Format";
import { InfoItem, PostedJobPoting } from "../type/company";
import { getCompanyInfo, postCompanyInfo, putCompanyInfo } from "../axios/http/company";
import { Helmet } from "react-helmet-async";

const CompanyMypage = () => {
  const [info, setInfo] = useState<InfoItem[]>([
    { title: "대표자", desc: "" },
    { title: "설립년도", desc: "" },
    { title: "주소", desc: "" },
    { title: "사원수", desc: "" },
    { title: "회사 홈페이지 URL", desc: "" },
  ]);
  const [jobPostingList, setJobPostingList] = useState<PostedJobPoting[]>();
  const [editMode, setEditMode] = useState(false);
  const [bossValue, setBossValue] = useState("");
  const [ageValue, setAgeValue] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [employeesValue, setEmployeesValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const authUser = useRecoilValue(authUserState);
  const navigate = useNavigate();
  const values = [bossValue, ageValue, addressValue, employeesValue, urlValue];

  useEffect(() => {
    if (!authUser || authUser.user.role !== "ROLE_COMPANY") return;
    // 회사정보 불러오기
    const fetchCompanyInfo = async () => {
      try {
        const { boss, companyAge, address, employees, companyUrl } = await getCompanyInfo(
          authUser.user.key,
        );
        setInfo([
          { title: "대표자", desc: boss },
          { title: "설립년도", desc: companyAge },
          { title: "주소", desc: address },
          { title: "사원수", desc: employees },
          { title: "회사 홈페이지 URL", desc: companyUrl },
        ]);

        // 상태를 각각 업데이트
        setBossValue(boss);
        setAgeValue(companyAge);
        setAddressValue(address);
        setEmployeesValue(employees.toString());
        setUrlValue(companyUrl);
      } catch (error) {
        alert("회사 정보를 불러오는데 문제가 생겼습니다.");
      }
    };

    fetchCompanyInfo();
  }, [authUser]);

  useEffect(() => {
    if (!authUser || authUser.user.role !== "ROLE_COMPANY") return;
    // 채용공고 목록 불러오기
    const fetchJobPosting = async () => {
      try {
        const response = await getPostedJobPostings(authUser.user.key);
        setJobPostingList(response);
      } catch (error) {
        alert("채용공고 목록을 불러오는데 문제가 생겼습니다.");
      }
    };
    fetchJobPosting();
  }, [authUser]);

  // 회사정보 input 이벤트
  const onChange = (title: string, newValue: string) => {
    if (title === "대표자") {
      setBossValue(newValue);
    } else if (title === "설립년도") {
      setAgeValue(newValue);
    } else if (title === "주소") {
      setAddressValue(newValue);
    } else if (title === "사원수") {
      setEmployeesValue(newValue);
    } else if (title === "회사 홈페이지 URL") {
      setUrlValue(newValue);
    }
  };

  // 회사정보 수정
  const editInfo = () => {
    setEditMode(edit => !edit);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditMode(edit => !edit);
  };

  // 회사정보 저장
  const saveInfo = async () => {
    if (!authUser || authUser.user.role !== "ROLE_COMPANY") return;

    const body = {
      id: authUser.user.key,
      companyKey: authUser.user.key,
      companyName: authUser.user.name,
      employees: Number(employeesValue),
      companyAge: ageValue,
      companyUrl: urlValue,
      boss: bossValue,
      address: addressValue,
    };

    const bodyFill = Object.values(body).every(v => v.toString().trim());

    if (bodyFill) {
      const isEdit = info.some(v => v.desc);

      try {
        if (isEdit) {
          console.log(body);

          await putCompanyInfo(authUser.user.key, body);
        } else {
          await postCompanyInfo(body);
        }
        setEditMode(edit => !edit);
        setInfo([
          { title: "대표자", desc: bossValue },
          { title: "설립년도", desc: ageValue },
          { title: "주소", desc: addressValue },
          { title: "사원수", desc: employeesValue },
          { title: "회사 홈페이지 URL", desc: urlValue },
        ]);
      } catch (error) {
        alert("회원 정보를 저장하는데 문제가 발생했습니다. 다시 시도해주세요.");
      }
    } else {
      alert("회사 정보를 모두 입력해주세요.");
    }
  };

  const goToRecruitBoard = (
    e: React.MouseEvent<HTMLButtonElement>,
    jobPostingKey: string,
    title: string,
  ) => {
    e.stopPropagation();
    navigate(`/recruit-board/${jobPostingKey}?title=${encodeURIComponent(title)}`);
  };

  return (
    <>
      <Helmet>
        <title>AutoEnterview 마이페이지</title>
      </Helmet>
      <Wrapper>
        <Inner className="inner-1200">
          <UserName>{authUser?.user.name}</UserName>
          <Container>
            <Top>
              <SubTitle>회사 정보</SubTitle>
              <Buttons>
                {editMode ? (
                  <>
                    <IconButton className="cancel" onClick={cancelEdit}>
                      <IoMdClose />
                    </IconButton>
                    <IconButton className="save" onClick={saveInfo}>
                      <GiSaveArrow />
                    </IconButton>
                  </>
                ) : (
                  <IconButton className="edit" onClick={editInfo}>
                    <CiEdit />
                  </IconButton>
                )}
              </Buttons>
            </Top>
            <UserInfo>
              {info.map(({ title, desc }, idx) => (
                <Info className="text" key={title}>
                  <InfoTitle>{title}</InfoTitle>
                  {editMode ? (
                    <InfoInput
                      type={title === "설립년도" ? "date" : title === "사원수" ? "number" : "text"}
                      name={title}
                      value={values[idx]}
                      min={typeof values[idx] === "number" ? 0 : undefined}
                      onChange={e => {
                        const newValue = e.target.value;
                        onChange(title, newValue);
                      }}
                    />
                  ) : (
                    <InfoDesc>
                      {desc instanceof Date ? desc.toISOString().substring(0, 10) : desc}
                    </InfoDesc>
                  )}
                </Info>
              ))}
            </UserInfo>
          </Container>
          <Container>
            <Top>
              <SubTitle className="sub-title">등록한 채용 공고 목록</SubTitle>
              <CreatePost to="/create-jobpost">
                <HiOutlinePlus />
              </CreatePost>
            </Top>
            <RecruitLists>
              {jobPostingList?.map(jobPosting => (
                <RecruitList key={jobPosting.jobPostingKey}>
                  <LabelWrap>
                    <Label dday={getDdayNumber(jobPosting.endDate)} />
                    <Dday>{getDday(jobPosting.endDate)}</Dday>
                  </LabelWrap>
                  <ListTitle to={`/jobpost-detail/${jobPosting.jobPostingKey}`}>
                    {jobPosting.title}
                  </ListTitle>
                  <ListCareer>
                    {jobPosting.career === 0
                      ? "신입"
                      : jobPosting.career == -1
                        ? "경력무관"
                        : jobPosting.career + "년 이상"}
                  </ListCareer>
                  <StepsButton
                    onClick={e => goToRecruitBoard(e, jobPosting.jobPostingKey, jobPosting.title)}
                  >
                    채용단계 관리
                  </StepsButton>
                </RecruitList>
              ))}
            </RecruitLists>
          </Container>
        </Inner>
      </Wrapper>
    </>
  );
};

const Buttons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const InfoInput = styled.input`
  position: relative;
  width: calc(100% - 150px);
  padding: 2px 0;
  border: none;
  border-bottom: 1px dashed var(--border-gray-100);
  background-color: transparent;

  // 캘린더 클릭 영역을 input 전체 영역으로 설정
  &[type="date"]::-webkit-calendar-picker-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-position: 100% -3px;
    cursor: pointer;
  }
`;

const CreatePost = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--button-radius);
  background-color: var(--primary-color);
  font-size: 1.5rem;
  color: #fff;
`;

const StepsButton = styled.button`
  padding: 16px 32px;
  border-radius: var(--button-radius);
  background-color: var(--primary-color);
  font-size: 1.125rem;
  color: #fff;
`;

export default CompanyMypage;

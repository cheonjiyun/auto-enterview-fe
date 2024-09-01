import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import { MdOutlineEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getResume } from "../axios/http/resume";
import { useRecoilValue } from "recoil";
import { authUserState } from "../recoil/store";
import { ResumeData } from "../type/resume";

const ViewResume: React.FC = () => {
  const { candidateKey } = useParams<{ candidateKey: string }>();
  const authUser = useRecoilValue(authUserState);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const navigate = useNavigate();

  // 이력서 삭제
  // const [deleteConfirm, setDeleteConfirm] = useState(false);
  // const handleDelete = async () => {
  //   if (deleteConfirm) {
  //     alert("이력서가 이미 삭제되었습니다!");
  //     return;
  //   } else {
  //     if (window.confirm("정말 삭제하시겠습니까?")) {
  //       try {
  //         await deleteResume(candidateKey!);
  //         alert("이력서가 삭제되었습니다!");
  //         setDeleteConfirm(true);
  //         navigate("/user-mypage");
  //       } catch (error) {
  //         console.error("삭제 실패:", error);
  //         alert("이력서 삭제에 실패했습니다. 다시 시도해주세요.");
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    if (!candidateKey) return;
    const fetchResume = async () => {
      try {
        const data = await getResume(candidateKey);
        console.log(data);

        setResumeData(data);
      } catch (error) {
        console.error("이력서 불러오기 실패:", error);
      }
    };

    if (candidateKey) {
      fetchResume();
    }
  }, [candidateKey]);

  const handleEdit = () => {
    if (window.confirm("지원한 공고에서도 이력서가 수정됩니다. 정말 수정하시겠어요?")) {
      navigate(`/create-resume`, { state: { resumeData } });
    }
  };

  // 로딩 중 상태 표시
  if (!resumeData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>이력서</title>
      </Helmet>
      <Wrapper className="inner-1200">
        <Title>
          이력서
          {candidateKey === authUser?.user.key && (
            <Icon>
              <Edit onClick={handleEdit}>
                <MdOutlineEdit size={20} />
              </Edit>
              {/* <Delete onClick={handleDelete}>
                <RiDeleteBin6Line size={20} />
              </Delete> */}
            </Icon>
          )}
        </Title>
        <All>
          <InputContainer>
            <H2 className="inputBox">" {resumeData.title} "</H2>
            <AllContainer>
              <Image>
                {resumeData.resumeImageUrl && (
                  <img
                    className="img"
                    src={resumeData.resumeImageUrl}
                    alt="Resume Image"
                    style={{ width: "200px", height: "250px" }}
                  />
                )}
              </Image>
              <FlexContainer>
                <H3 className="input textBox">{resumeData.name}</H3>
                <H3 className="input textBox">{resumeData.gender}</H3>
                <H3 className="input textBox">{resumeData.birthDate}</H3>
                <H3 className="input textBox">{resumeData.phoneNumber}</H3>
                <H3 className="input textBox">{resumeData.email}</H3>
                <H3 className="input addressBox">{resumeData.address}</H3>
              </FlexContainer>
            </AllContainer>
            <Line></Line>
          </InputContainer>

          <InputContainer>
            <InputTitle> [희망 직무] </InputTitle>
            <H3 className="input textBox">{resumeData.jobWant}</H3>
          </InputContainer>

          <InputContainer>
            <InputTitle> [기술 스택] </InputTitle>
            <H3 className="textBox">
              {resumeData.techStack && resumeData.techStack.length > 0
                ? resumeData.techStack.map((tech, index) => (
                    <Span key={index}>
                      #{tech}
                      {index < resumeData.techStack.length - 1 && ""}
                    </Span>
                  ))
                : "No tech stack available"}
            </H3>
          </InputContainer>

          <InputContainer className="school">
            <SchoolName>
              <InputTitle> [최종 학력] </InputTitle>
              <H3 className="input textBox">{resumeData.education}</H3>
            </SchoolName>
            <SchoolName>
              <InputTitle className="schoolName"> [학교명] </InputTitle>
              <H3 className="input textBox">{resumeData.schoolName}</H3>
            </SchoolName>
          </InputContainer>

          <InputContainer>
            <InputTitle> [경력] </InputTitle>
            <Container>
              {resumeData.career.map((resumeData, index) => (
                <Div key={index}>
                  <H3 className="textBox">회사명: {resumeData.companyName}</H3>
                  <H3 className="textBox">담당업무: {resumeData.jobCategory}</H3>
                  <H3 className="textBox">시작 날짜: {resumeData.startDate}</H3>
                  <H3 className="textBox">종료 날짜: {resumeData.endDate}</H3>
                </Div>
              ))}
            </Container>
          </InputContainer>

          <InputContainer>
            <InputTitle> [경험/활동/교육] </InputTitle>
            <Container>
              {resumeData.experience.map((resumeData, index) => (
                <Div key={index}>
                  <H3 className="textBox">회사명: {resumeData.experienceName}</H3>
                  <H3 className="textBox">시작 날짜: {resumeData.startDate}</H3>
                  <H3 className="textBox">종료 날짜: {resumeData.endDate}</H3>
                </Div>
              ))}
            </Container>
          </InputContainer>

          <InputContainer>
            <InputTitle> [자격/어학/수상] </InputTitle>
            <Container>
              {resumeData.certificates.map((resumeData, index) => (
                <Div key={index}>
                  <H3 className="textBox">취득명: {resumeData.certificateName}</H3>
                  <H3 className="textBox">취득일: {resumeData.certificateDate}</H3>
                </Div>
              ))}
            </Container>
          </InputContainer>

          <InputContainer>
            <InputTitle> [포트폴리오] </InputTitle>
            <Container>
              <H3 className="textBox">
                <a href={resumeData.portfolio} target="_blank" rel="noopener noreferrer">
                  {" "}
                  {resumeData.portfolio}{" "}
                </a>
              </H3>
            </Container>
          </InputContainer>
        </All>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  max-width: 1200px;
  padding: 0 24px;
  padding-bottom: 120px;
`;

const Div = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SchoolName = styled.div`
  margin-right: 50px;
`;

const Span = styled.span`
  margin-right: 15px;
  margin-left: 15px;
`;

const All = styled.div`
  border: solid #000694 5px;
`;

const Title = styled.h2`
  width: 100%;
  margin-bottom: 24px;
  margin-top: 150px;
  display: flex;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 50px;
  margin-bottom: 20px;
  &.school {
    display: flex;
    flex-direction: row;
  }
  &.schoolName {
    margin-left: 50px;
  }
`;

const AllContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const FlexContainer = styled.div`
  flex-direction: column;
  justify-content: flex-end;
  width: 50%;
`;

const Image = styled.div`
  width: 200px;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 80px 190px;
`;

const H2 = styled.h2`
  width: 100%;
  height: 40px;
  font-size: 30px;
  color: #222222;
  border: none;
  border-bottom: solid #000694 2px;
  margin-top: 10px;
  margin-bottom: 15px;
  position: relative;
  text-align: center;
`;

const H3 = styled.h3`
  width: 70px;
  margin-top: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 15px;
  &.input {
    width: 100%;
    height: 30px;
    font-size: 20px;
    color: #222222;
    border: none;
    border-bottom: solid #000694 1px;
    margin-bottom: 5px;
    padding-left: 10px;
    position: relative;
  }
  &.textBox {
    width: 200px;
    font-size: 15px;
  }

  &.addressBox {
    width: 300px;
    font-size: 15px;
  }
`;

const Line = styled.div`
  border-top: 2px solid #000694;
  margin: 10px 0px;
`;

const InputTitle = styled.p`
  margin-left: 20px;
  font-size: 23px;
`;

const Container = styled.div`
  margin-top: 5px;
  margin-bottom: 15px;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
`;

const Icon = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: 20px;
  gap: 15px;
`;

const Edit = styled.div`
  color: #000694;
  cursor: pointer;
`;

// const Delete = styled.div`
//   color: #000694;
//   cursor: pointer;
// `;

export default ViewResume;

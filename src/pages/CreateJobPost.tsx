import styled from "styled-components";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { JobPosting } from "../type/jobPosting";
import { postCompaniesJobPosting, putCompaniesJobPosting } from "../axios/http/jobPosting";
import { useLocation, useNavigate } from "react-router-dom";
import { getTwoDigit, toLocaleDate } from "../utils/Format";
import DatePickerDuration from "../components/input/DatePickerDuration";
import SelectInput from "../components/input/SelectInput";
import { InputDefault } from "../assets/style/input";
import Checkbox from "../components/input/Checkbox";
import TimePicker from "../components/input/TimePicker";
import { useRecoilValue } from "recoil";
import { authUserState } from "../recoil/store";
import { optionEducation, optionEmploymentType, optionJob, techStacks } from "../constants/options";
import { FREE_HOUR } from "../constants/Word";
import { RandomJobPostingKey } from "../utils/RandomKey";

interface JobPostingForm {
  jobCategory: string;
  title: string;
  career: string;
  techStack: string[];
  workLocation: string;
  education: string;
  employmentType: string;
  salary: string;
  startHour: Date;
  endHour: Date;
  startDate: Date;
  endDate: Date;
  jobPostingSteps: string[];
  jobPostingContent: string;
  passingNumber: number;
  image: File | null;
}

const CreateJobPost = () => {
  const location = useLocation();

  //유저
  const authUser = useRecoilValue(authUserState);

  // 필요경력, 급여같은 input에서 disable될 때 임시로 저장해두는 값
  const inputMemory = useRef({ career: "", salary: "" });
  const [freeHour, setFreeHour] = useState(false);

  const [formData, setFormData] = useState<JobPostingForm>({
    jobCategory: "",
    title: "",
    career: "",
    techStack: [],
    workLocation: "",
    education: "",
    employmentType: "",
    salary: "",
    startHour: new Date(2024, 7, 13, 9, 0),
    endHour: new Date(2024, 7, 13, 18, 0),
    startDate: new Date(),
    endDate: new Date(),
    jobPostingSteps: ["서류전형"],
    jobPostingContent: "",
    passingNumber: 20,
    image: null,
  });

  //전형절차단계
  //추가
  const [addStepValue, setAddStepValue] = useState("");
  const addStep = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault();
    if (addStepValue === "") return;

    setFormData(formData => {
      return {
        ...formData,
        jobPostingSteps: [...formData.jobPostingSteps, addStepValue],
      };
    });
    setAddStepValue("");
  };
  //삭제
  const deleteStep = (idx: number) => {
    const temp = [...formData.jobPostingSteps];
    temp.splice(idx, 1);

    setFormData({ ...formData, jobPostingSteps: temp });
  };

  //파일업로드
  // const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setFormData({ ...formData, image: event.target.files[0] });
  //   }
  // };

  const getStringWorkingHour = (startTime: Date, endTime: Date) => {
    return `${getTwoDigit(startTime.getHours())}:${getTwoDigit(startTime.getMinutes())} ~ ${getTwoDigit(endTime.getHours())}:${getTwoDigit(endTime.getMinutes())}`;
  };

  // 수정하기
  const editMode = location.state;
  const jobPostingInfo = location.state?.jobPostInfo;
  const jobPostingKey = location.state?.jobPostingKey;

  // 수정하기 할땐, 정보를 미리 넣어놓기
  useEffect(() => {
    if (jobPostingInfo) {
      if (jobPostingInfo.career != -1) inputMemory.current.career = jobPostingInfo.career;
      if (jobPostingInfo.salary != -1) inputMemory.current.salary = jobPostingInfo.salary;

      if (jobPostingInfo.workTime === FREE_HOUR) setFreeHour(true);

      setFormData({
        title: jobPostingInfo.title,
        jobCategory: optionJob.find(job => job.label == jobPostingInfo.jobCategory)?.value || "",
        career: jobPostingInfo.career,
        techStack: jobPostingInfo.techStack,
        workLocation: jobPostingInfo.workLocation,
        education: optionEducation.find(edu => edu.label == jobPostingInfo.education)?.value || "",
        employmentType: jobPostingInfo.employmentType,
        salary: jobPostingInfo.salary,
        startHour:
          jobPostingInfo.workTime === FREE_HOUR
            ? new Date(2024, 7, 13, 9, 0)
            : new Date(
                2024,
                7,
                13,
                +jobPostingInfo.workTime.slice(0, 2),
                +jobPostingInfo.workTime.slice(3, 5),
              ),
        endHour:
          jobPostingInfo.workTime === FREE_HOUR
            ? new Date(2024, 7, 13, 18, 0)
            : new Date(
                2024,
                7,
                13,
                +jobPostingInfo.workTime.slice(8, 10),
                +jobPostingInfo.workTime.slice(11, 13),
              ),
        startDate: new Date(jobPostingInfo.startDate),
        endDate: new Date(jobPostingInfo.endDate),
        jobPostingSteps: jobPostingInfo.step,
        jobPostingContent: jobPostingInfo.jobPostingContent,
        passingNumber: 20,
        image: null,
      });
    }
  }, [jobPostingInfo]);

  // input을 모두 채웠는지 체크
  const inputCheck = () => {
    return (
      formData.title &&
      formData.jobCategory &&
      Number(formData.career) >= -1 &&
      formData.techStack.length > 0 &&
      formData.jobPostingSteps.length > 1 &&
      formData.workLocation &&
      formData.education &&
      formData.employmentType &&
      formData.salary &&
      (freeHour || (formData.startHour && formData.endHour)) &&
      formData.startDate &&
      formData.endDate &&
      formData.passingNumber
    );
  };

  // 채용공고생성 api
  const navigate = useNavigate();

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();

    if (!authUser) {
      alert("유저정보없음 로그인해주세요.");
      return;
    }

    // const requestData: PostJobPosting = {
    //   title: formData.title,
    //   jobCategory: formData.jobCategory,
    //   career: +formData.career,
    //   techStack: formData.techStack,
    //   jobPostingStep: formData.jobPostingSteps,
    //   workLocation: formData.workLocation,
    //   education: formData.education,
    //   employmentType: formData.employmentType,
    //   salary: +formData.salary,
    //   workTime: freeHour ? FREE_HOUR : getStringWorkingHour(formData.startHour, formData.endHour),
    //   startDate: toLocaleDate(formData.startDate),
    //   endDate: toLocaleDate(formData.endDate),
    //   jobPostingContent: formData.jobPostingContent,
    //   passingNumber: +formData.passingNumber,
    // };

    // // 최종 body
    // const resultBody = new FormData();
    // if (formData.image) {
    //   resultBody.append("image", formData.image);
    // }

    // resultBody.append(
    //   "jobPostingInfo",
    //   new Blob([JSON.stringify(requestData)], { type: "application/json" }),
    // );

    // if (editMode) {
    //   await putCompaniesJobPosting(jobPostingKey, resultBody, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });
    //   navigate(`/jobpost-detail/${jobPostingKey}`);
    // } else {
    //   await postCompaniesJobPosting(authUser?.key, resultBody, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });
    //   navigate("/company-mypage");
    // }

    // json-server용
    const randomJobPostingKey = RandomJobPostingKey();
    const requestData: JobPosting = {
      id: randomJobPostingKey,
      jobPostingKey: randomJobPostingKey,
      companyKey: authUser.user.key,
      companyName: authUser.user.name,
      title: formData.title,
      jobCategory: optionJob.find(job => job.value == formData.jobCategory)?.label || "",
      career: +formData.career,
      techStack: formData.techStack,
      step: formData.jobPostingSteps,
      workLocation: formData.workLocation,
      education: optionEducation.find(edu => edu.value == formData.education)?.label || "",
      employmentType: formData.employmentType,
      salary: +formData.salary,
      workTime: freeHour ? FREE_HOUR : getStringWorkingHour(formData.startHour, formData.endHour),
      startDate: toLocaleDate(formData.startDate),
      endDate: toLocaleDate(formData.endDate),
      jobPostingContent: formData.jobPostingContent,
      passingNumber: +formData.passingNumber,
      image: "",
    };

    if (editMode) {
      await putCompaniesJobPosting(jobPostingKey, requestData);
      navigate(`/jobpost-detail/${jobPostingKey}`);
    } else {
      await postCompaniesJobPosting(authUser?.user.key, requestData);
      navigate("/company-mypage");
    }
  };

  return (
    <>
      <Helmet>
        <title>채용공고 생성</title>
      </Helmet>
      <Wrapper className="inner-1200">
        <Title>채용공고 생성</Title>
        <form onSubmit={onSubmit}>
          <InputContainer>
            <InputTitle>채용직무</InputTitle>
            <SelectInput
              placeholder="채용할 직무를 선택하세요"
              options={optionJob}
              value={formData.jobCategory}
              onChange={value => {
                setFormData({ ...formData, jobCategory: value });
              }}
            />
            <ErrorMessage>{formData.jobCategory ? "" : "채용할 직무를 선택해주세요."}</ErrorMessage>
          </InputContainer>
          <InputContainer>
            <InputTitle>제목</InputTitle>
            <InputDefault
              type="text"
              placeholder="공고 제목을 입력하세요"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <ErrorMessage>{formData.title ? "" : "공고 제목을 입력해주세요."}</ErrorMessage>
          </InputContainer>

          <InputContainer>
            <InputTitle>필요경력</InputTitle>

            {editMode ? (
              <EditModeText>
                {jobPostingInfo?.career == -1
                  ? "경력무관"
                  : jobPostingInfo?.career == 0
                    ? "신입"
                    : `${jobPostingInfo?.career}년`}
              </EditModeText>
            ) : (
              <>
                <InputContents>
                  <InputShortText
                    type="number"
                    placeholder="신입은 0"
                    className="text"
                    value={inputMemory.current.career}
                    onChange={event => {
                      setFormData({
                        ...formData,
                        career: event.target.value,
                      });
                      inputMemory.current.career = event.target.value;
                    }}
                    disabled={formData.career == "-1"}
                  />
                  <AdditionExplanation>년 이상</AdditionExplanation>
                  <Checkbox
                    id={"career-year"}
                    text="경력무관"
                    onChange={event => {
                      setFormData({
                        ...formData,
                        career: event.target.checked ? "-1" : inputMemory.current.career,
                      });
                    }}
                  />
                </InputContents>
                <ErrorMessage>{formData.career ? "" : "필요경력을 입력해주세요."}</ErrorMessage>
              </>
            )}
          </InputContainer>

          <InputContainerShortMargin>
            <InputTitle>기술스택</InputTitle>
            {editMode ? (
              <EditModeText>Kotlin, C++</EditModeText>
            ) : (
              <>
                <StackInputContainer>
                  {techStacks.map(stack => {
                    return (
                      <StackInputGroup key={stack}>
                        <Checkbox
                          id={stack}
                          text={stack}
                          onChange={event => {
                            if (event.target.checked) {
                              // 체크하면 추가
                              const temp = formData.techStack;
                              temp.push(stack);
                              setFormData({ ...formData, techStack: temp });
                            } else {
                              //해제하면 빼기
                              const temp = [...formData.techStack];
                              const result = temp.filter(el => el !== stack);
                              setFormData({ ...formData, techStack: result });
                            }
                          }}
                        />
                      </StackInputGroup>
                    );
                  })}
                </StackInputContainer>
                <ErrorMessage>
                  {formData.techStack.length > 0 ? "" : "테크스택을 1개이상 선택해주세요."}
                </ErrorMessage>
              </>
            )}
          </InputContainerShortMargin>

          <InputContainer>
            <InputTitle>근무지</InputTitle>
            <InputDefault
              type="text"
              placeholder="주소를 입력하세요"
              value={formData.workLocation}
              onChange={event => setFormData({ ...formData, workLocation: event.target.value })}
            />
            <ErrorMessage>{formData.workLocation ? "" : "근무지를 입력해주세요."}</ErrorMessage>
          </InputContainer>

          <InputContainer>
            <InputTitle>필요학력</InputTitle>
            {editMode ? (
              <EditModeText>
                {optionEducation.find(edu => edu.label == jobPostingInfo.education)?.label || ""}
              </EditModeText>
            ) : (
              <>
                <SelectInput
                  options={optionEducation}
                  placeholder="필요한 학력을 선택하세요"
                  value={formData.education}
                  onChange={value => setFormData({ ...formData, education: value })}
                />
                <ErrorMessage>{formData.education ? "" : "필요한 학력 입력해주세요."}</ErrorMessage>
              </>
            )}
          </InputContainer>

          <InputContainer>
            <InputTitle>고용형태</InputTitle>
            <SelectInput
              options={optionEmploymentType}
              placeholder="고용형태를 선택하세요"
              value={formData.employmentType}
              onChange={value => setFormData({ ...formData, employmentType: value })}
            />
            <ErrorMessage>{formData.employmentType ? "" : "고용형태를 선택해주세요."}</ErrorMessage>
          </InputContainer>

          <InputContainer>
            <InputTitle>급여</InputTitle>
            <InputContents>
              <>
                <InputShortText
                  type="number"
                  placeholder="연봉"
                  value={inputMemory.current.salary}
                  onChange={event => {
                    setFormData({
                      ...formData,
                      salary: event.target.value,
                    });
                    inputMemory.current.salary = event.target.value;
                  }}
                  disabled={+formData.salary == -1}
                />
                <AdditionExplanation>만원</AdditionExplanation>
                <Checkbox
                  id="pay"
                  text="회사내규에 따름"
                  checked={formData.salary == "-1"}
                  onChange={event => {
                    setFormData({
                      ...formData,
                      salary: event.target.checked ? "-1" : inputMemory.current.salary,
                    });
                  }}
                />
              </>
            </InputContents>
            <ErrorMessage>{formData.salary ? "" : "급여를 입력해주세요."}</ErrorMessage>
          </InputContainer>

          <InputContainer>
            <InputTitle>근무시간</InputTitle>
            <InputContents>
              <TimePicker
                value={formData.startHour}
                onChange={date => setFormData({ ...formData, startHour: date })}
                disabled={freeHour}
              />
              <BeteenString>~</BeteenString>
              <TimePicker
                value={formData.endHour}
                onChange={date => setFormData({ ...formData, endHour: date })}
                disabled={freeHour}
              />
              <Checkbox
                id="hourfree"
                text={FREE_HOUR}
                onChange={event => setFreeHour(event.target.checked)}
                checked={freeHour}
              />
            </InputContents>
            <ErrorMessage>
              {formData.startHour || formData.startHour ? "" : "근무시간을 선택해주세요."}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <InputTitle>접수기간</InputTitle>
            <InputContents>
              <DatePickerDuration
                startDate={formData.startDate}
                endDate={formData.endDate}
                onChangeStartDate={date => setFormData({ ...formData, startDate: date })}
                onChangeEndDate={date => setFormData({ ...formData, endDate: date })}
                betweenString="~"
              />
            </InputContents>
            <ErrorMessage>
              {formData.startDate || formData.endDate ? "" : "접수기간을 선택해주세요."}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <InputTitle>전형절차</InputTitle>
            {editMode ? (
              <StepContainer>
                {formData.jobPostingSteps.map((jobPostingStep, idx) => {
                  return (
                    <Step key={`${jobPostingStep} ${idx}`}>
                      <StepNumber>{idx + 1}단계</StepNumber>
                      {jobPostingStep}
                    </Step>
                  );
                })}
              </StepContainer>
            ) : (
              <>
                <InputContents>
                  <StepContainer>
                    {formData.jobPostingSteps.map((jobPostingStep, idx) => {
                      return (
                        <Step key={`${jobPostingStep} ${idx}`}>
                          <StepNumber>{idx + 1}단계</StepNumber>
                          {jobPostingStep}
                          {idx >= 1 && (
                            <StepDelete onClick={() => deleteStep(idx)}>
                              <svg
                                width="16"
                                height="17"
                                viewBox="0 0 16 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.8535 12.6463C12.9 12.6927 12.9368 12.7479 12.962 12.8086C12.9871 12.8693 13.0001 12.9343 13.0001 13C13.0001 13.0657 12.9871 13.1308 12.962 13.1915C12.9368 13.2522 12.9 13.3073 12.8535 13.3538C12.8071 13.4002 12.7519 13.4371 12.6912 13.4622C12.6305 13.4874 12.5655 13.5003 12.4998 13.5003C12.4341 13.5003 12.369 13.4874 12.3083 13.4622C12.2476 13.4371 12.1925 13.4002 12.146 13.3538L7.99979 9.20691L3.85354 13.3538C3.75972 13.4476 3.63247 13.5003 3.49979 13.5003C3.36711 13.5003 3.23986 13.4476 3.14604 13.3538C3.05222 13.26 2.99951 13.1327 2.99951 13C2.99951 12.8674 3.05222 12.7401 3.14604 12.6463L7.29291 8.50003L3.14604 4.35378C3.05222 4.25996 2.99951 4.13272 2.99951 4.00003C2.99951 3.86735 3.05222 3.7401 3.14604 3.64628C3.23986 3.55246 3.36711 3.49976 3.49979 3.49976C3.63247 3.49976 3.75972 3.55246 3.85354 3.64628L7.99979 7.79316L12.146 3.64628C12.2399 3.55246 12.3671 3.49976 12.4998 3.49976C12.6325 3.49976 12.7597 3.55246 12.8535 3.64628C12.9474 3.7401 13.0001 3.86735 13.0001 4.00003C13.0001 4.13272 12.9474 4.25996 12.8535 4.35378L8.70666 8.50003L12.8535 12.6463Z"
                                  fill="#210909"
                                />
                              </svg>
                            </StepDelete>
                          )}
                        </Step>
                      );
                    })}
                  </StepContainer>
                  <StepInputContianer>
                    <StepInput
                      type="text"
                      placeholder="예) 1차 면접"
                      className="text"
                      value={addStepValue}
                      onChange={event => setAddStepValue(event.target.value)}
                      onKeyDown={event => event.key === "Enter" && addStep(event)}
                    />
                    <Button type="button" className="text" onClick={e => addStep(e)}>
                      단계추가
                    </Button>
                  </StepInputContianer>
                </InputContents>
              </>
            )}
            <ErrorMessage>
              {formData.jobPostingSteps.length > 1 ? "" : "전형단계를 추가해주세요."}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <InputTitle>서류로 필터링 인원</InputTitle>
            <InputContents>
              <InputShortText
                type="number"
                value={formData.passingNumber}
                onChange={event =>
                  setFormData({ ...formData, passingNumber: Number(event.target.value) })
                }
              />
              <AdditionExplanation>명</AdditionExplanation>
            </InputContents>
            <ErrorMessage>
              {formData.passingNumber ? "" : "필터링 인원을 입력해주세요."}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <TitleContainer>
              <InputTitle>공고내용</InputTitle>
              <Info className="text-sm">
                **텍스트와 이미지 둘 다 작성시, 이미지는 맨 하단에 추가됩니다.
              </Info>
            </TitleContainer>
            <Contents
              placeholder="공고내용을 입력해주세요."
              className="text"
              value={formData.jobPostingContent}
              onChange={event =>
                setFormData({
                  ...formData,
                  jobPostingContent: event.target.value,
                })
              }
            />
            {/* <FileContainer>
              <FileName>{formData.image?.name || ""}</FileName>
              <FileInput type="file" id="image" onChange={uploadFile} accept=".jpg, .jpeg, .png" />
              <label htmlFor="image">이미지 업로드</label>
              <Span>* 이미지 업로드 시 "jpg", "jpeg", "png" 만 가능</Span>
              <Span>(최대 허용 크기 10MB)</Span>
            </FileContainer> */}
          </InputContainer>
          <SubmitButton
            type="submit"
            className="sub-title"
            value={editMode ? "채용공고 수정" : "채용공고 등록"}
            disabled={!inputCheck()}
          />
        </form>
      </Wrapper>
    </>
  );
};

const ErrorMessage = styled.div`
  padding: 8px;
  color: var(--color-red);
`;

const EditModeText = styled.div`
  color: #707070;
  padding: 16px;
`;

const Title = styled.h2`
  margin-top: 120px;
  margin-bottom: 24px;
`;

// const Span = styled.span`
//   font-size: 12px;
//   margin-top: 10px;
//   display: flex;
//   flex-direction: row;
// `;

const Wrapper = styled.div`
  max-width: 1200px;
  padding: 0 24px;
  padding-bottom: 120px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const InputContainerShortMargin = styled(InputContainer)`
  margin-bottom: 16px;
`;

const InputTitle = styled.p`
  margin-bottom: 8px;
`;

const InputContents = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const BeteenString = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`;

const InputShortText = styled(InputDefault)`
  width: 150px;
  flex: 0;
  text-align: end;
`;

const AdditionExplanation = styled.p`
  margin: auto 8px;
`;

const StackInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StackInputGroup = styled.div`
  display: block;

  label {
    margin-right: 16px;
    margin-bottom: 16px;
  }
`;

const StepContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StepNumber = styled.p``;

const StepDelete = styled.div`
  cursor: pointer;
`;
const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--border-gray-100);
  border-radius: var(--button-radius);

  &:nth-child(1) {
    color: #969696;
    border: 1px solid var(--border-gray-100);
  }
`;
const StepInputContianer = styled.div`
  display: flex;
  gap: 8px;
`;
const StepInput = styled(InputDefault)`
  flex: 0;
`;

const Button = styled.button`
  margin: 0;
  padding: 16px;
  line-height: 1rem;
  color: #ffffff;
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--button-radius);

  &:active {
    transform: scale(99%);
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Info = styled.div`
  color: #707070;
  margin-bottom: 8px;
`;

const Contents = styled.textarea`
  padding: 16px;
  font-family: "Pretendard";
  border: 1px solid var(--border-gray-100);
  border-radius: var(--button-radius);
  height: 20rem;
  resize: none;
`;

// const FileContainer = styled.div`
//   margin-top: 8px;
//   display: flex;
//   gap: 16px;
// `;

// const FileName = styled.div`
//   flex: 1;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   padding: 16px;
//   line-height: 1rem;
//   color: #707070;
//   border: 1px solid var(--border-gray-100);
//   border-radius: var(--button-radius);
// `;

// const FileInput = styled.input`
//   display: none;

//   & + label {
//     display: inline-block;
//     color: #ffffff;
//     padding: 16px;
//     background-color: var(--primary-color);
//     border: 1px solid var(--primary-color);
//     border-radius: var(--button-radius);
//     word-break: keep-all;
//     transition: all 0.1s;
//     cursor: pointer;
//     user-select: none;

//     &:active {
//       transform: scale(99%);
//     }
//   }
// `;

const SubmitButton = styled.input`
  margin-top: 100px;
  padding: 16px;
  width: 100%;
  color: #ffffff;
  border: 0;
  border-radius: var(--button-radius);
  background-color: var(--primary-color);
  cursor: pointer;

  &:disabled {
    color: #ffffff;
    background-color: var(--bg-light-gray);
  }
`;

export default CreateJobPost;

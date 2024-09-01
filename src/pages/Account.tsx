import styled from "styled-components";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState, FormEvent, ChangeEvent } from "react";
import { postChangePassword } from "../axios/http/user";
import { postWithdrawCandidate } from "../axios/http/user";
import { useRecoilState } from "recoil";
import { authUserState } from "../recoil/atoms/userAtom";

const Account = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [authUser, setAuthUser] = useRecoilState(authUserState);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!authUser) return;

    // 비밀번호 유효성 검사
    const isValidNewPassword = validatePassword(newPassword);
    if (!isValidNewPassword) {
      setPasswordError("8-16자리 영문 대/소문자, 숫자, 특수문자(@,$,!,%,*,?,&)를 포함해야 합니다.");
      return;
    } else {
      setPasswordError("");
    }

    // 새로운 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (newPassword !== confirmPassword) {
      setConfirmMessage("새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다");
      return;
    } else {
      setConfirmMessage("비밀번호가 일치합니다");
    }

    try {
      // 기존 비밀번호가 서버 API와 일치하는지 확인 및 비밀번호 변경 로직
      const response = await postChangePassword(authUser.user.key, oldPassword, newPassword);

      if (response) {
        alert("비밀번호가 성공적으로 변경되었습니다");
        window.location.href = "/"; // 메인 화면으로 이동
      } else {
        setMessage("기존 비밀번호가 일치하지 않습니다");
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      setMessage("기존 비밀번호가 일치하지 않습니다");
    }
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return regex.test(password);
  };

  const handleDeleteAccount = async () => {
    if (!authUser) return;
    if (window.confirm("모든 정보가 다 사라집니다. 정말 탈퇴하시겠습니까?")) {
      try {
        await postWithdrawCandidate(authUser.user.key); // 탈퇴 API 호출
        setAuthUser(null);
        localStorage.removeItem("token");
        alert("탈퇴되었습니다");
        window.location.href = "/"; // 메인 화면으로 이동
      } catch (error) {
        console.error("탈퇴 중 오류가 발생했습니다:", error);
        alert("탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <Wrapper>
      <Container id="container">
        <Form onSubmit={handleSubmit}>
          <H1>비밀번호 변경</H1>
          <Span>비밀번호를 변경해주세요.</Span>
          <PassWordCheck>
            <Input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="기존 비밀번호"
              value={oldPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
            />
            <Icon onClick={togglePasswordVisibility}>
              {isPasswordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
            </Icon>
          </PassWordCheck>
          {passwordError && <ErrorSpan>{passwordError}</ErrorSpan>}
          <MessageSpan>{message}</MessageSpan>
          <PassWordCheck>
            <Input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="새로운 비밀번호"
              value={newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            />
            <Icon onClick={togglePasswordVisibility}>
              {isPasswordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
            </Icon>
          </PassWordCheck>
          <PassWordCheck>
            <Input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="새로운 비밀번호 한번 더"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            />
            <Icon onClick={togglePasswordVisibility}>
              {isPasswordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
            </Icon>
          </PassWordCheck>
          {passwordError && <ErrorSpan>{passwordError}</ErrorSpan>}
          <MessageSpan>{confirmMessage}</MessageSpan>
          <Button type="submit">비밀번호 변경</Button>
          <Button className="out" type="button" onClick={handleDeleteAccount}>
            회원 탈퇴
          </Button>
        </Form>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 55px;
`;

const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  width: 600px;
  max-width: 100%;
  min-height: 550px;
  padding: 0 50px;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
  height: 100%;
  background-color: #ffffff;
  text-align: center;
`;

const H1 = styled.h1`
  font-weight: bold;
  margin-bottom: 12px;
`;

const Span = styled.span`
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  background-color: #eee;
  border: none;
  border-radius: var(--button-radius);
  padding: 15px;
  margin-top: 10px;
  width: 100%;
`;

const PassWordCheck = styled.div`
  position: relative;
  width: 100%;
`;

const Icon = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-30%);
  cursor: pointer;
`;

const Button = styled.button`
  border-radius: 8px;
  border: 1px solid #000694;
  background-color: #000694;
  margin-top: 10px;
  color: #ffffff;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  width: 100%;
  &.out {
    border: 1px solid #ff0000;
    background-color: #ffffff;
    color: #ff0000;
  }
`;

const MessageSpan = styled.span`
  color: red;
  margin-top: 1px;
  font-size: 14px;
`;

const ErrorSpan = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

export default Account;

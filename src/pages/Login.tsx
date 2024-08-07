import { useState, FormEvent, ChangeEvent } from "react";
import styled from "styled-components";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { postSignin } from "../axios/http/user";
import { useSetRecoilState } from "recoil";
import { authUserState } from "../recoil/atoms/userAtom";
import { AxiosError } from "axios";

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const setAuthUser = useSetRecoilState(authUserState);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("정보를 입력하지 않았습니다");
      return;
    }

    // 비밀번호 유효성 검사
    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      setPasswordError("8-16자리 영문 대/소문자, 숫자, 특수문자(@,$,!,%,*,?,&)를 포함해야 합니다.");
      return;
    }

    try {
      // 서버 API 호출
      const userData = { email, password };
      const response = await postSignin(userData);
      setAuthUser(response);

      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.email !== undefined) alert(error.response?.data.email);
        else alert("이메일 또는 비밀번호가 일치하지 않습니다.");
      }
      console.error("서버 요청 실패:", error);
    }
  };

  // 비밀번호 유효성 검사 로직 추가
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return regex.test(password);
  };

  // 로그인 JSX
  return (
    <Wrapper>
      <Container id="container">
        <FormContainer className="form-container">
          <Form onSubmit={handleSubmit}>
            <H1>로그인</H1>
            <Span>이메일과 비밀번호를 입력해주세요.</Span>
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <PassWordCheck>
              <Input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="비밀번호"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <Icon onClick={togglePasswordVisibility}>
                {isPasswordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
              </Icon>
            </PassWordCheck>
            {passwordError && <ErrorSpan>{passwordError}</ErrorSpan>}
            <Button type="submit">로그인</Button>
            <FindLink to="/find-email">
              <FindEmailButton>이메일 찾기</FindEmailButton>
            </FindLink>
          </Form>
        </FormContainer>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
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
  width: 500px;
  max-width: 100%;
  min-height: 480px;
`;

const FormContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 95%;
  height: 100%;
  margin: 0 auto;
  transition: all 0.6s ease-in-out;
`;

const Form = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
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
  padding: 15px 15px;
  margin-top: 10px;
  width: 100%;
  border-radius: var(--button-radius);
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
`;

const FindEmailButton = styled(Button)`
  background-color: #fff;
  color: #000694;
  margin-top: 10px;
  border: 1px solid #000694;
  border-radius: 8px;
  width: 100%;
`;

const PassWordCheck = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Icon = styled.div`
  cursor: pointer;
  margin-left: -30px;
  display: flex;
  align-items: center;
`;

const FindLink = styled(Link)`
  width: 100%;
`;

const ErrorSpan = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

export default Login;

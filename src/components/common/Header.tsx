import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";
import { IoPersonCircleOutline, IoSettings } from "react-icons/io5";
import { FaKey } from "react-icons/fa6";
import { useRecoilState } from "recoil";
import { authUserState } from "../../recoil/store";
import { IoIosLock } from "react-icons/io";
// import { useEffect } from "react";

const Header = () => {
  const [authUser, setAuthUser] = useRecoilState(authUserState);

  // const token = localStorage.getItem("token");
  // if (token) {
  //   // 토큰의 만료시간보다 지났으면 토큰 삭제
  //   const now = new Date();
  //   if (+JSON.parse(token).expires < +now.getTime()) {
  //     localStorage.removeItem("token");
  //   }
  // }
  // useEffect(() => {
  //   if (!token) setAuthUser(null);
  // }, [setAuthUser, token]);

  const navigate = useNavigate();

  const logOut = async () => {
    const ok = confirm("로그아웃 하시겠어요?");
    if (ok) {
      try {
        // await axios.post("/common/signout");
        setAuthUser(null);
        localStorage.removeItem("token");
        navigate("/");
      } catch (error) {
        alert("로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <Wrapper>
      <HdInner className="inner-1200">
        <Logo>
          <Link to="/">
            <Img src="/logo.svg" alt="logo" />
          </Link>
        </Logo>
        <Buttons>
          {authUser ? (
            <>
              <Logout className="log-out" onClick={logOut}>
                <HiArrowLeftOnRectangle />
                <Text>로그 아웃</Text>
              </Logout>
              {/* <Button to={isCompany ? "/company-mypage" : "/user-mypage"}> */}
              <Button
                to={authUser.user.role === "ROLE_CANDIDATE" ? "/user-mypage" : "/company-mypage"}
              >
                <IoPersonCircleOutline />
                <Text>마이 페이지</Text>
              </Button>
              <Button className="account" to={"/account"}>
                <IoSettings />
                <Text>계정 정보</Text>
              </Button>
            </>
          ) : (
            <>
              <Button className="login" to={"/login"}>
                <FaKey />
                <Text>로그인</Text>
              </Button>
              <Button className="login" to={"/sign-up"}>
                <IoIosLock />
                <Text>회원가입</Text>
              </Button>
            </>
          )}
        </Buttons>
      </HdInner>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  padding: 0.5rem 1.5rem;
  border-bottom: 1px solid var(--border-gray-100);
  backdrop-filter: blur(10px);
`;

const HdInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1``;

const Img = styled.img`
  width: 90px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Logout = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 1rem 0;
  font-size: 1.5rem;
  color: var(--color-red);
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 1rem 1.2rem;
  font-size: 1.5rem;
  font-weight: 500;

  svg {
    color: var(--primary-color);
  }
  &.account,
  &.login {
    border-radius: var(--button-radius);
    background-color: var(--primary-color);
    color: #fff;
    svg {
      color: #fff;
    }
  }
`;

const Text = styled.div`
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 700;
`;

export default Header;

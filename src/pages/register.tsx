import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import Footer from "../components/Footer/Footer";
import styles from "../styles/Register.module.css";
import { useAuth } from "../contexts/AuthContext";
import {
  initKakao,
  loginWithKakao as getKakaoAccessToken,
  authorizeWithKakaoRedirect,
} from "../utils/kakao";

const RegisterPage = () => {
  const router = useRouter();
  const { loginWithKakao, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  useEffect(() => {
    initKakao();
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleKakaoLogin = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      try {
        const accessToken = await getKakaoAccessToken();
        const success = await loginWithKakao(accessToken);
        if (success) {
          router.push("/");
        } else {
          setError("카카오 로그인에 실패했습니다.");
        }
      } catch (popupErr) {
        // If popup-based login isn't available, fall back to redirect-based flow
        await authorizeWithKakaoRedirect();
      }
    } catch (e: any) {
      console.error("Kakao signup/login failed:", e);
      setError(e?.message || "카카오 로그인 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailRegister = () => {
    // 이메일 회원가입으로 이동
    router.push("/register/basic-info");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>회원가입 - Cido</title>
        <meta name="description" content="Cido 회원가입" />
      </Head>

      <NavigationBar />

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          {/* 로고 */}
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              {/* 로고 이미지 또는 텍스트 */}
              <img src="/logo.svg" alt="Cido" className={styles.logoImage} />
            </div>
          </div>

          {/* 타이틀 */}
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>
              cido 회원가입으로
              <br />
              cido의 디자인 콘텐츠를 편하게 이용하세요!
            </h1>
          </div>

          {/* 카카오 간편 가입 버튼 */}
          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}
          <button
            className={styles.kakaoButton}
            onClick={handleKakaoLogin}
            disabled={isSubmitting}
          >
            <span className={styles.kakaoButtonText}>
              {isSubmitting ? "처리 중..." : "카카오로 3초만에 가입하기"}
            </span>
          </button>

          {/* 구분선 */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>또는</span>
          </div>

          {/* 이메일로 가입하기 버튼 */}
          <button className={styles.emailButton} onClick={handleEmailRegister}>
            <span className={styles.emailButtonText}>이메일로 가입하기</span>
          </button>

          {/* 로그인 링크 */}
          <div className={styles.loginLink}>
            <span className={styles.loginText}>cido을 이미 하셨나요?</span>
            <button className={styles.loginButton} onClick={handleLogin}>
              로그인하기
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;

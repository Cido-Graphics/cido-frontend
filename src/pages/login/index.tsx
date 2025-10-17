import { Geist, Geist_Mono } from "next/font/google";
import styles from "./Login.module.css";
import React, { useState, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { useRouter } from "next/router";
import CidoLogo from "./asset/cido.svg";
import EllipseSvg from "./asset/ellipse.svg";
import { useAuth } from "../../contexts/AuthContext";
import { initKakao, loginWithKakao as getKakaoToken } from "../../utils/kakao";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Login() {
  const router = useRouter();
  const { login, loginWithKakao, user, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Initialize Kakao SDK
    initKakao();

    // Redirect if already logged in
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        router.push("/");
      } else {
        setError("로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const accessToken = await getKakaoToken();
      const success = await loginWithKakao(accessToken);

      if (success) {
        router.push("/");
      } else {
        setError("카카오 로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("카카오 로그인 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <NavigationBar />
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <img src={CidoLogo.src} alt="Cido Logo" className={styles.logo} />
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="username"
              name="username"
              className={styles.input}
              placeholder="사용자명을 입력해 주세요"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              placeholder="비밀번호를 입력해 주세요"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인하기"}
          </button>
        </form>

        <div className={styles.linkGroup}>
          <a href="/find-email">이메일(아이디) 찾기</a>
          <a href="/find-password">비밀번호 찾기</a>
        </div>

        <div className={styles.snsLogin}>
          SNS 계정으로 로그인하기
          <div className={styles.ellipseContainer}>
            <button
              onClick={handleKakaoLogin}
              disabled={isSubmitting}
              className={styles.kakaoButton}
            >
              <img
                src={EllipseSvg.src}
                alt="Kakao Login"
                className={styles.ellipse}
              />
            </button>
          </div>
        </div>

        <div className={styles.signupSection}>
          아직 cido회원이 아니신가요? <a href="/signup">회원가입하기</a>
        </div>
      </div>
    </div>
  );
}

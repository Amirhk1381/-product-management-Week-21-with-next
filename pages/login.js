// import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { loginUser } from "../services/auth";
import { setCookie, removeCookie } from "../services/cookie.js";

// import { loginUser } from "../services/auth.js";

function login() {
  const [login, setLogin] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  //   const navigate = useNavigate();

  const loginHandler = async (event) => {
    event.preventDefault();
    if (!login.username.trim() || !login.password.trim()) {
      setErrorMessage("نام کاربری و رمز عبور الزامی است.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await loginUser(login);
      console.log(response.data);
      const { token } = response.data;
      setCookie("token", token, 3600);

      localStorage.setItem("username", login.username);
      router.push("/products");
    } catch (error) {
      // console.error(error);
      if (error.response && error.response.status === 400) {
        setErrorMessage("نام کاربری یا رمز عبور اشتباه است.");
        removeCookie("token");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.title}>بوت کمپ بوتواستارت</h1>
      <div className={styles.loginForm}>
        <img src="/Union.png" alt="Union Logo" />
        <h3>فرم ورود</h3>
        <form className={styles.inputform} onSubmit={loginHandler}>
          <input
            type="text"
            placeholder="نام کاربری"
            className={styles.username}
            value={login.username}
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            className={styles.password}
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />

          <button type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? "در حال ورود..." : "ورود"}</span>
          </button>
          <Link href="/register" className={styles.link}>
            <span>ایجاد حساب کاربری</span>
          </Link>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default login;

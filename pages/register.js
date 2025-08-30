import styles from "../styles/Login.module.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {registerUser} from "../services/auth"

function register() {
  const router = useRouter();
  const [register, setRegister] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  const handleForm = async (event) => {
    event.preventDefault();
    if (register.password !== register.repeatPassword) {
      setError("رمز عبور و تکرار رمز عبور باید یکسان باشد");

      return;
    } else if (
      !register.username.trim() ||
      !register.password.trim() ||
      !register.repeatPassword.trim()
    ) {
      setError("لطفا تمام فیلدها را پر کنید");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await registerUser({
        username: register.username,
        password: register.password,
      });
      console.log(response.data);

      router.push("/login");
    } catch (error) {
      console.error("Error during registration:", error.response.status);
      if (error.response.status == 400) {
        setError("کاربر قبلا ثبت نام شده است لطفا وارد شوید");

        // navigate("/login");
        return;
      } else {
        setError("خطا در ثبت نام. لطفاً دوباره تلاش کنید.");
        return;
      }
    } finally {
      setLoading(false);
    }
    setError("");
    setRegister({
      username: "",
      password: "",
      repeatPassword: "",
    });
  };
  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.title}>بوت کمپ بوتواستارت</h1>
      <div className={styles.loginForm}>
        <img src="/Union.png" alt="Union Logo" />
        <h3>فرم ثبت نام</h3>
        <form className={styles.inputform} onSubmit={handleForm}>
          <input
            type="text"
            placeholder="نام کاربری"
            value={register.username}
            onChange={(e) =>
              setRegister({ ...register, username: e.target.value })
            }
            className={styles.username}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            value={register.password}
            onChange={(e) =>
              setRegister({ ...register, password: e.target.value })
            }
            className={styles.password}
          />
          <input
            type="password"
            placeholder="تکرار رمز عبور"
            value={register.repeatPassword}
            onChange={(e) =>
              setRegister({ ...register, repeatPassword: e.target.value })
            }
            className={styles.password}
          />

          <button type="submit" disabled={loading}>
            <span>{loading ? "در حال ثبت نام..." : "ثبت نام"}</span>
          </button>
          <Link href="login" className={styles.link}>
            <span>حساب کاربری دارید؟</span>
          </Link>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default register;

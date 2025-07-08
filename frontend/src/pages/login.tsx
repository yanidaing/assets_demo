// pages/login.tsx

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบ session ทุกครั้งที่เข้าหน้านี้ (เช่นหลัง Google OAuth redirect)
    fetch('http://localhost:4000/api/auth/me', {
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.ok) {
          const user = await res.json();
          if (user.role === 'admin') {
            router.replace('/admin/assets');
          } else {
            router.replace('/user/assets');
          }
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is where you would typically make an API call to your backend for authentication.
    // For now, we'll just log the values.
    console.log('Login attempt:', { email, password });
    alert('Login attempt with: Email - ' + email + ', Password - ' + password);
    // In a real application, you'd handle success/failure here (e.g., redirect, show error message).
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/api/auth/google';
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login - Your App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Welcome back!</p>

        <button className={styles.googleButton} onClick={handleGoogleLogin}>
          <img src="/google-logo.png" alt="Google logo" className={styles.googleLogo} />
          Sign-in with Google
        </button>

        <div className={styles.orDivider}>
          <span className={styles.orText}>or</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@example.com"
                required
                className={styles.input}
              />
              {/* This checkmark icon is purely for UI, not functional validation here */}
              {email && <span className={styles.checkmark}>&#10003;</span>}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className={styles.input}
              />
              {/* This checkmark icon is purely for UI, not functional validation here */}
              {password && <span className={styles.checkmark}>&#10003;</span>}
            </div>
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        <p className={styles.signupText}>
          Don't have an account? <a href="/signup" className={styles.signupLink}>Sign up</a>
        </p>
      </main>

      {/* Placeholder for background shapes - you'd typically use CSS for this */}
      <div className={styles.bgShapeLeft}></div>
      <div className={styles.bgShapeRight}></div>
    </div>
  );
}
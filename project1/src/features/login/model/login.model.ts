export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
}

export function validateLoginForm(credentials: LoginCredentials): string | null {
  const emailError = validateEmail(credentials.email);
  if (emailError) return emailError;

  const passwordError = validatePassword(credentials.password);
  if (passwordError) return passwordError;

  return null;
}
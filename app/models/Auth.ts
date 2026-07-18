interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

interface SignupErrorResponse {
  success: false;
  error: string;
}

interface SignupSuccessResponse {
  success: true;
  message: string;
  token: string;
}

type SignupResponse = SignupErrorResponse | SignupSuccessResponse;

interface VerifyOTPParams {
  token: string;
  otp: string;
}

interface OTPErrorResponse {
  success: false;
  error: string;
}

interface UserData {
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  image: string;
  role: string;
  city: string | null;
  is_active: boolean;
  email_verified: boolean;
  dob: string | null;
  provider: string | null;
  language: string;
  date_joined: string;
}

interface OTPSuccessResponse {
  success: true;
  message: string;
  token: string;
  data: UserData;
}

type VerifyOTPResponse = OTPSuccessResponse | OTPErrorResponse;

interface ResendOTPParams {
  token: string;
}

interface ResendOTPSuccessResponse {
  success: true;
  message: string;
  token: string;
}

// types/authTypes.ts

interface LoginParams {
  email: string;
  password: string;
}

interface UserData {
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  image: string;
  role: string;
  city: string | null;
  is_active: boolean;
  email_verified: boolean;
  dob: string | null;
  provider: string | null;
  language: string;
  date_joined: string;
}

interface LoginSuccessResponse {
  success: true;
  message: string;
  token: string;
  data: UserData;
}

interface LoginErrorResponse {
  success: false;
  error: string;
}

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

// Params for forgot password API
interface ForgotPasswordParams {
  email: string;
}

// Successful response
interface ForgotPasswordSuccessResponse {
  success: true;
  message: string;
  token: string;
}

// Error response
interface ForgotPasswordErrorResponse {
  success: false;
  error: string;
}

// Combined type for response
type ForgotPasswordResponse =
  | ForgotPasswordSuccessResponse
  | ForgotPasswordErrorResponse;

interface ForgotResetPasswordParams {
  token: string;
  otp: string;
}

interface ForgotResetPasswordErrorResponse {
  success: false;
  error: string;
}

interface ResetPasswordSuccessResponse {
  success: true;
  message: string;
}

interface ResetPasswordErrorResponse {
  success: false;
  error: string; // e.g., "TOKEN: Invalid or expired token."
}
interface ResetPasswordParams {
  token: string;
  new_password: string;
  confirm_password: string;
}

type ResetPasswordResponse =
  | ResetPasswordSuccessResponse
  | ResetPasswordErrorResponse;

interface GetProfileSuccess {
  success: true;
  message: string;
  data: UserProfile;
}

interface UserProfile {
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  image: string;
  role: string;
  city: string | null;
  is_active: boolean;
  email_verified: boolean;
  dob: string | null;
  provider: string | null;
  language: 'en' | 'de';
  date_joined: string;
}

interface GetProfileError {
  detail: string;
}
type GetProfileResponse = GetProfileSuccess | GetProfileError;

interface UserProfile {
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  image: string;
  role: string;
  city: string | null;
  is_active: boolean;
  email_verified: boolean;
  dob: string | null;
  provider: string | null;
  language: 'en' | 'de';
  date_joined: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

interface ChangePasswordParams {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

interface Language {
  uuid: string;
  code: 'en' | 'de';
  name: string;
}

interface LanguageResponse {
  success: boolean;
  message: string;
  data: Language[];
}

interface DeleteProfileResponse {
  success: boolean;
  message: string;
}

import { Link } from "react-router";

import usePasswordRecovery, {
  RECOVERY_STEP,
} from "../../hooks/usePasswordRecovery";

import EmailStep from "../../components/password-recovery/EmailStep";
import OtpStep from "../../components/password-recovery/OtpStep";
import NewPasswordStep from "../../components/password-recovery/NewPasswordStep";
import ResetSuccess from "../../components/password-recovery/ResetSuccess";

import "../../styles/registration.css";

export default function ForgotPasswordPage() {
  const { step, emailStepProps, otpStepProps, passwordStepProps } =
    usePasswordRecovery();

  return (
    <div className="bd-reg-page">
      <div className="bd-reg-topline">BẢO MẬT TÀI KHOẢN</div>

      {step !== RECOVERY_STEP.SUCCESS && (
        <p className="bd-reg-hint">Bước {step} / 3</p>
      )}

      {step === RECOVERY_STEP.EMAIL && <EmailStep {...emailStepProps} />}

      {step === RECOVERY_STEP.OTP && <OtpStep {...otpStepProps} />}

      {step === RECOVERY_STEP.PASSWORD && (
        <NewPasswordStep {...passwordStepProps} />
      )}

      {step === RECOVERY_STEP.SUCCESS && <ResetSuccess />}

      {step !== RECOVERY_STEP.SUCCESS && (
        <p className="bd-reg-footer">
          Nhớ mật khẩu rồi? <Link to="/login">Quay về đăng nhập</Link>
        </p>
      )}
    </div>
  );
}

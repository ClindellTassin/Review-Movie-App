import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendEmailVerificationToken, verifyUserEmail } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import FormContainer from "../form/FormContainer";
import Submit from "../form/Submit";
import Title from "../form/Title";

const OTP_LENGTH = 6;
let currentOTPIndex;

const isValidOTP = (otp) => {
    let valid = false;

    for (let val of otp) {
        valid = !isNaN(parseInt(val));
        if (!valid) break;
    }

    return valid;
};

export default function EmailVerification() {
    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
    const [activeOtpIndex, setActiveOtpIndex] = useState(0);

    const inputRef = useRef();

    const { isAuth, authInfo } = useAuth()
    const { isLoggedIn, profile } = authInfo
    const isVerified = profile?.isVerified

    const { updateNotification } = useNotification()

    const { state } = useLocation();
    const user = state?.user;

    const navigate = useNavigate();

    const focusNextInputField = (index) => {
        setActiveOtpIndex(index + 1);
    };

    const focusPrevInputField = (index) => {
        let nextIndex;
        const diff = index - 1;
        nextIndex = diff !== 0 ? diff : 0;
        setActiveOtpIndex(nextIndex);
    };

    const handleOtpChange = ({ target }) => {
        const { value } = target;
        const newOtp = [...otp];
        newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);

        if (!value) focusPrevInputField(currentOTPIndex);
        else focusNextInputField(currentOTPIndex);
        setOtp([...newOtp]);
    };

    const handleKeyDown = ({ key }, index) => {
        currentOTPIndex = index;
        if (key === "Backspace") {
            focusPrevInputField(currentOTPIndex);
        }
    };

    const handleOTPResend = async () => {
        const { error, message } = await resendEmailVerificationToken(user.id)

        if (error) return updateNotification('error', error)

        updateNotification('success', message)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidOTP(otp)) {
            return updateNotification('error', "invalid code");
        }

        const { error, message, user: userResponse } = await verifyUserEmail({
            OTP: otp.join(""),
            userId: user.id,
        });
        if (error) return updateNotification('error', error)

        updateNotification('success', message)
        localStorage.setItem('auth-token', userResponse.token)
        isAuth();
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOtpIndex]);

    useEffect(() => {
        if (!user) navigate("/not-found");
        if (isLoggedIn && isVerified) navigate("/");
    }, [user, isLoggedIn, isVerified]);


    return (
        <FormContainer>
            <Container>
                <form onSubmit={handleSubmit} className={commonModalClasses}>
                    <div>
                        <Title>Please enter the OTP to verify your account</Title>
                        <p className="text-center dark:text-dark-subtle text-light-subtle">
                            OTP has been sent to your email
                        </p>
                    </div>

                    <div className="flex justify-center items-center space-x-4">
                        {otp.map((_, index) => {
                            return (
                                <input
                                    ref={activeOtpIndex === index ? inputRef : null}
                                    key={index}
                                    type="number"
                                    value={otp[index] || ""}
                                    onChange={handleOtpChange}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-12 border-2 dark:border-dark-subtle  border-light-subtle darK:focus:border-white focus:border-primary rounded bg-transparent outline-none text-center dark:text-white text-primary font-semibold text-xl spin-button-none"
                                />
                            );
                        })}
                    </div>
                    <div>
                        <Submit value="Verify Account" />
                        <button type="button" onClick={handleOTPResend} className="dark:text-white text-blue-500 font-semibold hover:underline mt-2">I don't have code</button>
                    </div>
                </form>
            </Container>
        </FormContainer>
    );
}

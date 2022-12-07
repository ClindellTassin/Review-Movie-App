import { useState, useEffect, useRef } from "react";
import Container from "../Container";
import Submit from "../form/Submit";
import Title from "../form/Title";

const OTP_LENGTH = 6;
let currentOTPIndex;

export default function EmailVerification() {
    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''))
    const [activeOtpIndex, setActiveOtpIndex] = useState(0)

    const inputRef = useRef()

    const focusNextInputField = (index) => {
        setActiveOtpIndex(index + 1)
    }

    const focusPrevInputField = (index) => {
        let nextIndex;
        const diff = index - 1
        nextIndex = diff !== 0 ? diff : 0
        setActiveOtpIndex(nextIndex)
    }

    const handleOtpChange = ({ target }) => {
        const { value } = target;
        const newOtp = [...otp]
        newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length)

        if (!value) focusPrevInputField(currentOTPIndex)
        else focusNextInputField(currentOTPIndex)

        setOtp([...newOtp])
    }

    const handleKeyDown = ({ key }, index) => {
        currentOTPIndex = index;
        if (key === "Backspace") {
            focusPrevInputField(currentOTPIndex)
        }
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [activeOtpIndex])

    return (
        <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
            <Container>
                <form className="bg-secondary rounded p-6 space-y-6">
                    <div>
                        <Title>Please Enter Your Verification Code to verify account</Title>
                        <p className="text-center text-dark-subtle">Verification Code has been sent to email</p>
                    </div>
                    <div className="flex justify-center items-center space-x-4">
                        {otp.map((_, index) => {
                            return <input key={index} ref={activeOtpIndex === index ? inputRef : null} onChange={handleOtpChange} onKeyDown={(e) => handleKeyDown(e, index)} type='number' value={otp[index] || ""} className="w-12 h-12 border-2 border-dark-subtle focus:border-white rounded bg-transparent outline-none text-center text-white font-semibold text-xl spin-button-none" />
                        })}
                    </div>
                    <Submit value='Send Link' />
                </form>
            </Container>
        </div>
    )
}

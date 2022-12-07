import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function ForgetPassword() {
    return (
        <FormContainer>
            <Container>
                <form className={commonModalClasses + " w-96"}>
                    <Title>Please Enter Your Email</Title>
                    <FormInput label="Email" placeholder="nunniejoe@email.com" name="email" />
                    <Submit value='Send Link' />
                    <div className="flex justify-between">
                        <CustomLink to='/auth/signin'>Sign In</CustomLink>
                        <CustomLink to='/auth/signup'>Sign Up</CustomLink>
                    </div>
                </form>
            </Container>
        </FormContainer>
    )
}

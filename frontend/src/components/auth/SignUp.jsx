import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function SignUp() {
    return (
        <FormContainer>
            <Container>
                <form className={commonModalClasses + " w-72"}>
                    <Title>Sign Up</Title>
                    <FormInput label="Name" placeholder="Nunnie Joe" name="name" />
                    <FormInput label="Email" placeholder="nunniejoe@email.com" name="email" />
                    <FormInput label="Password" placeholder="********" name="password" />
                    <Submit value='Sign Up' />
                    <div className="flex justify-between">
                        <CustomLink to='/auth/forget-password'>Forget Password</CustomLink>
                        <CustomLink to='/auth/signin'>Sign In</CustomLink>
                    </div>
                </form>
            </Container>
        </FormContainer>
    )
}

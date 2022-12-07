import Container from "../Container";
import CustomLink from "../CustomLink";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function SignUp() {
    return (
        <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
            <Container>
                <form className="bg-secondary rounded p-6 w-72 space-y-6">
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
        </div>
    )
}

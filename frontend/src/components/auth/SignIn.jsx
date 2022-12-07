import Container from "../Container";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function SignIn() {
    return (
        <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
            <Container>
                <form className="bg-secondary rounded p-6 w-72 space-y-6">
                    <Title>Sign In</Title>
                    <FormInput label="Email" placeholder="nunniejoe@email.com" name="email" />
                    <FormInput label="Password" placeholder="********" name="password" />
                    <Submit value='Sign In' />

                    <div className="flex justify-between">
                        <a className="text-dark-subtle hover:text-white transition" href="#">Forget Password</a>
                        <a className="text-dark-subtle hover:text-white transition" href="#">Sign Up</a>
                    </div>
                </form>
            </Container>
        </div>
    )
}

import * as argon from 'argon2';

const hashCheck = async (
    { userPassword, signInPassword }: { userPassword: string, signInPassword: string }
) => {
    const result = await argon.verify(userPassword, signInPassword);
    return result;
}

export default hashCheck;
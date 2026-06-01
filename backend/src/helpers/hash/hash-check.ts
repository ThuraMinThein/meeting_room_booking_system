import * as argon from 'argon2';

const hashCheck = async (
    { hashed, password }: { hashed: string, password: string }
) => {
    const result = await argon.verify(hashed, password);
    return result;
}

export default hashCheck;
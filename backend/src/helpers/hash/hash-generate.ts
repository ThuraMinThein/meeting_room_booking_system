import * as argon from 'argon2';

const hashGenerate = async (password: string) => {
    const hash = await argon.hash(password);
    return hash;
}

export default hashGenerate;
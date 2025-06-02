import { compare, hash } from "bcryptjs";

export const encryptPassword = async (password) => {
  const hashing = await hash(password, 10);
  return hashing;
};

export const HashingMatch = async (myPassword, receivePassword) => {
  const isMatch =
    receivePassword &&
    myPassword &&
    (await compare(myPassword, receivePassword));

  return isMatch;
};

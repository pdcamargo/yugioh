import bcrypt from "bcrypt";

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function hashPassword(password: string) {
  const saltRounds = 10; // Define the cost factor, higher is more secure but slower

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  return hashedPassword;
}

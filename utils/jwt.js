import jwt from 'jsonwebtoken';

export const generateAccessToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '30d' });

const isProduction = () => process.env.NODE_ENV === 'production';

export const cookieOptions = (maxAgeDays) => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? 'none' : 'lax',
  maxAge: maxAgeDays * 24 * 60 * 60 * 1000,
});

export const sendTokens = (res, user) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie('accessToken', accessToken, cookieOptions(7));
  res.cookie('refreshToken', refreshToken, cookieOptions(30));

  return { accessToken, refreshToken };
};

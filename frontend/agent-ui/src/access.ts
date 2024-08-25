/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}
export function setSessionToken(accessToken: string, idToken: string, sessionId?: string) {
  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
    const decodedToken: any = JSON.parse(atob(accessToken.split('.')[1]));
    const expirationTime: number = decodedToken.exp * 1000; // 转换为毫秒
    localStorage.setItem('access_token_expired_at', expirationTime.toString());
  }
  if (idToken) {
    localStorage.setItem('id_token', idToken);
    const decodedToken: any = JSON.parse(atob(idToken.split('.')[1]));
    const expirationTime: number = decodedToken.exp * 1000; // 转换为毫秒
    localStorage.setItem('id_token_expired_at', expirationTime.toString());
  }
  if (sessionId) {
    localStorage.setItem('session_id', sessionId);
  }
}
export function getAccessToken() {
  return localStorage.getItem('access_token');
}
export function getIdToken() {
  return localStorage.getItem('id_token');
}
export function getSessionId() {
  return localStorage.getItem('session_id');
}
export function getAccessTokenExpiredAt() {
  let expiredAt = localStorage.getItem('access_token_expired_at');
  if (!expiredAt) {
    const accessToken = getAccessToken();
    if (accessToken) {
      const decodedToken: any = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime: number = decodedToken.exp * 1000; // 转换为毫秒
      localStorage.setItem('access_token_expired_at', expirationTime.toString());
      expiredAt = expirationTime.toString();
    }
  }
  if (expiredAt) {
    return new Date(parseInt(expiredAt));
  }
  return null;
}
export function getIdTokenExpiredAt() {
  let expiredAt = localStorage.getItem('id_token_expired_at');
  if (!expiredAt) {
    const idToken = getIdToken();
    if (idToken) {
      const decodedToken: any = JSON.parse(atob(idToken.split('.')[1]));
      const expirationTime: number = decodedToken.exp * 1000; // 转换为毫秒
      localStorage.setItem('id_token_expired_at', expirationTime.toString());
      expiredAt = expirationTime.toString();
    }
  }
  if (expiredAt) {
    return new Date(parseInt(expiredAt));
  }
  return null;
}
export function clearSessionToken() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('access_token_expired_at');
  localStorage.removeItem('id_token');
  localStorage.removeItem('id_token_expired_at');
  localStorage.removeItem('session_id');
}
export function isNeedLogin() {
  const accessTokenExpiresIn = getAccessTokenExpiredAt();
  const idTokenExpiresIn = getIdTokenExpiredAt();
  const accessToken = getAccessToken();
  const idToken = getIdToken();
  return !accessToken || !idToken
    || !accessTokenExpiresIn || !idTokenExpiresIn
    || accessTokenExpiresIn < new Date() || idTokenExpiresIn < new Date();
}
export function isNeedRefreshToken() {
  const accessTokenExpiresIn = getAccessTokenExpiredAt();
  const idTokenExpiresIn = getIdTokenExpiredAt();
  const accessToken = getAccessToken();
  const idToken = getIdToken();
  const fifteenMinutesFromNow = new Date(Date.now() + 15 * 60 * 1000);
  return (accessToken && accessTokenExpiresIn && (accessTokenExpiresIn > new Date() && accessTokenExpiresIn < fifteenMinutesFromNow))
    || (idToken && idTokenExpiresIn && (idTokenExpiresIn > new Date() && idTokenExpiresIn < fifteenMinutesFromNow));
}

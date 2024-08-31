import { request } from '@umijs/max';


/** 登录接口 POST /api/agents/signIn
 * @param body 登录参数
 * @param options 请求配置
 * @returns 登录结果
 */
export async function signIn(body: API.Service.SignInParams, options?: Record<string, any>) {
  return request<API.Service.SignInResult>('/api/agents/signIn', {
    method: 'POST',
    headers: {
      isToken: false,
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/agents/signUp
 * @param body 注册参数
 * @param options 请求配置
 * @returns 注册结果
 */
export async function signUp(body: API.Service.SignUpParams, options?: Record<string, any>) {
  return request<API.Service.SignUpResult>('/api/agents/signUp', {
    method: 'POST',
    headers: {
      isToken: false,
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function getUserInfo(options?: Record<string, any>) {
  return request<API.R<API.UserInfo>>('/api/agents/getUserInfo', {
    method: 'GET',
    ...(options || {}),
  });
}


/** 刷新token接口 POST /api/agents/refreshToken */
export async function refreshToken(options?: Record<string, any>) {
  return request<API.R<API.Service.RefreshTokenResult>>('/api/agents/refreshToken', {
    method: 'POST',
    headers: {
      refreshToken: true,
    },
    ...(options || {}),
  });
}

export async function initiateGoogleSignIn(options?: Record<string, any>) {
  return request<API.R<{ url: string }>>('/api/agents/auth/google', {
    method: 'GET',
    headers: {
      isToken: false,
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function handleGoogleCallback(code: string, options?: Record<string, any>) {
  return request<API.Service.SignInResult>('/api/agents/auth/google/callback', {
    method: 'GET',
    headers: {
      isToken: false,
      'Content-Type': 'application/json',
    },
    params: { code },
    ...(options || {}),
  });
}


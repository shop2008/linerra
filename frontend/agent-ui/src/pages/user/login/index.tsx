import { Footer } from '@/components';
import { handleGoogleCallback, initiateGoogleSignIn, signIn, signUp } from '@/services/service/agent';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
  GoogleOutlined,
  GoogleCircleFilled
} from '@ant-design/icons';
import {
  LoginForm,
  PageLoading,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message, Spin, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';
import { clearSessionToken, getAccessToken, setSessionToken } from '@/access';
import Loading from '@/components/Loading';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

//console.log(process.env.API_URL);

const ActionIcons = () => {
  const { styles } = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <Loading fullscreen={true} />}
      {/* <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} /> */}
      {/* <Spin spinning={isGoogleLoading} size="small"> */}
      <GoogleCircleFilled key="GoogleOutlined" className={styles.action}
        onClick={async () => {
          setIsLoading(true);
          try {
            const result = await initiateGoogleSignIn();
            if (result.success && result.data?.url) {
              window.location.href = result.data.url;
            } else {
              message.error('Failed to initiate Google sign-in');
            }
          } catch (error) {
            //message.error('Failed to initiate Google sign-in');
          } finally {
            //setIsLoading(false);
          }
        }} />
      {/* </Spin> */}
    </>
  );
};

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

// const LoginMessage: React.FC<{
//   content: string;
// }> = ({ content }) => {
//   return (
//     <Alert
//       style={{
//         marginBottom: 24,
//       }}
//       message={content}
//       type="error"
//       showIcon
//     />
//   );
// };

const Login: React.FC = () => {
  //const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  //console.log("Login", null);
  const [type, setType] = useState<string>('signIn');
  const { initialState, setInitialState } = useModel('@@initialState');
  //const { fetchDictsAsync, fetchDicts } = useModel('dicts');
  const { styles } = useStyles();
  const intl = useIntl();

  const fetchUserInfo = async () => {
    //console.log(fetchUserInfo);
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  // const fetchDicts = async () => {
  //   const dicts = await initialState?.fetchDicts?.();
  //   if (dicts) {
  //     flushSync(() => {
  //       setInitialState((s) => ({
  //         ...s,
  //         dicts,
  //       }));
  //     });
  //   }
  // };




  // useEffect(() => {


  //   const searchParams = new URLSearchParams(location.search);

  //   // if (getAccessToken()) {
  //   //   setIsLoading(true);
  //   //   Promise.all([fetchUserInfo(), fetchDicts()]).then(() => {
  //   //     setIsLoading(false);
  //   //     history.push('/');
  //   //   });
  //   //   return;
  //   // }

  //   const code = searchParams.get('code');

  //   if (code) {
  //     setIsLoading(true);
  //     handleGoogleCallback(code).then(async (result) => {
  //       if (result.success) {
  //         const defaultLoginSuccessMessage = intl.formatMessage({
  //           id: 'pages.login.success',
  //           defaultMessage: '登录成功！',
  //         });
  //         const { idToken, accessToken, sessionId } = result.data;
  //         setSessionToken(accessToken, idToken, sessionId);
  //         message.success(defaultLoginSuccessMessage);
  //         await Promise.all([fetchUserInfo(), fetchDicts()]);

  //         //const urlParams = new URL(window.location.href).searchParams;
  //         setIsLoading(false);
  //         history.push(searchParams.get('redirect') || '/');


  //       } else {
  //         setIsLoading(false);
  //         message.error('Google sign-in failed');
  //       }
  //     });
  //   }
  // }, [location]);

  const handleSubmit = async (values: API.Service.SignInParams | API.Service.SignUpParams) => {
    //try {
    // 登录

    if (type === 'signIn') {
      const signInResult = await signIn({ ...values }, { skipLogout: true });
      if (signInResult.success) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        setSessionToken(
          signInResult.data?.accessToken,
          signInResult.data?.idToken,
          signInResult.data?.sessionId,
        );
        message.success(defaultLoginSuccessMessage);
        //fetchDictsAsync();
        //fetchDicts();
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        clearSessionToken();
      }
    } else {
      const signUpResult = await signUp({ ...values });
      if (signUpResult.success) {
        const defaultRegisterSuccessMessage = intl.formatMessage({
          id: 'pages.register.success',
          defaultMessage: '注册成功！',
        });
        message.success(defaultRegisterSuccessMessage);
        setType('signIn');
        return;
      }
      // console.log(signUpResult);
      // setUserLoginState(signUpResult);
    }
    // } catch (error) {
    //   const defaultLoginFailureMessage = intl.formatMessage({
    //     id: 'pages.login.failure',
    //     defaultMessage: '登录失败，请重试！',
    //   });
    //   console.log(error);
    //   message.error(defaultLoginFailureMessage);
    // }
  };
  //const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <Lang />

      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            // autoLogin: true,
          }}
          actions={[
            <FormattedMessage
              key="loginWith"
              id="pages.login.loginWith"
              defaultMessage="其他登录方式"
            />,
            <ActionIcons key="icons" />,
          ]}
          submitter={{
            searchConfig: {
              submitText: type === 'signIn' ? intl.formatMessage({
                id: 'loginForm.submitText',
                defaultMessage: '登录',
              }) : intl.formatMessage({
                id: 'signUpForm.submitText',
                defaultMessage: '注册',
              }),
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.Service.SignInParams | API.Service.SignUpParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'signIn',
                label: intl.formatMessage({
                  id: 'pages.login.loginTab',
                  defaultMessage: '登录',
                }),
              },
              {
                key: 'signUp',
                label: intl.formatMessage({
                  id: 'pages.login.registerTab',
                  defaultMessage: '注册',
                }),
              },
            ]}
          />

          {/* {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )} */}
          {type === 'signIn' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.email.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.email.required"
                        defaultMessage="请输入邮箱!"
                      />
                    ),
                  },
                  {
                    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.email.invalid"
                        defaultMessage="邮箱格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {/* {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />} */}
          {type === 'signUp' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined />,
                }}
                name="email"
                placeholder={intl.formatMessage({
                  id: 'pages.login.email.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.email.required"
                        defaultMessage="请输入邮箱！"
                      />
                    ),
                  },
                  {
                    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.email.invalid"
                        defaultMessage="邮箱格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
              {/* <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (!result) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              /> */}
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            {/* <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox> */}
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

import { Footer, Question, SelectLang, AvatarDropdown, AvatarName } from '@/components';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link, useIntl } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
//import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import React from 'react';
import { getUserInfo, handleGoogleCallback } from './services/service/agent';
import { getDicts } from './services/service/dict';
import { getAccessToken, setSessionToken } from './access';
import { message } from 'antd';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

// export const initialStateConfig = {
//   loading: <PageLoading fullscreen={true} />,
// };

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  // dicts?: Record<string, API.Service.DictData[]>;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  // fetchDicts?: () => Promise<Record<string, API.Service.DictData[]> | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo({
        skipErrorHandler: true,
      });
      if (response.data) {
        response.data.name = 'test';
        response.data.avatar = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      }
      return response.data as API.CurrentUser;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const fetchDicts = async () => {
    try {
      const response: API.R<Record<string, API.Service.DictItem[]>> = await getDicts({
        skipErrorHandler: true,
      });
      return response.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  //debugger
  const initialState = {
    fetchUserInfo,
    // fetchDicts,
    loading: true,
    settings: defaultSettings as Partial<LayoutSettings>,
  };

  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    // const [currentUser, dicts] = await Promise.all([
    //   fetchUserInfo(),
    //   fetchDicts()
    // ]);
    const currentUser = await fetchUserInfo();
    //const dicts = await fetchDicts();
    return {
      ...initialState,
      currentUser,
      //dicts,
      loading: false,
    };
  } else {

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    if (code) {
      const result = await handleGoogleCallback(code);
      if (result.success) {
        const { idToken, accessToken, sessionId } = result.data;
        setSessionToken(accessToken, idToken, sessionId);
      }
    }

    const accessToken = getAccessToken();
    if (accessToken) {
      // const [currentUser, dicts] = await Promise.all([
      //   fetchUserInfo(),
      //   fetchDicts()
      // ]);
      const currentUser = await fetchUserInfo();
      history.push(searchParams.get('redirect') || '/');
      return {
        ...initialState,
        currentUser,
        //dicts,
        loading: false,
      };
    }


  }
  return initialState;
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState, loading }) => {

  return {
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      console.log("Onpagechange");
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
      //console.log("Onpagechange", location.pathname);
      // if (!getAccessToken() && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
        <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    //loading: initialState ? false : true,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // console.log("Loading", initialState?.loading);
      // if (initialState?.loading) return <PageLoading />;
      console.log("Childrenrender", initialState?.loading);
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};

/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard',
        redirect: '/dashboard/home',
      },
      {
        path: '/dashboard/home',
        name: 'home',
        component: './Dashboard/Home',
      },
      {
        path: '/dashboard/staff-accounts',
        name: 'staffAccounts',
        component: './Dashboard/StaffAccounts',
      },
      {
        path: '/dashboard/my-services',
        name: 'myServices',
        component: './Dashboard/MyServices',
      },
    ],
  },
  {
    path: '/shipping',
    name: 'shipping',
    icon: 'car',
    routes: [
      {
        path: '/shipping/quote',
        name: 'quote',
        component: './Shipping/Quote',
      },
      {
        path: '/shipping/shipments',
        name: 'shipments',
        routes: [
          {
            path: '/shipping/shipments/list',
            name: 'list',
            component: './Shipping/ShipmentList',
          },
          {
            path: '/shipping/shipments/create',
            name: 'create',
            component: './Shipping/CreateOrder',
          },
          {
            path: '/shipping/shipments/print-label',
            name: 'printLabel',
            component: './Shipping/PrintLabel',
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        component: './Admin',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard/home',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
  {
    path: '/my-account',
    name: 'myAccount',
    icon: 'user',
    routes: [
      {
        path: '/my-account/summary',
        name: 'accountSummary',
        component: './MyAccount/AccountSummary',
      },
      {
        path: '/my-account/transactions',
        name: 'transactionDetails',
        component: './MyAccount/TransactionDetails',
      },
      {
        path: '/my-account/payable',
        name: 'accountPayable',
        component: './MyAccount/AccountPayable',
      },
      {
        path: '/my-account/invoices',
        name: 'invoicesStatement',
        component: './MyAccount/InvoicesStatement',
      },
    ],
  },
  {
    path: '/address-book',
    name: 'addressBook',
    icon: 'book',
    routes: [
      {
        path: '/address-book/list',
        name: 'addressList',
        component: './AddressBook/AddressList',
      },
      {
        path: '/address-book/import',
        name: 'importAddresses',
        component: './AddressBook/ImportAddresses',
      },
    ],
  },
  {
    path: '/user-centre',
    name: 'userCentre',
    icon: 'user',
    routes: [
      {
        path: '/user-centre/my-account',
        name: 'myAccount',
        component: './UserCentre/MyAccount',
      },
      {
        path: '/user-centre/change-email',
        name: 'changeEmail',
        component: './UserCentre/ChangeEmail',
      },
      {
        path: '/user-centre/change-password',
        name: 'changePassword',
        component: './UserCentre/ChangePassword',
      },
      {
        path: '/user-centre/upload-photo',
        name: 'uploadPhoto',
        component: './UserCentre/UploadPhoto',
      },
      {
        path: '/user-centre/sign-out',
        name: 'signOut',
        component: './UserCentre/SignOut',
      },
    ],
  },
];

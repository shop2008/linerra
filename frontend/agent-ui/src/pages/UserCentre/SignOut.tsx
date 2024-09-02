import React, { useEffect } from 'react';
import { useModel, history } from '@umijs/max';
import { message } from 'antd';
import { clearSessionToken } from '@/access';

const SignOut: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');

  useEffect(() => {
    const handleSignOut = async () => {
      // Clear the session token
      clearSessionToken();

      // Reset the initial state
      setInitialState((s) => ({ ...s, currentUser: undefined }));

      message.success('You have been signed out successfully');

      // Redirect to the login page
      history.push('/user/login');
    };

    handleSignOut();
  }, [setInitialState]);

  return null;
};

export default SignOut;

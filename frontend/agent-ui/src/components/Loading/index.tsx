import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

const Loading: React.FC<{ fullscreen?: boolean }> = ({ fullscreen = false }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
    }}>
      <Spin indicator={antIcon} size="large" fullscreen={fullscreen} />
    </div>
  );
};

export default Loading;

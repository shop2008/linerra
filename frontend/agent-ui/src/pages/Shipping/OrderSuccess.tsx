import React from 'react';
import { Result, Button, Typography } from 'antd';
import { Link } from 'umi';

const { Paragraph, Text } = Typography;

interface OrderSuccessProps {
  orderNumber: string;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderNumber }) => {
  return (
    <Result
      status="success"
      title="Order Successfully Created!"
      subTitle={
        <Paragraph>
          Your shipment has been successfully created and processed.
          <br />
          Order Number: <Text strong>{orderNumber}</Text>
        </Paragraph>
      }
      extra={[
        <Button type="primary" key="viewShipments">
          <Link to="/shipments">View Shipments</Link>
        </Button>,
      ]}
    />
  );
};

export default OrderSuccess;

import React from 'react';
import { Alert, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface ServiceData {
  key: number;
  service: string;
  eta: Date;
  description: string;
}

const columns: ColumnsType<ServiceData> = [
  {
    title: 'Service ID',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: 'Service',
    dataIndex: 'service',
    key: 'service',
  },
  {
    title: 'ETA',
    dataIndex: 'eta',
    key: 'eta',
    render: (eta: Date) => eta.toISOString().split('T')[0],
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: () => <a>Order</a>,
  },
];

const data: ServiceData[] = [
  {
    key: 483,
    service: 'Ground',
    eta: new Date(2024, 9, 20),
    description: 'Up to 68 kg/150 lb',
  },
  // Add more data items as needed
];

const MyServices: React.FC = () => {
  return (
    <div>
      <h1>My Services</h1>
      <Alert
        message="Notice:"
        description="Please note that the list below are all of your available services."
        type="info"
        showIcon
        style={{ marginBottom: 6 }}
      />
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default MyServices;

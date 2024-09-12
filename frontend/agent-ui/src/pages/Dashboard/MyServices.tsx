import React, { useState } from 'react';
import { Alert, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useModel, history } from '@umijs/max';

const columns: ColumnsType<VerkType.Carrier> = [
  { dataIndex: 'id', key: 'id', align: 'left', width: '10%' },
  { dataIndex: 'name', key: 'name', align: 'left', width: '25%' },
  { dataIndex: 'eta', key: 'eta', align: 'left', width: '20%' },
  { dataIndex: 'description', key: 'description', align: 'left', width: '35%' },
  { key: 'placeholder', width: '10%' }, // Placeholder for the "Order" button column
];

const expandedRowRender = (record: VerkType.Carrier) => {
  const serviceColumns: ColumnsType<VerkType.Service> = [
    { dataIndex: 'id', key: 'id', align: 'left', width: '10%' },
    { dataIndex: 'name', key: 'name', align: 'left', width: '25%' }, // Adjusted width
    { dataIndex: 'eta', key: 'eta', align: 'left', width: '20%' },
    { dataIndex: 'description', key: 'description', align: 'left', width: '35%' }, // Adjusted width
    {
      key: 'actions',
      render: (_, service) => <a onClick={() => handleOrderClick(service, record)}>Order</a>,
      align: 'left',
      width: '10%',
    },
  ];

  return (
    <Table
      columns={serviceColumns}
      dataSource={record.services}
      pagination={false}
      showHeader={false}
      style={{ margin: 0 }}
    />
  );
};

const handleOrderClick = (service: VerkType.Service, carrier: VerkType.Carrier) => {
  history.push('/shipping/shipments/create', { service, carrier });
};

const MyServices: React.FC = () => {
  const { carriers, modelLoading } = useModel('carrierModel');
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const formattedCarriers = carriers.map((carrier: VerkType.Carrier) => ({
    key: carrier.id,
    name: carrier.name,
    description: 'Description',
    eta: 'ETA',
    services:
      carrier.services?.map((service: VerkType.Service) => ({
        id: service.id,
        name: service.name,
        eta: service.eta || 'N/A',
        description: service.description || 'No description available',
      })) || [],
  }));

  const onTableRowExpand = (expanded: boolean, record: CarrierData) => {
    const keys = expanded
      ? [...expandedRowKeys, record.key]
      : expandedRowKeys.filter((k) => k !== record.key);
    setExpandedRowKeys(keys);
  };

  return (
    <div>
      <h1>My Services</h1>
      <Alert
        message="Notice:"
        description="Please note that the list below shows all available carriers and their services."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
          onExpand: onTableRowExpand,
          expandedRowKeys,
        }}
        onRow={(record) => ({
          onClick: () => onTableRowExpand(!expandedRowKeys.includes(record.key), record),
        })}
        dataSource={formattedCarriers}
        modelLoading={modelLoading}
        showHeader={false}
      />
    </div>
  );
};

export default MyServices;

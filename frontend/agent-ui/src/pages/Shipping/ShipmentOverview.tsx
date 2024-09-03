import React from 'react';
import { Card, Table, Typography } from 'antd';

const { Title } = Typography;

interface ShipmentOverviewProps {
  quoteResponse: VerkType.QuoteResponse | null;
}

const ShipmentOverview: React.FC<ShipmentOverviewProps> = ({ quoteResponse }) => {
  if (!quoteResponse) {
    return <div>No quote data available</div>;
  }

  const columns = [
    {
      title: 'Carrier',
      dataIndex: 'carrier',
      key: 'carrier',
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Estimated Delivery',
      dataIndex: 'estimatedDelivery',
      key: 'estimatedDelivery',
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      key: 'totalCost',
    },
  ];

  const data = quoteResponse.quotes.map((quote, index) => ({
    key: index,
    carrier: quote.carrier,
    service: quote.service,
    estimatedDelivery: quote.estimatedDelivery,
    totalCost: `$${quote.totalCost.toFixed(2)}`,
  }));

  return (
    <Card>
      <Title level={3}>Shipment Overview</Title>
      <Table columns={columns} dataSource={data} />
    </Card>
  );
};

export default ShipmentOverview;

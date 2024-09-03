import React from 'react';
import { Card, Table, Typography, Descriptions, Row, Col } from 'antd';

const { Title } = Typography;

interface ShipmentOverviewProps {
  quoteResponse: Array<VerkType.QuoteResponse | null>;
  formData: any;
}

const ShipmentOverview: React.FC<ShipmentOverviewProps> = ({ quoteResponse, formData }) => {
  console.log('quoteResponse', quoteResponse);
  console.log('formData', formData);

  if (!quoteResponse || quoteResponse.length === 0) {
    return <div>No quote data available</div>;
  }

  const quoteData = quoteResponse
    .filter((quote): quote is VerkType.QuoteResponse => quote !== null)
    .flatMap((quote) =>
      quote.services.map((service, serviceIndex) => ({
        key: `${quote.carrierCode}-${serviceIndex}`,
        carrier: quote.name,
        carrierCode: quote.carrierCode,
        carrierId: quote.carrierId,
        service: service.name,
        estimatedDelivery: service.eta || 'N/A',
        totalCost: service.charge ? `$${parseFloat(service.charge).toFixed(2)}` : 'N/A',
      })),
    );

  const quoteColumns = [
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

  const packageColumns = [
    {
      title: '#',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Weight (lb)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Dimensions (in)',
      dataIndex: 'dimensions',
      key: 'dimensions',
    },
    {
      title: 'Dimensions (in)',
      dataIndex: 'dimensions',
      key: 'dimensions',
    },
    {
      title: 'Volume Weight (lb)',
      dataIndex: 'volumeWeight',
      key: 'volumeWeight',
    },
    {
      title: 'Insurance ($)',
      dataIndex: 'insurance',
      key: 'insurance',
    },
  ];

  const packageData = Array.from({ length: formData.quantity || 1 }, (_, i) => ({
    key: i,
    no: i + 1,
    weight: formData[`weight_${i}`],
    dimensions: formData[`dimensions_${i}`]
      ? `${formData[`dimensions_${i}`].length} x ${formData[`dimensions_${i}`].width} x ${
          formData[`dimensions_${i}`].height
        }`
      : 'N/A',
    volumeWeight: 0,
    insurance: formData[`insurance_${i}`] ? `$${formData[`insurance_${i}`]}` : 'N/A',
  }));

  return (
    <Card>
      <Title level={3}>Shipment Overview</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Descriptions title="From" bordered column={1}>
            <Descriptions.Item label="City">{formData.senderCity}</Descriptions.Item>
            <Descriptions.Item label="Province/State">{formData.senderProvince}</Descriptions.Item>
            <Descriptions.Item label="Country">{formData.senderCountry}</Descriptions.Item>
            <Descriptions.Item label="Postal Code">{formData.senderPostalCode}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={12}>
          <Descriptions title="To" bordered column={1}>
            <Descriptions.Item label="City">{formData.recipientCity}</Descriptions.Item>
            <Descriptions.Item label="Province/State">
              {formData.recipientProvince}
            </Descriptions.Item>
            <Descriptions.Item label="Country">{formData.recipientCountry}</Descriptions.Item>
            <Descriptions.Item label="Postal Code">
              {formData.recipientPostalCode}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Descriptions style={{ marginTop: 16 }} bordered column={2}>
        <Descriptions.Item label="Reference">{formData.reference || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Remark">{formData.remark || 'N/A'}</Descriptions.Item>
      </Descriptions>

      <Title level={4} style={{ marginTop: 24, textAlign: 'center' }}>
        Package {`(${formData.packageType})`}
      </Title>
      <Table columns={packageColumns} dataSource={packageData} pagination={false} />

      <Title level={4} style={{ marginTop: 24 }}>
        Select Service
      </Title>
      <Table columns={quoteColumns} dataSource={quoteData} />
    </Card>
  );
};

export default ShipmentOverview;

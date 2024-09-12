import React, { useState } from 'react';
import { Form, Card, Input, Select, Checkbox, Row, Col, Typography, Alert } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import PackageInformationForm from './PackageInformationForm';

const { Title, Text } = Typography;
const { Option } = Select;

interface QuoteInfoProps {
  form: any;
  onFinish: (values: any) => void;
  handleRegionChange: (value: string, type: 'sender' | 'recipient') => void;
  handleRegionSearch: (input: string, option: any) => boolean;
  selectedRegions: any;
  regions: any[];
  provincesByRegion: any;
}

const QuoteInfo: React.FC<QuoteInfoProps> = ({
  form,
  onFinish,
  handleRegionChange,
  handleRegionSearch,
  selectedRegions,
  regions,
  provincesByRegion,
}) => {
  const [senderProvinceObject, setSenderProvinceObject] = useState(null);
  const [recipientProvinceObject, setRecipientProvinceObject] = useState(null);

  const handleSenderProvinceChange = (value) => {
    const selectedProvince = provincesByRegion[selectedRegions.sender]?.find(
      (p) => p.code === value,
    );
    setSenderProvinceObject(selectedProvince);
    form.setFieldsValue({ senderProvinceObject: selectedProvince });
  };

  const handleRecipientProvinceChange = (value) => {
    const selectedProvince = provincesByRegion[selectedRegions.recipient]?.find(
      (p) => p.code === value,
    );
    setRecipientProvinceObject(selectedProvince);
    form.setFieldsValue({ recipientProvinceObject: selectedProvince });
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="right"
    >
      <Card style={{ marginBottom: 24 }}>
        <Title
          level={3}
          style={{
            backgroundColor: '#f0f2f5',
            padding: '12px 16px',
            marginBottom: 16,
            borderLeft: '4px solid #1890ff',
          }}
        >
          Shipping Details
        </Title>
        <Row gutter={24}>
          <Col span={12}>
            <Title level={4}>SHIP FROM (English)</Title>
            <Form.Item name="senderName" label="Search">
              <Input />
            </Form.Item>
            <Form.Item name="senderCountry" label="Country/Region" rules={[{ required: true }]}>
              <Select
                showSearch
                filterOption={handleRegionSearch}
                onChange={(value) => handleRegionChange(value, 'sender')}
                defaultActiveFirstOption={false}
              >
                {regions.map((region) => (
                  <Option key={region.id} value={region.id}>
                    {region.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="senderCity" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="senderProvince" label="Province/State" rules={[{ required: true }]}>
              <Select onChange={handleSenderProvinceChange}>
                {provincesByRegion[selectedRegions.sender]?.map((province) => (
                  <Option key={province.id} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="senderProvinceObject" hidden={true}>
              <Input />
            </Form.Item>
            <Form.Item name="senderPostalCode" label="Postal Code" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="saveSenderAddress" valuePropName="checked" label="Options">
              <Checkbox>Save this address in your address book?</Checkbox>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Title level={4}>SHIP TO (English)</Title>
            <Form.Item name="recipientName" label="Search">
              <Input />
            </Form.Item>
            <Form.Item name="recipientCountry" label="Country/Region" rules={[{ required: true }]}>
              <Select
                showSearch
                filterOption={handleRegionSearch}
                onChange={(value) => handleRegionChange(value, 'recipient')}
                defaultActiveFirstOption={false}
              >
                {regions.map((region) => (
                  <Option key={region.id} value={region.id}>
                    {region.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="recipientCity" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="recipientProvince" label="Province/State" rules={[{ required: true }]}>
              <Select onChange={handleRecipientProvinceChange}>
                {provincesByRegion[selectedRegions.recipient]?.map((province) => (
                  <Option key={province.id} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="recipientProvinceObject" hidden={true}>
              <Input />
            </Form.Item>
            <Form.Item name="recipientPostalCode" label="Postal Code" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="recipientAddressType"
              label="Address Type"
              rules={[{ required: true }]}
              extra={
                <Text type="secondary" style={{ color: '#1677ff', display: 'block', marginTop: 4 }}>
                  <QuestionCircleOutlined style={{ marginRight: 4 }} />
                  Residential Surcharge may apply.
                </Text>
              }
            >
              <Select>
                <Option value="residential">Residential</Option>
                <Option value="commercial">Commercial</Option>
              </Select>
            </Form.Item>
            <Form.Item name="saveRecipientAddress" valuePropName="checked" label="Options">
              <Checkbox>Save this address in your address book?</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <PackageInformationForm form={form} />

      <Card style={{ marginBottom: 24 }}>
        <Title
          level={3}
          style={{
            backgroundColor: '#f0f2f5',
            padding: '12px 16px',
            marginBottom: 16,
            borderLeft: '4px solid #1890ff',
          }}
        >
          Additional Options
        </Title>
        <Row gutter={24}>
          <Col span={12}>
            <Title level={4}>Options</Title>
            <Form.Item
              name="reference"
              label="Reference#"
              extra={
                <Text type="secondary" style={{ color: '#1677ff' }}>
                  <QuestionCircleOutlined style={{ marginRight: 4 }} />
                  The Reference is for personal use and will also show on the label.
                </Text>
              }
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="remark"
              label="Remark"
              extra={
                <Text type="secondary" style={{ color: '#1677ff' }}>
                  <QuestionCircleOutlined style={{ marginRight: 4 }} />
                  The Remark is for operational reference only.
                </Text>
              }
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Alert
        message="Notice"
        description={
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
            <li>
              The quoted prices and ETAs are estimated depending on the information you provide. The
              final price and transit time may change based on the differences in accurate post
              code, address, weight, dimensions and the type of services etc.
            </li>
            <li>
              Depending on the characteristics of package, the surcharges (Remote area, Large
              Package, Additional Handing, Oversize Package, Overweight Package etc.) may apply.
            </li>
            <li>
              All quotes may not include the taxes, duties and additional service fees (Signature,
              COD etc.).
            </li>
            <li>
              The Guaranteed Delivery Time is not applied to the shipments which contains the
              surcharge, remote areas and high value.
            </li>
          </ul>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
    </Form>
  );
};

export default QuoteInfo;

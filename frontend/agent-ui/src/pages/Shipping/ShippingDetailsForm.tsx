import React, { useEffect } from 'react';
import { Form, Input, Select, Checkbox, Row, Col, Typography, Card, FormInstance } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';

const { Title, Text } = Typography;
const { Option } = Select;

interface ShippingDetailsFormProps {
  form: FormInstance;
  onValuesChange: (changedValues: any, allValues: any) => void;
  formData: Any;
  createOrder: boolean;
}

const ShippingDetailsForm: React.FC<ShippingDetailsFormProps> = ({
  form,
  onValuesChange,
  formData,
  createOrder,
}) => {
  const { regions, provincesByRegion, fetchProvincesByRegion, fetchRegions } =
    useModel('carrierModel');
  const [selectedRegions, setSelectedRegions] = React.useState({
    sender: 'CA',
    recipient: 'CA',
  });

  const initialValues = (formData && Object.keys(formData).length > 0) || createOrder;

  const handleRegionChange = (value: string, type: 'sender' | 'recipient') => {
    fetchProvincesByRegion(value);
    setSelectedRegions((prev) => ({ ...prev, [type]: value }));
    form.setFieldsValue({ [`${type}State`]: undefined });
  };

  const handleRegionSearch = (input: string, option: any) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const handleProvinceChange = (value: string, type: 'sender' | 'recipient') => {
    const selectedProvince = provincesByRegion[selectedRegions[type]]?.find(
      (p) => p.code === value,
    );
    form.setFieldsValue({ [`${type}ProvinceObject`]: selectedProvince });
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return (
    <Form
      form={form}
      layout="horizontal"
      onValuesChange={onValuesChange}
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
            <Form.Item
              name="senderName"
              label={initialValues ? 'Contact Name' : 'Search'}
              rules={[{ required: initialValues ? true : false }]}
            >
              <Input />
            </Form.Item>
            {!initialValues ? (
              <>
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
              </>
            ) : (
              <>
                <Form.Item name="senderCompany" label="Company Name">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="senderMobile"
                  label="Cellphone Number"
                  rules={[{ required: true }]}
                >
                  <Input
                    addonBefore={
                      <Select style={{ width: 70 }}>
                        <Option value="+1">+1</Option>
                        <Option value="+86">+86</Option>
                        {/* Add more country codes */}
                      </Select>
                    }
                  />
                </Form.Item>
                <Form.Item name="senderAddress1" label="Address 1" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="senderAddress2" label="Address 2">
                  <Input />
                </Form.Item>
                <Form.Item name="senderAddress3" label="Address 3">
                  <Input />
                </Form.Item>
              </>
            )}
            <Form.Item name="senderCity" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="senderProvince" label="Province/State" rules={[{ required: true }]}>
              <Select onChange={(value) => handleProvinceChange(value, 'sender')}>
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
            <Form.Item
              name="recipientName"
              label={initialValues ? 'Contact Name' : 'Search'}
              rules={[{ required: initialValues ? true : false }]}
            >
              <Input />
            </Form.Item>
            {initialValues && (
              <>
                <Form.Item name="recipientCompany" label="Company Name">
                  <Input />
                </Form.Item>
                <Form.Item name="recipientEmail" label="Email">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="recipientMobile"
                  label="Cellphone Number"
                  rules={[{ required: true }]}
                >
                  <Input
                    addonBefore={
                      <Select style={{ width: 70 }}>
                        <Option value="+1">+1</Option>
                        <Option value="+86">+86</Option>
                        {/* Add more country codes */}
                      </Select>
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="recipientAddressType"
                  label="Address Type"
                  rules={[{ required: true }]}
                  extra={
                    <Text
                      type="secondary"
                      style={{ color: '#1677ff', display: 'block', marginTop: 4 }}
                    >
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
                <Form.Item name="recipientAddress1" label="Address 1" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="recipientAddress2" label="Address 2">
                  <Input />
                </Form.Item>
                <Form.Item name="recipientAddress3" label="Address 3">
                  <Input />
                </Form.Item>
              </>
            )}
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
              <Select onChange={(value) => handleProvinceChange(value, 'recipient')}>
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
    </Form>
  );
};

export default ShippingDetailsForm;

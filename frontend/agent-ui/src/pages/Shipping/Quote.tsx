import React, { useState, useEffect } from 'react';
import { Form, Card, Input, Select, Checkbox, Row, Col, Typography, Alert } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const Quote: React.FC = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [showConfirmationTypeOptions, setShowConfirmationTypeOptions] = useState(false);
  const [packageType, setPackageType] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    // Handle form submission
  };

  const handlePackageTypeChange = (value: string) => {
    setPackageType(value);
    form.resetFields(['quantity', 'weight', 'dimensions', 'insurance']);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  return (
    <div>
      <h1>Shipping Quote</h1>
      <>
        <Form
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          initialValues={formData}
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
                <Form.Item name="senderSerach" label="Search">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="senderCountry"
                  label="Country/Region"
                  rules={[{ required: true }]}
                  initialValue="Canada"
                >
                  <Select>
                    <Option value="Canada">Canada</Option>
                    {/* Add more country options */}
                  </Select>
                </Form.Item>
                <Form.Item name="senderCity" label="City" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="senderState" label="Province/State" rules={[{ required: true }]}>
                  <Select>
                    {/* Add state/province options */}
                    <Option value="state1">State 1</Option>
                    <Option value="state2">State 2</Option>
                  </Select>
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
                <Form.Item name="recipientSerach" label="Search">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="recipientCountry"
                  label="Country/Region"
                  rules={[{ required: true }]}
                  initialValue="Canada"
                >
                  <Select>
                    <Option value="Canada">Canada</Option>
                    {/* Add more country options */}
                  </Select>
                </Form.Item>
                <Form.Item name="recipientCity" label="City" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="recipientState"
                  label="Province/State"
                  rules={[{ required: true }]}
                >
                  <Select>
                    {/* Add state/province options */}
                    <Option value="state1">State 1</Option>
                    <Option value="state2">State 2</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="recipientPostalCode"
                  label="Postal Code"
                  rules={[{ required: true }]}
                >
                  <Input />
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
                <Form.Item name="saveRecipientAddress" valuePropName="checked" label="Options">
                  <Checkbox>Save this address in your address book?</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Card>

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
              Package Information
            </Title>
            <Row>
              <Col span={24}>
                <Title level={4}>Packages</Title>
                <Form.Item
                  name="packageType"
                  label="Package Type"
                  rules={[{ required: true }]}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  extra={
                    <Text type="secondary" style={{ color: '#1677ff' }}>
                      <QuestionCircleOutlined style={{ marginRight: 4 }} />
                      Select 'Env' for courier brand envelope; 'Pak' for courier brand box; 'Parcel'
                      for regular cardboard box. Please NOTE that the type of 'Pak' is not supported
                      for DHL.
                    </Text>
                  }
                >
                  <Select onChange={handlePackageTypeChange}>
                    <Option value="env">Env</Option>
                    <Option value="pak">Pak(Unavailable for DHL)</Option>
                    <Option value="parcel">Parcel</Option>
                    <Option value="pallet">Pallet</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
                {(packageType === 'parcel' ||
                  packageType === 'pallet' ||
                  packageType === 'other') && (
                  <>
                    <Form.Item
                      name="quantity"
                      label="Quantity"
                      rules={[{ required: true }]}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <Select onChange={handleQuantityChange}>
                        {Array.from({ length: 20 }, (_, i) => (
                          <Option key={i + 1} value={i + 1}>
                            {i + 1}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {Array.from({ length: quantity }, (_, i) => (
                      <div key={i}>
                        <Title level={5}>Package #{i + 1}</Title>
                        <Form.Item
                          name={`weight_${i}`}
                          label="Package Weight (lb)"
                          rules={[
                            {
                              required: true,
                              type: 'number',
                              transform: (value) => Number(value),
                            },
                          ]}
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 20 }}
                        >
                          <Input type="number" step="0.01" addonAfter="lb" />
                        </Form.Item>
                        <Form.Item
                          label="Dimensions (in)"
                          required
                          style={{ marginBottom: 0 }}
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 20 }}
                        >
                          <Input.Group compact>
                            <Form.Item
                              name={[`dimensions_${i}`, 'length']}
                              noStyle
                              rules={[{ required: true, message: 'Length is required' }]}
                            >
                              <Input
                                style={{ width: '30%' }}
                                placeholder="L"
                                type="number"
                                step="0.1"
                              />
                            </Form.Item>
                            <span style={{ padding: '0 8px' }}>x</span>
                            <Form.Item
                              name={[`dimensions_${i}`, 'width']}
                              noStyle
                              rules={[{ required: true, message: 'Width is required' }]}
                            >
                              <Input
                                style={{ width: '30%' }}
                                placeholder="W"
                                type="number"
                                step="0.1"
                              />
                            </Form.Item>
                            <span style={{ padding: '0 8px' }}>x</span>
                            <Form.Item
                              name={[`dimensions_${i}`, 'height']}
                              noStyle
                              rules={[{ required: true, message: 'Height is required' }]}
                            >
                              <Input
                                style={{ width: '30%' }}
                                placeholder="H"
                                type="number"
                                step="0.1"
                                addonAfter="in"
                              />
                            </Form.Item>
                          </Input.Group>
                        </Form.Item>
                        <Form.Item
                          name={`insurance_${i}`}
                          style={{ marginTop: 20 }}
                          label="Carrier Insurance ($)"
                          rules={[
                            {
                              required: true,
                              type: 'number',
                              transform: (value) => Number(value),
                            },
                          ]}
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 20 }}
                        >
                          <Input type="number" step="0.01" addonAfter="$" />
                        </Form.Item>
                      </div>
                    ))}
                  </>
                )}
                {(packageType === 'env' || packageType === 'pak') && (
                  <Form.Item
                    name="weight"
                    label="Package Weight (lb)"
                    rules={[
                      { required: true, type: 'number', transform: (value) => Number(value) },
                    ]}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Input type="number" step="0.01" addonAfter="lb" />
                  </Form.Item>
                )}
              </Col>
            </Row>
          </Card>

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
                  The quoted prices and ETAs are estimated depending on the information you provide.
                  The final price and transit time may change based on the differences in accurate
                  post code, address, weight, dimensions and the type of services etc.
                </li>
                <li>
                  Depending on the characteristics of package, the surcharges (Remote area, Large
                  Package, Additional Handing, Oversize Package, Overweight Package etc.) may apply.
                </li>
                <li>
                  All quotes may not include the taxes, duties and additional service fees
                  (Signature, COD etc.).
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
      </>
    </div>
  );
};

export default Quote;

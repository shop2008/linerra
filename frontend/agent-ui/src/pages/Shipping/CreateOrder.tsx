import { QuestionCircleOutlined, TruckOutlined } from '@ant-design/icons';
import {
  Affix,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  Modal,
  List,
} from 'antd';
import React, { useState, useEffect } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface ShippingServiceFormProps {
  selectedService: string;
  onReselect: () => void;
  formData: any;
  onFormDataChange: (formData: any) => void;
}

const ShippingServiceForm: React.FC<ShippingServiceFormProps> = ({
  selectedService,
  onReselect,
  formData,
  onFormDataChange,
}) => {
  const [form] = Form.useForm();
  const [showConfirmationTypeOptions, setShowConfirmationTypeOptions] = useState(false);
  const [packageType, setPackageType] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    // Handle form submission
  };

  const handleDeliveryConfirmationChange = (value: string) => {
    setShowConfirmationTypeOptions(value === 'yes');
    if (value !== 'yes') {
      form.setFieldsValue({ additionalOption: undefined });
    }
  };

  const handlePackageTypeChange = (value: string) => {
    setPackageType(value);
    form.resetFields(['quantity', 'weight', 'dimensions', 'insurance']);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    onFormDataChange(allValues);
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  return (
    <>
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
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
            Carrier & Service
          </Title>
          <Row justify="space-between" align="top" style={{ marginBottom: '20px' }}>
            <Col>
              <Space align="start">
                <TruckOutlined style={{ fontSize: '50px', color: '#1890ff' }} />
                <Space direction="vertical" size={0}>
                  <Title level={4} style={{ margin: 0 }}>
                    Purolator
                  </Title>
                  <Text type="secondary">{selectedService.split(' - ')[0]}</Text>
                </Space>
              </Space>
            </Col>
            <Col>
              <Button onClick={onReselect}>Re-Select</Button>
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
            Shipping Details
          </Title>
          <Row gutter={24}>
            <Col span={12}>
              <Title level={4}>SHIP FROM (English)</Title>
              <Form.Item name="senderName" label="Contact Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="senderCompany" label="Company Name">
                <Input />
              </Form.Item>
              <Form.Item name="senderMobile" label="Cellphone Number" rules={[{ required: true }]}>
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
              <Form.Item name="recipientName" label="Contact Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
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
              <Form.Item name="recipientCity" label="City" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="recipientState" label="Province/State" rules={[{ required: true }]}>
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
                          { required: true, type: 'number', transform: (value) => Number(value) },
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
                          { required: true, type: 'number', transform: (value) => Number(value) },
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
                  rules={[{ required: true, type: 'number', transform: (value) => Number(value) }]}
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
              <Form.Item name="labelFormat" label="Label Format">
                <Select>
                  <Option value="placeholder">Select</Option>
                  <Option value="regular">Regular</Option>
                  <Option value="thermal">Thermal</Option>
                </Select>
              </Form.Item>
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
            <Col span={12}>
              <Title level={4}>Value-added Services</Title>
              <Form.Item name="deliveryConfirmation" label="Delivery Confirmation">
                <Select onChange={handleDeliveryConfirmationChange}>
                  <Option value="no">No</Option>
                  <Option value="yes">Yes</Option>
                </Select>
              </Form.Item>
              {showConfirmationTypeOptions && (
                <Form.Item
                  name="confirmationType"
                  label="Confirmation Type"
                  rules={[
                    {
                      required: showConfirmationTypeOptions,
                      message: 'Please select an additional option!',
                    },
                  ]}
                >
                  <Select>
                    <Option value="option1">No Signature Required</Option>
                    <Option value="option2">Residential Signature Domestic</Option>
                    <Option value="option2">Adult Signature Required</Option>
                  </Select>
                </Form.Item>
              )}
              <Form.Item name="notes" label="Notes?">
                <Select>
                  <Option value="no">No</Option>
                  <Option value="yes">Yes</Option>
                </Select>
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
            Notice
          </Title>
          <Row>
            <Col span={24}>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
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
            </Col>
          </Row>
        </Card>
      </Form>
      <Affix offsetBottom={0} style={{ width: '100%' }}>
        <div
          style={{
            backgroundColor: 'white',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Space align="start">
            <TruckOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
            <Space direction="vertical" size={0}>
              <Title level={5} style={{ margin: 0 }}>
                Purolator
              </Title>
              <Text type="secondary">{selectedService.split(' - ')[0]}</Text>
            </Space>
          </Space>
          <Space>
            <Button type="default" onClick={() => form.resetFields()}>
              Reset
            </Button>
            <Button type="primary" onClick={() => form.submit()}>
              Submit
            </Button>
          </Space>
        </div>
      </Affix>
    </>
  );
};

const CreateOrder: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({});

  const services = [
    { name: 'Ground', description: 'Standard ground shipping' },
    { name: 'PurolatorExpress', description: 'Fast express shipping' },
    { name: 'PurolatorExpressEnvelope', description: 'Express shipping for envelopes' },
    { name: 'PurolatorGround', description: 'Economical ground shipping' },
  ];

  const handleServiceSelection = (service: { name: string; description: string }) => {
    setSelectedService(`${service.name} - ${service.description}`);
    setIsModalVisible(false);
  };

  const handleReselect = () => {
    setIsModalVisible(true);
  };

  const handleFormDataChange = (newFormData: any) => {
    setFormData(newFormData);
  };

  return (
    <div>
      <Modal
        title="Select Shipping Service"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Space align="start" style={{ marginBottom: '20px' }}>
          <TruckOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          <Title level={3} style={{ margin: 0 }}>
            Purolator
          </Title>
        </Space>
        <List
          itemLayout="horizontal"
          dataSource={services}
          renderItem={(item) => (
            <List.Item onClick={() => handleServiceSelection(item)} style={{ cursor: 'pointer' }}>
              <List.Item.Meta title={item.name} style={{ padding: '0px' }} />
            </List.Item>
          )}
        />
      </Modal>
      {selectedService && (
        <ShippingServiceForm
          selectedService={selectedService}
          onReselect={handleReselect}
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      )}
    </div>
  );
};

export default CreateOrder;

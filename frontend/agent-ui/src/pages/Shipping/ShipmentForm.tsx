import React from 'react';
import { Card, Form, Input, Select, Checkbox, Alert, Typography, Row, Col } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import PackageInformationForm from './PackageInformationForm';

const { Title, Text } = Typography;
const { Option } = Select;

interface ShipmentFormProps {
  form: any;
  onValuesChange: (changedValues: any, allValues: any) => void;
  initialValues?: any;
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({ form, onValuesChange, initialValues }) => {
  const [showConfirmationTypeOptions, setShowConfirmationTypeOptions] = React.useState(false);

  const handleDeliveryConfirmationChange = (value: string) => {
    setShowConfirmationTypeOptions(value === 'yes');
    if (value !== 'yes') {
      form.setFieldsValue({ confirmationType: undefined });
    }
  };

  console.log('initialValues', initialValues);
  return (
    <Form
      form={form}
      layout="horizontal"
      onValuesChange={onValuesChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="right"
      initialValues={initialValues.shipmentData} // Add this line
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
            <Form.Item name="recipientMobile" label="Cellphone Number" rules={[{ required: true }]}>
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
            <Form.Item name="recipientPostalCode" label="Postal Code" rules={[{ required: true }]}>
              <Input />
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

export default ShipmentForm;

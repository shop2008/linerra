import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, Select, Input, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface AdditionalOptionsFormProps {
  form: FormInstance;
  formData: any;
}

const AdditionalOptionsForm: React.FC<AdditionalOptionsFormProps> = ({ form, formData }) => {
  const [showConfirmationTypeOptions, setShowConfirmationTypeOptions] = useState(false);

  const handleDeliveryConfirmationChange = (value: string) => {
    setShowConfirmationTypeOptions(value === 'yes');
    if (value !== 'yes') {
      form.setFieldsValue({ confirmationType: undefined });
    }
  };

  const initialValues = formData && Object.keys(formData).length > 0;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(formData);
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="horizontal"
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
                  <Option value="option3">Adult Signature Required</Option>
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
    </Form>
  );
};

export default AdditionalOptionsForm;

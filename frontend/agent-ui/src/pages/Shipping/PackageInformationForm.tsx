import React, { useEffect } from 'react';
import { Card, Form, Input, Select, Typography, Row, Col, FormInstance } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface PackageInformationFormProps {
  form: FormInstance;
  formData: any;
}

const PackageInformationForm: React.FC<PackageInformationFormProps> = ({ form, formData }) => {
  const [packageType, setPackageType] = React.useState<string>(
    form.getFieldsValue()?.packageType || '',
  );
  const [quantity, setQuantity] = React.useState<number>(form.getFieldsValue()?.quantity || 1);

  const initialValues = formData && Object.keys(formData).length > 0;

  console.log('PackageInformationForm', form.getFieldsValue());

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(formData);
      setPackageType(form.getFieldsValue()?.packageType || '');
      setQuantity(form.getFieldsValue()?.quantity || 1);
    }
  }, [initialValues, form]);

  const handlePackageTypeChange = (value: string) => {
    setPackageType(value);
    form.resetFields(['quantity', 'weight', 'dimensions', 'insurance']);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

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
                  Select 'Env' for courier brand envelope; 'Pak' for courier brand box; 'Parcel' for
                  regular cardboard box. Please NOTE that the type of 'Pak' is not supported for
                  DHL.
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
            {(packageType === 'parcel' || packageType === 'pallet' || packageType === 'other') && (
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
    </Form>
  );
};

export default PackageInformationForm;

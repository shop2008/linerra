import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  Card,
  Input,
  Select,
  Checkbox,
  Row,
  Col,
  Typography,
  Alert,
  Button,
  Steps,
  Affix,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useCarrierModel from '@/models/carrierModel';
import { postQuote } from '@/services/service/verkApi';
import ShipmentOverview from './ShipmentOverview';
import Loading from '@/components/Loading'; // Add this line

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const Quote: React.FC = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>({});
  const [packageType, setPackageType] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedRegions, setSelectedRegions] = useState({
    sender: {
      id: 'CA',
      name: 'Canada',
      type: 'CP',
      timezone: 'America/Blanc-Sablon',
    },
    recipient: {
      id: 'CA',
      name: 'Canada',
      type: 'CP',
      timezone: 'America/Blanc-Sablon',
    },
  });
  const { regions, provincesByRegion, fetchRegions, fetchProvincesByRegion } = useCarrierModel();
  const [currentStep, setCurrentStep] = useState(0);
  const [quoteResponse, setQuoteResponse] = useState<Array<VerkType.QuoteResponse | null>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegions();
    fetchProvincesByRegion('CA'); // Fetch provinces for Canada
  }, [fetchRegions, fetchProvincesByRegion]);

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

  const handleRegionChange = (value: string, type: 'sender' | 'recipient') => {
    fetchProvincesByRegion(value);
    setSelectedRegions((prev) => ({ ...prev, [type]: value }));
    form.setFieldsValue({ [`${type}State`]: undefined });
  };

  const handleRegionSearch = (input: string, option: any) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const handleReset = () => {
    form.resetFields();
    setCurrentStep(0);
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      const formValues = form.getFieldsValue();
      setFormData(formValues); // Store form data

      if (currentStep === 0) {
        const quoteRequest: VerkType.QuoteRequest = {
          carrierIds: [],
          initiation: {
            address: '',
            address2: '',
            city: formValues.senderCity,
            company: '',
            mobilePhone: '',
            name: formValues.senderName || '',
            postalCode: formValues.senderPostalCode,
            province: formValues.senderProvince,
            regionId: formValues.senderCountry,
            type: '',
          },
          destination: {
            address: '',
            address2: '',
            city: formValues.recipientCity,
            company: '',
            mobilePhone: '',
            name: formValues.recipientName || '',
            postalCode: formValues.recipientPostalCode,
            province: formValues.recipientProvince,
            regionId: formValues.recipientCountry,
            type: formValues.recipientAddressType,
          },
          option: {
            memo: formValues.remark,
            packingFee: 0,
            vipAccount: formValues.reference,
          },
          package: {
            packages:
              formValues.packageType === 'env' || formValues.packageType === 'pak'
                ? [
                    {
                      weight: formValues.weight,
                      // For env and pak, we don't need dimensions or insurance
                    },
                  ]
                : Array.from({ length: formValues.quantity || 1 }, (_, i) => ({
                    dimension: {
                      height: formValues[`dimensions_${i}`].height,
                      length: formValues[`dimensions_${i}`].length,
                      width: formValues[`dimensions_${i}`].width,
                    },
                    insurance: formValues[`insurance_${i}`],
                    weight: formValues[`weight_${i}`],
                  })),
            type: formValues.packageType,
          },
        };

        // Call the postQuote API
        const response = await postQuote(quoteRequest);
        setQuoteResponse(response.data ?? []); // Store the response in state
      }

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Form validation failed or API call error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = useCallback(() => {
    setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const steps = [
    { title: 'Quote', content: '' },
    { title: 'Select Service', content: '' },
    { title: 'Fill Infos', content: '' },
    { title: 'Complete', content: '' },
  ];

  return (
    <div>
      {loading && <Loading />}
      <h1>Shipping Quote</h1>
      {currentStep === 0 ? (
        <>
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
                  <Form.Item
                    name="senderCountry"
                    label="Country/Region"
                    rules={[{ required: true }]}
                  >
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
                  <Form.Item
                    name="senderProvince"
                    label="Province/State"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      {provincesByRegion[selectedRegions.sender]?.map((province) => (
                        <Option key={province.code} value={province.code}>
                          {province.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="senderPostalCode"
                    label="Postal Code"
                    rules={[{ required: true }]}
                  >
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
                  <Form.Item
                    name="recipientCountry"
                    label="Country/Region"
                    rules={[{ required: true }]}
                  >
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
                  <Form.Item
                    name="recipientProvince"
                    label="Province/State"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      {provincesByRegion[selectedRegions.recipient]?.map((province) => (
                        <Option key={province.code} value={province.code}>
                          {province.name}
                        </Option>
                      ))}
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
                        Select 'Env' for courier brand envelope; 'Pak' for courier brand box;
                        'Parcel' for regular cardboard box. Please NOTE that the type of 'Pak' is
                        not supported for DHL.
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
                    The quoted prices and ETAs are estimated depending on the information you
                    provide. The final price and transit time may change based on the differences in
                    accurate post code, address, weight, dimensions and the type of services etc.
                  </li>
                  <li>
                    Depending on the characteristics of package, the surcharges (Remote area, Large
                    Package, Additional Handing, Oversize Package, Overweight Package etc.) may
                    apply.
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
      ) : currentStep === 1 ? (
        <>
          <ShipmentOverview quoteResponse={quoteResponse} formData={formData} />
          <Button onClick={handlePrevious} style={{ marginTop: 16 }}>
            Back
          </Button>
        </>
      ) : (
        // Other steps (if any)
        <div>Additional steps will be implemented here</div>
      )}
      <Affix offsetBottom={20}>
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fff',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Steps current={currentStep} size="small" style={{ marginBottom: 16 }}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleReset} style={{ marginRight: 8 }}>
              Reset
            </Button>
            <Button type="primary" onClick={handleNext}>
              {currentStep < steps.length - 1 ? 'Next' : 'Submit'}
            </Button>
          </div>
        </div>
      </Affix>
    </div>
  );
};

export default Quote;

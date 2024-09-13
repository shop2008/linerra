import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Steps, Affix, message } from 'antd';
import { useModel } from '@umijs/max';
import { postQuote, postShipment } from '@/services/service/verkApi';
import ShipmentOverview from './ShipmentOverview';
import QuoteInfo from './QuoteInfo';
import ShipmentDetails from './ShipmentDetails';
import { Spin } from 'antd';
import OrderSuccess from './OrderSuccess';

const { Step } = Steps;

const Quote: React.FC = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>({});
  const { carriers, modelLoading, fetchCarriers } = useModel('carrierModel');
  const [currentStep, setCurrentStep] = useState(0);
  const [quoteResponse, setQuoteResponse] = useState<Array<VerkType.QuoteResponse | null>>([]);
  const [selectedQuote, setSelectedQuote] = useState<VerkType.QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const onFinish = (values: any) => {
    console.log('Form values:', values);
    // Handle form submission
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  useEffect(() => {
    fetchCarriers();
  }, []);

  const handleNext = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      const formValues = form.getFieldsValue();
      console.log('Form values:', formValues);
      setFormData(formValues); // Store form data

      if (currentStep === 0) {
        const quoteRequest: VerkType.QuoteRequest = {
          carrierIds: carriers.map((carrier) => carrier.id),
          initiation: {
            address: '',
            address2: '',
            city: formValues.senderCity,
            company: '',
            mobilePhone: '',
            name: formValues.senderName || '',
            postalCode: formValues.senderPostalCode,
            province: formValues.senderProvinceObject,
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
            province: formValues.recipientProvinceObject,
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
      } else if (currentStep === 2) {
        // This is the last step, submit the shipment
        const shipmentData: VerkType.QuoteRequest = {
          serviceId: selectedQuote?.services[0].id || '',
          initiation: {
            address: formValues.senderAddress,
            address2: formValues.senderAddress2,
            address3: formValues.senderAddress3,
            city: formValues.senderCity,
            company: formValues.senderCompany,
            mobilePhone: formValues.senderMobile,
            name: formValues.senderName,
            postalCode: formValues.senderPostalCode,
            province: formValues.senderProvinceObject,
            regionId: formValues.senderCountry,
            type: 'sender',
          },
          destination: {
            address: formValues.recipientAddress,
            address2: formValues.recipientAddress2,
            address3: formValues.recipientAddress3,
            city: formValues.recipientCity,
            company: formValues.recipientCompany,
            mobilePhone: formValues.recipientMobile,
            name: formValues.recipientName,
            postalCode: formValues.recipientPostalCode,
            province: formValues.recipientProvinceObject,
            regionId: formValues.recipientCountry,
            type: formValues.recipientAddressType,
          },
          option: {
            memo: formValues.remark,
            packingFee: formValues.packingFee || 0,
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

        const response = await postShipment(shipmentData);
        if (response.success) {
          message.success(`Shipment created successfully. Number: ${response.data.number}`);
          // You might want to redirect to a shipment details page or reset the form
        } else {
          message.error('Failed to create shipment. Please try again.');
        }
      }

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Form validation failed or API call error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      await form.validateFields();
      const formValues = form.getFieldsValue();
      console.log('Form values:', formValues);
      setFormData(formValues); // Store form data

      // This is the last step, submit the shipment
      const shipmentData: VerkType.QuoteRequest = {
        serviceId: selectedQuote?.serviceId || '',
        initiation: {
          address: formValues.senderAddress1,
          address2: formValues.senderAddress2 || '',
          address3: formValues.senderAddress3,
          city: formValues.senderCity,
          company: formValues.senderCompany || '',
          mobilePhone: formValues.senderMobile,
          name: formValues.senderName,
          postalCode: formValues.senderPostalCode.replace(/\s/g, ''),
          province: formValues.senderProvinceObject,
          regionId: 'CA',
        },
        destination: {
          address: formValues.recipientAddress1,
          address2: formValues.recipientAddress2 || '',
          address3: formValues.recipientAddress3,
          city: formValues.recipientCity,
          company: formValues.recipientCompany,
          mobilePhone: formValues.recipientMobile,
          name: formValues.recipientName,
          postalCode: formValues.recipientPostalCode.replace(/\s/g, ''),
          province: formValues.recipientProvinceObject,
          regionId: formValues.recipientCountry,
          type: formValues.recipientAddressType,
        },
        option: {
          memo: formValues.remark,
          packingFee: formValues.packingFee || 0,
          vipAccount: formValues.reference,
        },
        package: {
          packages:
            formValues.packageType === 'env' || formValues.packageType === 'pak'
              ? [
                  {
                    weight: Number(formValues.weight),
                    insurance: 0,
                    dimension: {
                      height: 0,
                      length: 0,
                      width: 0,
                    },
                    // For env and pak, we don't need dimensions or insurance
                  },
                ]
              : Array.from({ length: formValues.quantity || 1 }, (_, i) => ({
                  dimension: {
                    height: Number(formValues[`dimensions_${i}`].height),
                    length: Number(formValues[`dimensions_${i}`].length),
                    width: Number(formValues[`dimensions_${i}`].width),
                  },
                  insurance: Number(formValues[`insurance_${i}`]) || 0,
                  weight: Number(formValues[`weight_${i}`]),
                })),
          type: formValues.packageType,
        },
      };
      const response = await postShipment(shipmentData);
      if (response.success) {
        message.success(`Shipment created successfully. Number: ${response.data?.number}`);
        setOrderNumber(response.data?.number || '');
        console.log('currentStep', currentStep);
        setCurrentStep(steps.length - 1);
      } else {
        message.error('Failed to create shipment. Please try again.');
      }
    } catch (error) {
      console.error('Form validation failed or API call error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const handleSelectQuote = (quote: VerkType.QuoteResponse) => {
    setSelectedQuote(quote);
    console.log('selectedQuote', quote);
    setCurrentStep(currentStep + 1);
  };

  const steps = [
    { title: 'Quote', content: '' },
    { title: 'Select Service', content: '' },
    { title: 'Fill Infos', content: '' },
    { title: 'Complete', content: '' },
  ];

  if (modelLoading.regions) {
    return <Spin />;
  }

  const renderStepContent = () => {
    console.log('currentStep', currentStep);
    switch (currentStep) {
      case 0:
        return <QuoteInfo form={form} onFinish={onFinish} />;
      case 1:
        return (
          <ShipmentOverview
            form={form}
            quoteResponse={quoteResponse}
            onSelectQuote={handleSelectQuote}
          />
        );
      case 2:
        return <ShipmentDetails form={form} selectedQuote={selectedQuote} formData={formData} />;
      case 3:
        return <OrderSuccess orderNumber={orderNumber} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Spin spinning={loading} tip="Processing...">
        <Form form={form}>
          {renderStepContent()}
          <Affix offsetBottom={20}>
            <div
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Steps current={currentStep} size="small" style={{ flex: 1, marginRight: 16 }}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <div>
                {currentStep > 0 && currentStep < 3 && (
                  <Button onClick={handlePrevious} style={{ marginRight: 8 }}>
                    Back
                  </Button>
                )}
                {currentStep === 0 && (
                  <Button type="primary" onClick={handleNext}>
                    Next
                  </Button>
                )}
                {currentStep === 2 && (
                  <Button type="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </Affix>
        </Form>
      </Spin>
    </div>
  );
};

export default Quote;

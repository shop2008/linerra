import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Steps, Affix } from 'antd';
import { useModel } from '@umijs/max';
import { postQuote } from '@/services/service/verkApi';
import ShipmentOverview from './ShipmentOverview';
import QuoteInfo from './QuoteInfo';
import Loading from '@/components/Loading';
import ShipmentDetails from './ShipmentDetails';

const { Step } = Steps;

const Quote: React.FC = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>({});
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
  const { regions, provincesByRegion, modelLoading, fetchProvincesByRegion, fetchRegions } =
    useModel('carrierModel');
  const [currentStep, setCurrentStep] = useState(0);
  const [quoteResponse, setQuoteResponse] = useState<Array<VerkType.QuoteResponse | null>>([]);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<VerkType.QuoteResponse | null>(null);
  const [shipmentData, setShipmentData] = useState<any>({});

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    // Handle form submission
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

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleReset = () => {
    form.resetFields();
    setCurrentStep(0);
  };

  const handleNext = async () => {
    try {
      setQuoteLoading(true);
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
            postalCode: formValues.senderProvinceObject,
            province: formValues.sender,
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
      }

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Form validation failed or API call error:', error);
    } finally {
      setQuoteLoading(false);
    }
  };

  const handlePrevious = useCallback(() => {
    setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const handleSelectQuote = (quote: VerkType.QuoteResponse, formData: any) => {
    setSelectedQuote(quote);
    setShipmentData(formData);
    setCurrentStep(currentStep + 1);
  };

  const steps = [
    { title: 'Quote', content: '' },
    { title: 'Select Service', content: '' },
    { title: 'Fill Infos', content: '' },
    { title: 'Complete', content: '' },
  ];

  if (modelLoading.regions) {
    return <Loading />;
  }

  return (
    <div>
      {quoteLoading && <Loading />}
      <h1>Shipping Quote</h1>
      {currentStep === 0 ? (
        <QuoteInfo
          form={form}
          onFinish={onFinish}
          handleRegionChange={handleRegionChange}
          handleRegionSearch={handleRegionSearch}
          selectedRegions={selectedRegions}
          regions={regions}
          provincesByRegion={provincesByRegion}
        />
      ) : currentStep === 1 ? (
        <>
          <ShipmentOverview
            quoteResponse={quoteResponse}
            formData={formData}
            onSelectQuote={handleSelectQuote}
          />
          <Button onClick={handlePrevious} style={{ marginTop: 16 }}>
            Back
          </Button>
        </>
      ) : currentStep === 2 ? (
        <>
          <ShipmentDetails selectedQuote={selectedQuote} shipmentData={shipmentData} />
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

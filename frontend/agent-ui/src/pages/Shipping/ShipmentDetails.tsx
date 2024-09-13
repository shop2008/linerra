import React, { useEffect, useLayoutEffect } from 'react';
import { Form, FormInstance } from 'antd'; // Assuming you're using Ant Design
import ShippingDetailsForm from './ShippingDetailsForm';
import AdditionalOptionsForm from './AdditionalOptionsForm';
import PackageInformationForm from './PackageInformationForm';

interface ShipmentDetailsProps {
  form: FormInstance;
  selectedQuote: VerkType.QuoteResponse | null;
  formData: any;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ form, selectedQuote, formData }) => {
  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    console.log('Form values changed:', changedValues, allValues);
    // You can add additional logic here if needed
  };

  console.log('form', form.getFieldsValue());
  useEffect(() => {
    form.setFieldsValue(formData);
  }, [form, formData]);

  return (
    <div>
      <h2>Shipment Information</h2>
      <ShippingDetailsForm
        form={form}
        onValuesChange={handleFormValuesChange}
        formData={formData}
      />
      <PackageInformationForm form={form} formData={formData} />

      <AdditionalOptionsForm form={form} formData={formData} />
    </div>
  );
};

export default ShipmentDetails;

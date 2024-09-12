import React from 'react';
import { Form } from 'antd'; // Assuming you're using Ant Design
import ShipmentForm from './ShipmentForm';

interface ShipmentDetailsProps {
  selectedQuote: VerkType.QuoteResponse | null;
  quoteRequest: VerkType.QuoteRequest | null;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ selectedQuote, shipmentData }) => {
  const [form] = Form.useForm();

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    console.log('Form values changed:', changedValues, allValues);
    // You can add additional logic here if needed
  };

  return (
    <div>
      <h2>Shipment Information</h2>
      <ShipmentForm
        form={form}
        onValuesChange={handleFormValuesChange}
        initialValues={{
          ...shipmentData,
          selectedQuote: selectedQuote,
        }}
      />
    </div>
  );
};

export default ShipmentDetails;

import React from 'react';
import { Form, Alert } from 'antd';
import PackageInformationForm from './PackageInformationForm';
import AdditionalOptionsForm from './AdditionalOptionsForm';
import ShippingDetailsForm from './ShippingDetailsForm';

interface QuoteInfoProps {
  form: any;
  onFinish: (values: any) => void;
}

const QuoteInfo: React.FC<QuoteInfoProps> = ({ form, onFinish }) => {
  return (
    <Form
      form={form}
      layout="horizontal"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="right"
    >
      <ShippingDetailsForm form={form} />

      <PackageInformationForm form={form} />

      <AdditionalOptionsForm form={form} />

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

export default QuoteInfo;

import { TruckOutlined } from '@ant-design/icons';
import {
  Affix,
  Button,
  Card,
  Col,
  Form,
  Row,
  Alert,
  Space,
  Typography,
  Modal,
  List,
  Tabs,
  Pagination,
  message,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { useModel, useLocation } from '@umijs/max';
import Loading from '@/components/Loading';
import ShippingDetailsForm from './ShippingDetailsForm';
import PackageInformationForm from './PackageInformationForm';
import AdditionalOptionsForm from './AdditionalOptionsForm';
import { postShipment } from '@/services/service/verkApi';
import OrderSuccess from './OrderSuccess';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ShippingServiceFormProps {
  selectedService: VerkType.Service;
  selectedCarrier: VerkType.Carrier;
  onReselect: () => void;
  // Removed formData prop
}

const ShippingServiceForm: React.FC<ShippingServiceFormProps> = ({
  selectedService,
  selectedCarrier,
  onReselect,
  // Removed formData and onFormDataChange props
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Remove handleFormValuesChange function

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      const formValues = form.getFieldsValue();

      const shipmentData: VerkType.QuoteRequest = {
        serviceId: selectedService.id,
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
        setOrderNumber(response.data?.number);
      } else {
        message.error('Failed to create shipment. Please try again.');
      }
    } catch (error) {
      console.error('Form validation failed or API call error:', error);
      message.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderNumber) {
    return <OrderSuccess orderNumber={orderNumber} />;
  }

  return (
    <>
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
                  {selectedCarrier.name}
                </Title>
                <Text type="secondary">{selectedService.name}</Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Button onClick={onReselect}>Re-Select</Button>
          </Col>
        </Row>
      </Card>
      <ShippingDetailsForm form={form} createOrder={true} />
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
                {selectedCarrier.name}
              </Title>
              <Text type="secondary">{selectedService.name}</Text>
            </Space>
          </Space>
          <Space>
            <Button type="default" onClick={() => form.resetFields()}>
              Reset
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Submit
            </Button>
          </Space>
        </div>
      </Affix>
    </>
  );
};

const CreateOrder: React.FC = () => {
  const { carriers, modelLoading, fetchCarriers } = useModel('carrierModel');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<VerkType.Service | null>(null);
  // Remove formData state
  const [selectedCarrier, setSelectedCarrier] = useState<VerkType.Carrier | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const location = useLocation();

  useEffect(() => {
    const { state } = location;
    if (state && state.service && state.carrier) {
      setSelectedService(state.service);
      setSelectedCarrier(state.carrier);
    } else {
      setIsModalVisible(true);
    }
  }, [location]);

  useEffect(() => {
    fetchCarriers();
  }, []);

  const handleCarrierChange = (carrierId: string) => {
    const carrier = carriers.find((c) => c.id === carrierId);
    setSelectedCarrier(carrier || null);
    setCurrentPage(1);
  };

  const handleServiceSelection = (carrier: VerkType.Carrier, service: VerkType.Service) => {
    setSelectedService(service);
    setSelectedCarrier(carrier);
    setIsModalVisible(false);
  };

  const handleReselect = () => {
    setIsModalVisible(true);
  };

  const renderCarrierTabs = () => (
    <Tabs onChange={handleCarrierChange}>
      {carriers.map((carrier) => (
        <TabPane tab={carrier.name} key={carrier.id}>
          {renderServiceList(carrier)}
        </TabPane>
      ))}
    </Tabs>
  );

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const renderServiceList = (carrier: VerkType.Carrier) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedServices = carrier.services.slice(startIndex, endIndex);

    return (
      <>
        <List
          itemLayout="horizontal"
          dataSource={paginatedServices}
          renderItem={(service) => (
            <List.Item
              onClick={() => handleServiceSelection(carrier, service)}
              onMouseEnter={() => setHoveredItem(service.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                cursor: 'pointer',
                padding: '12px 16px',
                backgroundColor: hoveredItem === service.id ? '#f0f5ff' : 'transparent',
                transition: 'background-color 0.3s',
              }}
            >
              <List.Item.Meta
                title={<span style={{ fontSize: '16px', fontWeight: 500 }}>{service.name}</span>}
              />
            </List.Item>
          )}
        />
        <Pagination
          current={currentPage}
          total={carrier.services.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginTop: '16px', textAlign: 'right' }}
        />
      </>
    );
  };

  return (
    <div>
      {modelLoading.carriers ? (
        <Loading fullscreen={false} />
      ) : (
        <>
          <Modal
            title="Select Shipping Service"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={800}
          >
            {renderCarrierTabs()}
          </Modal>
          {selectedService && selectedCarrier && (
            <ShippingServiceForm
              selectedService={selectedService}
              selectedCarrier={selectedCarrier}
              onReselect={handleReselect}
              // Remove formData and onFormDataChange props
            />
          )}
        </>
      )}
    </div>
  );
};

export default CreateOrder;

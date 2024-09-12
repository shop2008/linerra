import { TruckOutlined } from '@ant-design/icons';
import {
  Affix,
  Button,
  Card,
  Col,
  Form,
  Row,
  Select,
  Space,
  Typography,
  Modal,
  List,
  Tabs,
  Pagination,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { useModel, useLocation } from '@umijs/max';
import ShipmentForm from './ShipmentForm';
import Loading from '@/components/Loading';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ShippingServiceFormProps {
  selectedService: VerkType.Service;
  selectedCarrier: VerkType.Carrier;
  onReselect: () => void;
  formData: any;
  onFormDataChange: (formData: any) => void;
}

const ShippingServiceForm: React.FC<ShippingServiceFormProps> = ({
  selectedService,
  selectedCarrier,
  onReselect,
  formData,
  onFormDataChange,
}) => {
  const [form] = Form.useForm();

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    onFormDataChange(allValues);
  };

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
      <ShipmentForm form={form} onValuesChange={handleFormValuesChange} />
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
            <Button type="primary" onClick={() => form.submit()}>
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
  const [formData, setFormData] = useState({});
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

  const handleFormDataChange = (newFormData: any) => {
    setFormData(newFormData);
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
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CreateOrder;

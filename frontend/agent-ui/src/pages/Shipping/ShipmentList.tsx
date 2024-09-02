import React, { useState } from 'react';
import { Tabs, Input, DatePicker, Table, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const ShipmentList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

  // Mock data - replace with actual data fetching logic
  const shipments = [
    { id: 1, status: 'pending', trackingNumber: 'TN001', date: '2023-04-10' },
    { id: 2, status: 'in_transit', trackingNumber: 'TN002', date: '2023-04-11' },
    { id: 3, status: 'delivered', trackingNumber: 'TN003', date: '2023-04-12' },
  ];

  const columns = [
    { title: 'Tracking Number', dataIndex: 'trackingNumber', key: 'trackingNumber' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  const filteredShipments = shipments.filter(
    (shipment) =>
      (activeTab === 'all' || shipment.status === activeTab) &&
      (searchText === '' ||
        shipment.trackingNumber.toLowerCase().includes(searchText.toLowerCase())) &&
      (!dateRange ||
        (shipment.date >= dateRange[0].format('YYYY-MM-DD') &&
          shipment.date <= dateRange[1].format('YYYY-MM-DD'))),
  );

  const handleSearch = () => {
    // Implement your search logic here
    console.log('Searching with:', { searchText, dateRange });
  };

  const renderSearchControls = () => (
    <Space style={{ marginBottom: 16 }}>
      <Input
        placeholder="Search by tracking number"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 200 }}
      />
      <RangePicker onChange={(dates) => setDateRange(dates)} />
      <Button type="primary" onClick={handleSearch}>
        Search
      </Button>
    </Space>
  );

  return (
    <div>
      <h1>Shipment List</h1>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="All" key="all">
          {renderSearchControls()}
          <Table
            columns={columns}
            dataSource={filteredShipments.filter((s) => s.status === 'all' || activeTab === 'all')}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Pending" key="pending">
          {renderSearchControls()}
          <Table
            columns={columns}
            dataSource={filteredShipments.filter((s) => s.status === 'pending')}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="In Transit" key="in_transit">
          {renderSearchControls()}
          <Table
            columns={columns}
            dataSource={filteredShipments.filter((s) => s.status === 'in_transit')}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Delivered" key="delivered">
          {renderSearchControls()}
          <Table
            columns={columns}
            dataSource={filteredShipments.filter((s) => s.status === 'delivered')}
            rowKey="id"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ShipmentList;

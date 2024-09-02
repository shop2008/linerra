import React, { useState } from 'react';
import { Tabs, Input, DatePicker, Table, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const PrintList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // Mock data - replace with actual data fetching logic
  const printItems = [
    { id: 1, status: 'ready_to_submit', orderNumber: 'ON001', date: '2023-04-10' },
    { id: 2, status: 'ready_to_checkout', orderNumber: 'ON002', date: '2023-04-11' },
    { id: 3, status: 'print_label', orderNumber: 'ON003', date: '2023-04-12' },
    { id: 4, status: 'print_receipt', orderNumber: 'ON004', date: '2023-04-13' },
  ];

  const columns = [
    { title: 'Order Number', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  const filteredPrintItems = printItems.filter(
    (item) =>
      (activeTab === 'all' || item.status === activeTab) &&
      (searchText === '' || item.orderNumber.toLowerCase().includes(searchText.toLowerCase())) &&
      (!dateRange || (item.date >= dateRange[0] && item.date <= dateRange[1])),
  );

  const handleSearch = () => {
    // Implement your search logic here
    console.log('Searching with:', { searchText, dateRange });
  };

  const renderSearchControls = () => (
    <Space style={{ marginBottom: 16 }}>
      <Input
        placeholder="Search by order number"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <RangePicker
        onChange={(dates) =>
          setDateRange(
            dates ? [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')] : null,
          )
        }
      />
      <Button type="primary" onClick={handleSearch}>
        Search
      </Button>
    </Space>
  );

  return (
    <div>
      <h1>Print List</h1>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="All" key="all">
          {renderSearchControls()}
          <Table columns={columns} dataSource={filteredPrintItems} rowKey="id" />
        </TabPane>
        <TabPane tab="Ready to Submit" key="ready_to_submit">
          {renderSearchControls()}
          <Table
            columns={columns}
            dataSource={filteredPrintItems.filter((item) => item.status === 'ready_to_submit')}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Ready to Checkout" key="ready_to_checkout">
          {renderSearchControls()}
          <Table
            columns={columns}
            dataSource={filteredPrintItems.filter((item) => item.status === 'ready_to_checkout')}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Print Label" key="print_label">
          {renderSearchControls()}
          <Table
            columns={columns}
            dataSource={filteredPrintItems.filter((item) => item.status === 'print_label')}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Print Receipt" key="print_receipt">
          {renderSearchControls()}
          <Table
            columns={columns}
            dataSource={filteredPrintItems.filter((item) => item.status === 'print_receipt')}
            rowKey="id"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PrintList;

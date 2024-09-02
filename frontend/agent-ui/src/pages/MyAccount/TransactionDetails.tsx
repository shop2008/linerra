import React, { useState } from 'react';
import { Tabs, Table, Button, Input, DatePicker, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface TransactionData {
  key: string;
  date: string;
  description: string;
  amount: string;
  balance: string;
}

interface PayableData {
  key: string;
  dueDate: string;
  description: string;
  amount: string;
  status: string;
}

interface TransactionDetailsProps {
  initialActiveTab?: string;
  title?: string;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  initialActiveTab = '1',
  title = 'Transaction Details',
}) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const transactionColumns: ColumnsType<TransactionData> = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' },
  ];

  const payableColumns: ColumnsType<PayableData> = [
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  // Mock data - replace with actual data from your API or state management
  const transactionData: TransactionData[] = [
    {
      key: '1',
      date: '2023-04-01',
      description: 'Deposit',
      amount: '+$1000.00',
      balance: '$5000.00',
    },
    {
      key: '2',
      date: '2023-04-02',
      description: 'Withdrawal',
      amount: '-$200.00',
      balance: '$4800.00',
    },
  ];

  const payableData: PayableData[] = [
    {
      key: '1',
      dueDate: '2023-04-15',
      description: 'Invoice #1234',
      amount: '$500.00',
      status: 'Pending',
    },
    {
      key: '2',
      dueDate: '2023-04-20',
      description: 'Invoice #5678',
      amount: '$750.00',
      status: 'Paid',
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleSearch = () => {
    // Implement your search logic here
    console.log('Searching with:', { searchText, dateRange });
  };

  const renderSearchControls = () => (
    <Space style={{ marginBottom: 16 }}>
      <Input
        placeholder="Search description"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 200 }}
      />
      <RangePicker onChange={(dates, dateStrings) => setDateRange(dateStrings)} />
      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
        Search
      </Button>
    </Space>
  );

  return (
    <div>
      <h1>{title}</h1>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Transaction Details" key="1">
          {renderSearchControls()}
          <Table columns={transactionColumns} dataSource={transactionData} />
          <div style={{ marginTop: '20px' }}>
            <Button type="primary" style={{ marginRight: '10px' }}>
              Export Transactions
            </Button>
          </div>
        </TabPane>
        <TabPane tab="Payable" key="2">
          {renderSearchControls()}
          <Table columns={payableColumns} dataSource={payableData} />
          <div style={{ marginTop: '20px' }}>
            <Button type="primary" style={{ marginRight: '10px' }}>
              Pay Selected
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TransactionDetails;

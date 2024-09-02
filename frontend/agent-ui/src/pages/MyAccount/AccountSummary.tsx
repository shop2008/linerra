import React from 'react';
import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface AccountData {
  key: string;
  balance: string;
  frozenAmount: string;
  consumed: string;
  payable: string;
  overdraftLimit: string;
  availableCreditLimit: string;
}

const AccountSummary: React.FC = () => {
  // Mock data - replace with actual data from your API or state management
  const accountData: AccountData[] = [
    {
      key: '1',
      balance: '$5,000.00',
      frozenAmount: '$500.00',
      consumed: '$1,500.00',
      payable: '$2,000.00',
      overdraftLimit: '$1,000.00',
      availableCreditLimit: '$3,500.00',
    },
  ];

  const columns: ColumnsType<AccountData> = [
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: 'Frozen Amount',
      dataIndex: 'frozenAmount',
      key: 'frozenAmount',
    },
    {
      title: 'Consumed',
      dataIndex: 'consumed',
      key: 'consumed',
    },
    {
      title: 'Payable',
      dataIndex: 'payable',
      key: 'payable',
    },
    {
      title: 'Overdraft Limit',
      dataIndex: 'overdraftLimit',
      key: 'overdraftLimit',
    },
    {
      title: 'Available Credit Limit',
      dataIndex: 'availableCreditLimit',
      key: 'availableCreditLimit',
    },
  ];

  return (
    <div>
      <h1>Account Summary</h1>
      <Table columns={columns} dataSource={accountData} pagination={false} />
      <div style={{ marginTop: '20px' }}>
        <Button type="primary" style={{ marginRight: '10px' }}>
          Deposit
        </Button>
        <Button>Withdraw</Button>
      </div>
    </div>
  );
};

export default AccountSummary;




import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import NormalMatchFeedBack from './NormalMatchFeedBack';
import TrialMatchFeedBack from './TrialMatchFeedBack';

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Normal Match Feedback',
    children: <NormalMatchFeedBack />
  },
  {
    key: '2',
    label: 'Trial Match Feedback',
    children: <TrialMatchFeedBack />,
  },
  
];

const FeedBack: React.FC = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;

export default FeedBack;
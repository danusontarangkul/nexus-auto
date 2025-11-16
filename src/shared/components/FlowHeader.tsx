import React from 'react';
import { BackHeader } from './BackHeader';
import { Stepper } from './Stepper';
import { View } from 'react-native';
import tw from '../../styles/tw';

type Props = { title: string; total: number; current: number };

export function FlowHeader({ title, total, current }: Props) {
  return (
    <View>
      <BackHeader title={title} />
      <View style={tw`px-4`}>
        <Stepper total={total} current={current} />
      </View>
    </View>
  );
}

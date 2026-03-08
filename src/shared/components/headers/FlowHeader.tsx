import { BackHeader } from '@/navigation/components/BackHeader';
import { View } from 'react-native';
import tw from '@/styles/tw';
import { Stepper } from '../misc/Stepper';

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

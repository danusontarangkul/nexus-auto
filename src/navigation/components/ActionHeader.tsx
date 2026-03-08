import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '@/navigation/components/BackHeader';
import tw from '@/styles/tw';

interface ActionHeaderProps {
  title: string;
  isEditing: boolean;
  hasData: boolean;
  onActionPress: () => void;
  skipTopInset?: boolean;
}

export function ActionHeader({
  title,
  isEditing,
  hasData,
  onActionPress,
  skipTopInset = true,
}: ActionHeaderProps) {
  const getIconName = () => {
    if (isEditing) {
      return 'close-outline';
    }
    if (hasData) {
      return 'create-outline';
    }
    return 'add-outline';
  };

  return (
    <BackHeader
      title={title}
      skipTopInset={skipTopInset}
      rightElement={
        <TouchableOpacity onPress={onActionPress}>
          <Ionicons
            name={getIconName()}
            size={24}
            color={tw.color('ink-900')}
          />
        </TouchableOpacity>
      }
    />
  );
}

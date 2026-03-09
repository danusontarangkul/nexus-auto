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
  showEllipsis?: boolean;
}

export function ActionHeader({
  title,
  isEditing,
  hasData,
  onActionPress,
  skipTopInset = true,
  showEllipsis = false,
}: ActionHeaderProps) {
  const getIconName = () => {
    if (isEditing) {
      return 'close-outline';
    }

    if (showEllipsis) {
      return 'ellipsis-horizontal';
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
        <TouchableOpacity
          onPress={onActionPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={tw`p-1`}
        >
          <Ionicons
            name={getIconName()}
            size={showEllipsis && !isEditing ? 28 : 24} // Make ellipsis slightly larger for better tap target
            color={tw.color('ink-900')}
          />
        </TouchableOpacity>
      }
    />
  );
}

import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '@/navigation/components/BackHeader';
import tw from '@/styles/tw';

interface EditHeaderProps {
  title: string;
  isEditing: boolean;
  hasData: boolean;
  onPress: () => void;
}

export function EditHeader({
  title,
  isEditing,
  hasData,
  onPress,
}: EditHeaderProps) {
  const iconName = isEditing
    ? 'close-outline'
    : hasData
      ? 'create-outline'
      : 'add-outline';

  return (
    <BackHeader
      title={title}
      skipTopInset={true}
      rightElement={
        <TouchableOpacity onPress={onPress} style={tw`p-1`}>
          <Ionicons name={iconName} size={24} color={tw.color('ink-900')} />
        </TouchableOpacity>
      }
    />
  );
}

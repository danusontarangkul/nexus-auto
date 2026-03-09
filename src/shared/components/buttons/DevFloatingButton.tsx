import { Pressable, Text } from 'react-native';
import { navRef } from '@/navigation/NavRef';
import { ROOT } from '@/navigation/routes';

export function DevFloatingButton() {
  if (!__DEV__) {
    return null;
  }

  const handlePress = () => {
    if (navRef.isReady()) {
      navRef.navigate(ROOT.Dev);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        {
          position: 'absolute',
          top: 60,
          right: 10,
          paddingVertical: 6,
          paddingHorizontal: 10,
          backgroundColor: 'rgba(60,60,60,0.7)',
          borderRadius: 8,
          zIndex: 9999,
        },
      ]}
    >
      <Text style={{ color: '#fff', fontWeight: '600' }}>DEV</Text>
    </Pressable>
  );
}

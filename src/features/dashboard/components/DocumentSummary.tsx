import { DocumentCard } from '@/shared/components/cards/DocumentCard';
import tw from '@/styles/tw';
import { Doc } from '@convex/_generated/dataModel';
import { View } from 'react-native';

interface DocumentSummaryProps {
  registration: Doc<'registrations'> | null;
  insurance: Doc<'insurance'> | null;
  onPressRegistration: () => void;
  onPressInsurance: () => void;
}

export function DocumentSummary({
  registration,
  insurance,
  onPressRegistration,
  onPressInsurance,
}: DocumentSummaryProps) {
  return (
    <View style={tw`flex-row gap-3`}>
      <DocumentCard
        label="Registration"
        expiryDate={registration?.expiresAt}
        onPress={onPressRegistration}
      />
      <DocumentCard
        label="Insurance"
        expiryDate={insurance?.expiresAt}
        onPress={onPressInsurance}
      />
    </View>
  );
}

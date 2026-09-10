import { useRouter } from 'expo-router';
import { EmptyState, Screen } from '@/components/ui';

export default function NotFound() {
  const router = useRouter();
  return (
    <Screen>
      <EmptyState icon="🧭" title="That screen doesn't exist" body="The link pointed somewhere this app doesn't have." action={{ title: 'Go home', onPress: () => router.replace('/') }} />
    </Screen>
  );
}

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Button, Card, EmptyState, ErrorBanner, ListSkeleton, Row, Screen, Sheet, T } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { useColors } from '@/lib/theme';

/** A living style guide: one of every primitive, in both themes. Day 1's tour walks through this screen. */
export default function Gallery() {
  const router = useRouter();
  const colors = useColors();
  const [sheet, setSheet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');

  return (
    <Screen mode="form" className="pt-4 gap-5">
      <Row title="Back" subtitle="Rows are tappable list items" onPress={() => router.back()} left={<T variant="heading">←</T>} />

      <Card index={0}>
        <T variant="caption" tone="muted">Text</T>
        <T variant="display">Display</T>
        <T variant="title">Title</T>
        <T variant="heading">Heading</T>
        <T variant="body">Body text at a comfortable reading size.</T>
        <T variant="small" tone="ink2">Small, secondary.</T>
        <T variant="caption" tone="muted">Caption label</T>
      </Card>

      <Card index={1} className="gap-3">
        <T variant="caption" tone="muted">Buttons</T>
        <Button title="Primary" onPress={() => haptics.confirm()} />
        <Button title="Secondary" variant="secondary" onPress={() => haptics.select()} />
        <Button title="Ghost" variant="ghost" onPress={() => {}} />
        <Button title="Danger" variant="danger" onPress={() => haptics.error()} />
        <Button title="Loading" loading onPress={() => {}} />
      </Card>

      <Card index={2}>
        <T variant="caption" tone="muted" className="mb-2">Keyboard-aware input</T>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type here; the keyboard never covers this field"
          placeholderTextColor={colors.muted}
          className="min-h-[48px] rounded-md px-4 border border-border dark:border-d-border text-ink dark:text-d-ink bg-background dark:bg-d-background"
          accessibilityLabel="Example text field"
        />
      </Card>

      <Card index={3}>
        <T variant="caption" tone="muted" className="mb-2">Loading → skeletons</T>
        {loading ? <ListSkeleton rows={3} /> : <T variant="body">Loaded.</T>}
        <View className="mt-3">
          <Button title={loading ? 'Finish loading' : 'Load again'} variant="ghost" onPress={() => setLoading((v) => !v)} />
        </View>
      </Card>

      <Card index={4}>
        <T variant="caption" tone="muted" className="mb-2">Error, recoverable</T>
        <ErrorBanner onRetry={() => haptics.impact()} />
      </Card>

      <Card index={5} className="min-h-[260px]">
        <T variant="caption" tone="muted">Empty state</T>
        <EmptyState icon="🌱" title="Nothing here yet" body="Every empty screen says what this is and offers the next step." action={{ title: 'Open a sheet', onPress: () => setSheet(true) }} />
      </Card>

      <Sheet visible={sheet} onClose={() => setSheet(false)} title="A bottom sheet">
        <T variant="body" tone="ink2" className="mb-4">Slides up with a spring, respects reduce-motion, closes on tap outside.</T>
        <Button title="Done" onPress={() => { haptics.success(); setSheet(false); }} />
      </Sheet>
    </Screen>
  );
}

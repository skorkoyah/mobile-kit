import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, EmptyState, ErrorBanner, Input, ListSkeleton, Row, Screen, Sheet, T } from '@/components/ui';

/** A living style guide: one of every primitive, in both themes. Day 1's tour walks through this screen. */
export default function Gallery() {
  const router = useRouter();
  const [sheet, setSheet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  return (
    <Screen mode="form" className="pt-md gap-lg">
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

      <Card index={1} className="gap-md">
        <T variant="caption" tone="muted">Buttons — each owns its buzz</T>
        <Button title="Primary" haptic="confirm" onPress={() => {}} />
        <Button title="Secondary" variant="secondary" haptic="select" onPress={() => {}} />
        <Button title="Ghost" variant="ghost" onPress={() => {}} />
        <Button title="Danger" variant="danger" haptic="error" onPress={() => {}} />
        <Button title="Loading" loading onPress={() => {}} />
      </Card>

      <Card index={2} className="gap-md">
        <T variant="caption" tone="muted">Inputs (keyboard never covers them)</T>
        <Input label="Your name" value={name} onChangeText={setName} placeholder="Ada" hint="Shown on your profile." autoCapitalize="words" />
        <Input label="A note" value={note} onChangeText={setNote} placeholder="Type to clear the error" error={note ? undefined : 'A note is required.'} />
      </Card>

      <Card index={3}>
        <T variant="caption" tone="muted" className="mb-sm">Loading → skeletons</T>
        {loading ? <ListSkeleton rows={3} /> : <T variant="body">Loaded.</T>}
        <View className="mt-md">
          <Button title={loading ? 'Finish loading' : 'Load again'} variant="ghost" onPress={() => setLoading((v) => !v)} />
        </View>
      </Card>

      <Card index={4}>
        <T variant="caption" tone="muted" className="mb-sm">Error, recoverable</T>
        <ErrorBanner onRetry={() => {}} />
      </Card>

      <Card index={5} className="min-h-[260px]">
        <T variant="caption" tone="muted">Empty state</T>
        <EmptyState icon="🌱" title="Nothing here yet" body="Every empty screen says what this is and offers the next step." action={{ title: 'Open a sheet', onPress: () => setSheet(true) }} />
      </Card>

      <Sheet visible={sheet} onClose={() => setSheet(false)} title="A bottom sheet">
        <T variant="body" tone="ink2" className="mb-md">Slides up, closes on tap outside or the back gesture, and sits above the keyboard.</T>
        <Button title="Done" haptic="success" onPress={() => setSheet(false)} />
      </Sheet>
    </Screen>
  );
}

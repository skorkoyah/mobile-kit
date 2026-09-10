import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Card, Screen, T } from '@/components/ui';
import { haptics } from '@/lib/haptics';

/**
 * The welcome screen. Day 0's hot-reload test is: change the sentence below, save, watch the phone.
 * Every daily app replaces this file with its own first screen.
 */
export default function Welcome() {
  const router = useRouter();
  const [taps, setTaps] = useState(0);
  return (
    <Screen mode="scroll" className="pt-6 gap-4">
      <T variant="caption" tone="muted">Mobile Kit · v0</T>
      <T variant="display">It works on your phone.</T>
      <T variant="body" tone="ink2">
        Change this sentence on your computer, save the file, and watch it change here. That is hot reload.
      </T>

      <Card index={1}>
        <T variant="heading">Feel the polish layer</T>
        <T variant="small" tone="ink2" className="mb-3">
          Spring press, a light tap on every press, a success buzz every fifth tap.
        </T>
        <Button
          title={taps === 0 ? 'Tap me' : `Tapped ${taps} time${taps === 1 ? '' : 's'}`}
          onPress={() => {
            const next = taps + 1;
            setTaps(next);
            if (next % 5 === 0) haptics.success();
          }}
        />
      </Card>

      <Card index={2}>
        <T variant="heading">Everything the Kit ships</T>
        <T variant="small" tone="ink2" className="mb-3">
          Buttons, inputs, rows, cards, skeletons, empty states, error banners, sheets, and themed text.
        </T>
        <Button title="Open the gallery" variant="secondary" onPress={() => router.push('/gallery')} />
      </Card>
    </Screen>
  );
}

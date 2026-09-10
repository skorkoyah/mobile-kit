import { Text as RNText, type TextProps } from 'react-native';
import { type } from '@/constants/tokens';

type Variant = keyof typeof type;

const weights: Record<Variant, string> = {
  display: 'font-extrabold tracking-tight',
  title: 'font-bold',
  heading: 'font-semibold',
  body: '',
  small: '',
  caption: 'uppercase tracking-wider font-semibold',
};

const tones = {
  ink: 'text-ink',
  ink2: 'text-ink2',
  muted: 'text-muted',
  accent: 'text-accent-ink',
  danger: 'text-danger',
  onAccent: 'text-on-accent',
};

export type TProps = TextProps & { variant?: Variant; tone?: keyof typeof tones; className?: string };

/**
 * Themed text. Sizes come from tokens; colors are CSS variables, so they are right in both themes.
 * Scales with the user's font-size setting (never disable allowFontScaling); display/title/heading
 * announce as headings to screen readers.
 */
export function T({ variant = 'body', tone = 'ink', className = '', style, ...rest }: TProps) {
  const isHeading = variant === 'display' || variant === 'title' || variant === 'heading';
  return (
    <RNText
      accessibilityRole={isHeading ? 'header' : undefined}
      maxFontSizeMultiplier={1.6}
      className={`${weights[variant]} ${tones[tone]} ${className}`}
      style={[{ fontSize: type[variant].size, lineHeight: type[variant].line }, style]}
      {...rest}
    />
  );
}

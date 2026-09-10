import { Text as RNText, type TextProps } from 'react-native';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'small' | 'caption';

const variants: Record<Variant, string> = {
  display: 'text-[34px] leading-[40px] font-extrabold tracking-tight',
  title: 'text-[26px] leading-[32px] font-bold',
  heading: 'text-[20px] leading-[26px] font-semibold',
  body: 'text-[17px] leading-[24px]',
  small: 'text-[15px] leading-[21px]',
  caption: 'text-[13px] leading-[18px] uppercase tracking-wider font-semibold',
};

const tones = {
  ink: 'text-ink dark:text-d-ink',
  ink2: 'text-ink2 dark:text-d-ink2',
  muted: 'text-muted dark:text-d-muted',
  accent: 'text-accent-ink dark:text-d-accent-ink',
  danger: 'text-danger dark:text-d-danger',
  onAccent: 'text-white',
};

export type TProps = TextProps & { variant?: Variant; tone?: keyof typeof tones; className?: string };

/** Themed text. Respects the user's Dynamic Type / font size setting (never disable allowFontScaling). */
export function T({ variant = 'body', tone = 'ink', className = '', ...rest }: TProps) {
  return <RNText className={`${variants[variant]} ${tones[tone]} ${className}`} maxFontSizeMultiplier={1.6} {...rest} />;
}

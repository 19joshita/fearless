import {translate} from '@localization';

// export const PROMPTS = (): string[] => [
//   translate('PROMPT_ANXIETY_ATTACK'),
//   translate('PROMPT_ANXIETY_WORSE'),
//   translate('PROMPT_REPROGRAM_MIND'),
// ];

export const PROMPTS = (): {
  title: string;
  subtitle: string;
  role: string;
}[] => [
  {
    title: translate('PROMPT_ANXIETY_ATTACK'),
    subtitle: '',
    role: '',
  },
  {
    title: translate('PROMPT_ANXIETY_WORSE'),
    subtitle: '',
    role: '',
  },
  {
    title: translate('PROMPT_REPROGRAM_MIND'),
    subtitle: '',
    role: '',
  },
];

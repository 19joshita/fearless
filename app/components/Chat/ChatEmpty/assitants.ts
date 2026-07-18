import {translate} from '@localization';

export interface PromptType {
  title: string;
  subtitle: string;
  role: string;
}

export const ASSIATANTS = (): PromptType[] => [
  {
    title: translate('BELIEF_CONFIGURATOR'),
    subtitle: translate('BELIEF_CONFIGURATOR_DESC'),
    role: 'belief_configurator',
  },
  {
    title: translate('PERCEPTION_TYPE_TEST'),
    subtitle: translate('PERCEPTION_TYPE_TEST_DESC'),
    role: 'perception_type_test',
  },
];

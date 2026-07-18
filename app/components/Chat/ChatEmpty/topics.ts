import {translate} from '@localization';

// export const TOPICS = (): string[] => [

//   translate('ANCHOR_OF_CALMNESS'),
//   translate('BRIDGE_OF_HEARTS'),
//   translate('FLOW_OF_TRUST'),
//   translate('SELF_ALIGNMENT'),
//   translate('WINGS_OF_VOCATION'),
//   // translate('SELF_CONFIDENCE'),
// ];

export interface PromptType {
  title: string;
  subtitle: string;
  role: string;
}

export const TOPICS = (): PromptType[] => [
  {
    title: translate('ANCHOR_OF_CALMNESS'),
    subtitle: translate('EMERGENCY_PROTOCOL_FOR_ANXIETY'),
    role: 'anchor_of_calmness',
  },
  {
    title: translate('BRIDGE_OF_HEARTS'),
    subtitle: translate('CREATING_MEANINGFUL_PARTNERSHIPS'),
    role: 'bridge_of_hearts',
  },
  {
    title: translate('FLOW_OF_TRUST'),
    subtitle: translate('PEACE_OVER_CONTROL_COMPULSION'),
    role: 'flow_of_trust',
  },
  {
    title: translate('SELF_ALIGNMENT'),
    subtitle: translate('DISCOVER_YOUR_TRUE_SELF'),
    role: 'self_alignment',
  },
  // {
  //   title: translate('WINGS_OF_VOCATION'),
  //   subtitle: translate('FINDING_SUCCESS_WITH_PURPOSE'),
  //   role: 'wings_of_vocation',
  // },
  // {
  //   title: translate('TEST_AGENT'),
  //   subtitle: translate('TEST_AGENT_SUBTITLE'),
  //   role: 'test_agent',
  // },
  // {
  //   title: translate('TEST_AGENT_2'),
  //   subtitle: translate('TEST_AGENT_2_SUBTITLE'),
  //   role: 'test_agent_2',
  // },
];

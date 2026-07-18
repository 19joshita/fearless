import {RouteNames} from '@utils';

export type SplashStackParamList = {
  [RouteNames.SPLASH]: undefined;
};
export type AuthRootStackParamList = {
  [RouteNames.LOGIN]: undefined; // No params
  [RouteNames.SPLASH]: undefined; // Has a userId param
  [RouteNames.SIGN_UP]: undefined;
  [RouteNames.FORGOT_PASSWORD]: undefined;
  [RouteNames.RESET_PASSWORD]: {token: string};
  [RouteNames.OTP_VERIFICATION]: {
    token: string;
    type: 'register' | 'forgotPassword';
    email?: string;
  };
  [RouteNames.LANGUAGE_STACK]: undefined;
};

export type OnboardingRootStackParamList = {
  [RouteNames.ONBOARDING]: undefined;
};

export type DashboardRootStackParamList = {
  [RouteNames.WELCOME]: undefined;
  [RouteNames.BOTTOM_TABS]: undefined;
  [RouteNames.PROFILE_VIEW]: undefined;
  [RouteNames.PROFILE_EDIT]: undefined;
  [RouteNames.CHANGE_PASSWORD]: undefined;
  [RouteNames.LANGUAGE]: undefined;
  [RouteNames.MEMBERSHIP]: undefined;
  [RouteNames.SAVED_CHATS]: undefined;
  [RouteNames.SUPPORT_CHAT]: undefined;
  [RouteNames.USER_LIST]: undefined;
  [RouteNames.CHAT_TAB]: {
    savedChatParamsId?: string;
    type: 'agent' | 'advisor';
    selectedTopic?: string;
  };
  [RouteNames.LANGUAGE_STACK]: undefined;
  [RouteNames.INFORMATION]: undefined;
  [RouteNames.APP_INFO]: undefined;
};

export type ChatTabRootStackParamList = {
  [RouteNames.CHAT_TAB]: {
    savedChatParamsId?: string;
    type: 'agent' | 'advisor';
    selectedTopic?: string;
    savedChatName?: string;
    isAssitant?: boolean;
  };
};

export type AgentTabRootStackParamList = {
  [RouteNames.AGENT_TOPICS]: undefined;
  [RouteNames.AGENT_CHAT]: {
    savedChatParamsId?: string;
    selectedTopic: string;
    type: 'agent' | 'advisor';
    savedChatName?: string;
    isAssitant?: boolean;
  };
};

export type ResourcesTabRootStackParamList = {
  [RouteNames.ASSISTANT_CHAT]: {
    isAssitant: boolean;
    savedChatParamsId?: string;
    selectedTopic: string;
    type: 'agent' | 'advisor';
    savedChatName?: string;
  };
  [RouteNames.RESOURCES_LIST]: undefined;
  [RouteNames.RESOURCES_VIEW]: {link: string; type: Resource['type']};
};
// In your types file where SupportChatRootStackParamList is defined
export type SupportChatRootStackParamList = {
  [RouteNames.SUPPORT_CHAT]: {
    mode?: 'user' | 'admin';
    conversationId?: string;
    userName?: string;
  };
  [RouteNames.USER_LIST]: undefined;
};
export type MergedStackParamsList = AuthRootStackParamList &
  OnboardingRootStackParamList &
  DashboardRootStackParamList &
  ChatTabRootStackParamList &
  AgentTabRootStackParamList &
  ResourcesTabRootStackParamList;

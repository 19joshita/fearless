import {
  ChangePassword,
  Chat,
  ForgotPassword,
  Languages,
  Login,
  OTPVerification,
  ProfileEdit,
  ProfileView,
  ResetPassword,
  SignUp,
  Splash,
  Membership,
  Welcome,
  SavedChat,
  AgentTopics,
  ResourcesList,
  ResourceView,
  LanguageSheet,
  Information,
  AppInfo,
  SupportChat,
  UserList
} from '@screens';
import {RouteNames} from '@utils';
import BottomTabBar from '../stacks/BottomTabBar';
import LanguageStack from '../../navigation/stacks/LanguageStack';

export const OnboardingCollection = [
  {
    name: RouteNames.ONBOARDING,
    component: Splash,
  },
];
export const AuthStackCollection = [
  {
    name: RouteNames.SPLASH,
    component: Splash,
  },
  {
    name: RouteNames.LOGIN,
    component: Login,
  },
  {
    name: RouteNames.SIGN_UP,
    component: SignUp,
  },
  {
    name: RouteNames.FORGOT_PASSWORD,
    component: ForgotPassword,
  },
  {
    name: RouteNames.RESET_PASSWORD,
    component: ResetPassword,
  },
  {
    name: RouteNames.OTP_VERIFICATION,
    component: OTPVerification,
  },
  {
    name: RouteNames.LANGUAGE_STACK,
    component: LanguageSheet,
  },
];

export const SplashCollection = [
  {
    name: RouteNames.SPLASH,
    component: Splash,
  },
];

export const DashboardCollection = [
  {
    name: RouteNames.WELCOME,
    component: Welcome,
  },
  {
    name: RouteNames.BOTTOM_TABS,
    component: BottomTabBar,
  },
  {
    name: RouteNames.PROFILE_VIEW,
    component: ProfileView,
  },
  {
    name: RouteNames.PROFILE_EDIT,
    component: ProfileEdit,
  },
  {
    name: RouteNames.CHANGE_PASSWORD,
    component: ChangePassword,
  },
  {
    name: RouteNames.LANGUAGE,
    component: Languages,
  },
  {
    name: RouteNames.MEMBERSHIP,
    component: Membership,
  },
  {
    name: RouteNames.SAVED_CHATS,
    component: SavedChat,
  },
  {
    name: RouteNames.SUPPORT_CHAT,
    component: SupportChat,
  },
  {
    name: RouteNames.USER_LIST,
    component: UserList,
  },
  {
    name: RouteNames.CHAT_TAB,
    component: Chat,
  },
  {
    name: RouteNames.LANGUAGE_STACK,
    component: LanguageSheet,
  },
  {
    name: RouteNames.INFORMATION,
    component: Information,
  },
  {
    name: RouteNames.APP_INFO,
    component: AppInfo,
  },
];
export const ChatTabCollection = [
  {
    name: RouteNames.CHAT_TAB,
    component: Chat,
  },
];

export const AgentTabCollection = [
  {
    name: RouteNames.AGENT_TOPICS,
    component: AgentTopics,
  },
  {
    name: RouteNames.AGENT_CHAT,
    component: Chat,
  },
];
export const ResourceTabCollection = [
  {
    name: RouteNames.ASSISTANT_CHAT,
    component: Chat,
  },
  {
    name: RouteNames.RESOURCES_LIST,
    component: ResourcesList,
  },
  {
    name: RouteNames.RESOURCES_VIEW,
    component: ResourceView,
  },
];
// export const SupportChatCollection = [
//   {
//     name: RouteNames.SUPPORT_CHAT,
//     component: SupportChat,
//   },
//   {
//     name: RouteNames.USER_LIST,
//     component: UserList,
//   },

// ];

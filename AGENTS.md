# AGENTS.md

This repo is a React Native application using TypeScript, Redux Toolkit, RTK Query, and React Navigation.

## Start here
- Project overview: [README.md](README.md)
- Package scripts and dependencies: [package.json](package.json)
- TypeScript path aliases: [tsconfig.json](tsconfig.json)
- Babel module aliases: [babel.config.js](babel.config.js)

## Working conventions
- Keep feature code under the app folder: screens, components, redux, navigation, services, utils.
- Prefer the configured aliases from [tsconfig.json](tsconfig.json) and [babel.config.js](babel.config.js) over deep relative imports.
- The app entry uses [app/navigation/RootNavigation.tsx](app/navigation/RootNavigation.tsx) and the persisted Redux store is wired in [app/redux/store.ts](app/redux/store.ts).
- For Redux changes, follow the existing RTK Query + slice pattern in [app/redux](app/redux).
- For screen/component edits, check the exports in [app/screens/index.ts](app/screens/index.ts) and keep names aligned with the current navigation usage.

## Common commands
- Start Metro: `npm start`
- Run Android: `npm run android`
- Run iOS: `npm run ios`
- Lint: `npm run lint`
- Test: `npm test`

## Useful repo-specific notes
- `react-native-reanimated/plugin` must remain the last Babel plugin.
- The app uses `redux-persist` with a persisted `app` slice; avoid breaking serialization assumptions in the store setup.
- The root navigation checks network connectivity and language preferences on startup, so changes in startup behavior should be validated there.

## Preferred behavior for agents
- Make the smallest change that matches the existing pattern.
- Reuse existing screen/component naming and export structure instead of introducing new architectural layers.
- When adding or modifying state, prefer the current slice + hook patterns over ad hoc storage logic.
- If a task touches navigation, auth, or chat flows, inspect the related screen and Redux slice before editing.

## Suggested next customization
- Add a focused instruction file for the UI layer if this repo grows, for example a frontend convention guide for components, screens, and styling.

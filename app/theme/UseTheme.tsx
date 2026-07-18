// // ... previous theme and layout examples remain unchanged ...

// // Example 13: Animated Theme Provider (Dark/Light Mode)
// // theme/ThemeContext.tsx
// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { Appearance, useColorScheme } from 'react-native';
// import { useSharedValue, withTiming } from 'react-native-reanimated';
// import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
// import { Colors } from './colors';

// const LightTheme = {
//   background: '#FFFFFF',
//   text: '#000000',
//   card: '#F5F5F5',
//   primary: Colors.primary,
// };

// const DarkTheme = {
//   background: '#121212',
//   text: '#FFFFFF',
//   card: '#1E1E1E',
//   primary: Colors.primary,
// };

// export const ThemeContext = createContext({
//   theme: LightTheme,
//   toggleTheme: () => {},
//   isDark: false,
// });

// export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
//   const systemColorScheme = useColorScheme();
//   const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
//   const progress = useSharedValue(isDark ? 1 : 0);

//   useEffect(() => {
//     progress.value = withTiming(isDark ? 1 : 0, { duration: 400 });
//   }, [isDark]);

//   const toggleTheme = () => setIsDark(prev => !prev);

//   const animatedStyles = useAnimatedStyle(() => {
//     const backgroundColor = interpolateColor(progress.value, [0, 1], [LightTheme.background, DarkTheme.background]);
//     return { backgroundColor };
//   });

//   const theme = useMemo(() => (isDark ? DarkTheme : LightTheme), [isDark]);

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
//       <Animated.View style={[{ flex: 1 }, animatedStyles]}>{children}</Animated.View>
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);

// // Example usage in App.tsx
// // import { ThemeProvider } from './theme/ThemeContext';
// // const App = () => (
// //   <ThemeProvider>
// //     <AppNavigator />
// //   </ThemeProvider>
// // );

// // Example usage in component
// // const { theme, toggleTheme } = useTheme();
// // <Button title="Switch Theme" onPress={toggleTheme} />

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import CustomSplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate some loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      {isLoading ? (
        <CustomSplashScreen onFinish={() => setIsLoading(false)} />
      ) : (
        <RootNavigator />
      )}
    </AppProvider>
  );
}

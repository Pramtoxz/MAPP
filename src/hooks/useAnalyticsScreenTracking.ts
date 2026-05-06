import { useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { analyticsService } from '../services/analytics';

export const useAnalyticsScreenTracking = (
  navigationRef: React.RefObject<NavigationContainerRef<any>>
) => {
  const routeNameRef = useRef<string | undefined>(undefined);

  const onReady = () => {
    const currentRoute = navigationRef.current?.getCurrentRoute();
    if (currentRoute) {
      routeNameRef.current = currentRoute.name;
      analyticsService.logScreenView(currentRoute.name);
    }
  };

  const onStateChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRoute = navigationRef.current?.getCurrentRoute();
    
    if (currentRoute && previousRouteName !== currentRoute.name) {
      await analyticsService.logScreenView(
        currentRoute.name,
        currentRoute.name
      );
      routeNameRef.current = currentRoute.name;
    }
  };

  return { onReady, onStateChange };
};
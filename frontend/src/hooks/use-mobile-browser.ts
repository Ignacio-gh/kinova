import { useWindowDimensions } from 'react-native';

export function useIsMobileBrowser(): boolean {
  const { width } = useWindowDimensions();
  return width < 768;
}

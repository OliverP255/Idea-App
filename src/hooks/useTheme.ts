import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors'; // make sure this exists

export function useTheme() {
  const colorScheme = useColorScheme() ?? 'light';
  return { colors: Colors[colorScheme] };
}

import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

const useStyles = () => {
  const theme = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flexDirection: 'row',
          justifyContent: 'center',
          paddingVertical: 12,
        },
        dot: {
          width: 6,
          height: 6,
          backgroundColor: theme.colors.surface,
          borderRadius: 5,
          marginHorizontal: 4,
        },
      }),
    [],
  );

  return {styles, theme};
};

export default useStyles;

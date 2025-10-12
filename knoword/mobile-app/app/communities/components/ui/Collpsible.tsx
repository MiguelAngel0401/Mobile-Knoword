import { View, Text } from 'react-native';

type Props = {
  title: string;
  children: React.ReactNode;
};

export const Collapsible = ({ title, children }: Props) => {
  return (
    <View style={{ marginVertical: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>{title}</Text>
      <View>{children}</View>
    </View>
  );
};
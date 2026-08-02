import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function StudioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>Studio ID: {id}</Text>
    </View>
  );
}
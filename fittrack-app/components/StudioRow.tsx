// components/StudioRow.tsx: a pure "presenter", no data fetching, just display
import { View, Text, Pressable, StyleSheet } from "react-native";

interface StudioRowProps {
  id: number;
  name: string;
  suburb: string;
  city: string;
  onPress: (id: number) => void;
}

export function StudioRow({ id, name, suburb, city, onPress }: StudioRowProps) {
  return (
    <Pressable onPress={() => onPress(id)} style={styles.row}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.meta}>
        {suburb}, {city}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { padding: 16 },
  name: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 14, color: "#6b7280", marginTop: 2 },
});
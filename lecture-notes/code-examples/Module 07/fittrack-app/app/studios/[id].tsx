import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getStudio, StudioDetail } from "../../lib/api";

export default function StudioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [studio, setStudio] = useState<StudioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getStudio(id)
      .then((data) => {
        if (!cancelled) setStudio(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load this studio.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !studio) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? "Studio not found."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{studio.name}</Text>
      <Text style={styles.meta}>
        {studio.suburb}, {studio.city}
      </Text>

      <Text style={styles.sectionHeading}>Classes</Text>
      <FlatList
        data={studio.classes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.classRow}>
            <Text style={styles.className}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No classes yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  name: { fontSize: 24, fontWeight: "700" },
  meta: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
  },
  classRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d1d5db",
  },
  className: { fontSize: 15 },
  empty: { color: "#6b7280" },
  error: { color: "#dc2626" },
});

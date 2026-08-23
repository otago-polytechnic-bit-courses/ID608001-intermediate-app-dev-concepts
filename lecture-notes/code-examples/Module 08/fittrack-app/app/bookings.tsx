import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { getBookings, Booking } from "../lib/api";

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      setLoading(true);
      setError(null);

      getBookings()
        .then((data) => {
          if (!cancelled) setBookings(data);
        })
        .catch(() => {
          if (!cancelled) setError("Could not load your bookings.");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={bookings}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.status}>{item.status}</Text>
          <Text style={styles.meta}>Class #{item.studio_class}</Text>
          <Text style={styles.meta}>
            Booked {new Date(item.booked_at).toLocaleString()}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.empty}>No bookings yet.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  list: { padding: 16 },
  row: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d1d5db",
  },
  status: { fontSize: 15, fontWeight: "600", textTransform: "capitalize" },
  meta: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  empty: { color: "#6b7280" },
  error: { color: "#dc2626" },
});

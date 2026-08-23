import { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { getStudio, createBooking, StudioDetail, StudioClass } from "../../lib/api";

export default function StudioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [studio, setStudio] = useState<StudioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  const load = useCallback(() => {
    let cancelled = false;

    setLoading(true);
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

  useFocusEffect(load);

  async function handleBook(studioClass: StudioClass) {
    setBookingId(studioClass.id);
    setBookingMessage(null);

    try {
      await createBooking(studioClass.id);
      setBookingMessage(`Booked ${studioClass.name}.`);
      load();
    } catch (err) {
      setBookingMessage(err instanceof Error ? err.message : "Could not book this class.");
    } finally {
      setBookingId(null);
    }
  }

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

      {bookingMessage ? <Text style={styles.bookingMessage}>{bookingMessage}</Text> : null}

      <FlatList
        data={studio.classes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.classRow}>
            <View style={styles.classInfo}>
              <Text style={styles.className}>{item.name}</Text>
              <Text style={styles.classMeta}>
                {item.spaces_left} of {item.capacity} spaces left ·{" "}
                {item.capacity - item.spaces_left} booked
              </Text>
            </View>

            <Pressable
              style={[styles.bookButton, item.spaces_left <= 0 && styles.bookButtonDisabled]}
              onPress={() => handleBook(item)}
              disabled={item.spaces_left <= 0 || bookingId === item.id}
            >
              <Text style={styles.bookButtonText}>
                {bookingId === item.id
                  ? "Booking…"
                  : item.spaces_left <= 0
                    ? "Full"
                    : "Book"}
              </Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No classes yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  name: { fontSize: 24, fontWeight: "700" },
  meta: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  sectionHeading: { fontSize: 16, fontWeight: "600", marginTop: 24, marginBottom: 8 },
  bookingMessage: { color: "#111827", marginBottom: 12 },
  classRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d1d5db",
  },
  classInfo: { flex: 1, marginRight: 12 },
  className: { fontSize: 15, fontWeight: "600" },
  classMeta: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  bookButton: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  bookButtonDisabled: { backgroundColor: "#9ca3af" },
  bookButtonText: { color: "#fff", fontWeight: "600" },
  empty: { color: "#6b7280" },
  error: { color: "#dc2626" },
});

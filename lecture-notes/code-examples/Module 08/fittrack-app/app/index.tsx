import { useCallback, useState } from "react";
import { useFocusEffect, router, Link } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getStudios, Studio } from "../lib/api";
import { getToken, clearToken } from "../lib/auth";

export default function StudiosScreen() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function load() {
        const token = await getToken();
        if (!token) {
          router.replace("/login");
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const data = await getStudios();
          if (!cancelled) {
            setStudios(data);
          }
        } catch {
          if (!cancelled) {
            setError("Could not load studios. Is the API running?");
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }

      load();

      return () => {
        cancelled = true;
      };
    }, []),
  );

  async function handleLogout() {
    await clearToken();
    router.replace("/login");
  }

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
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={studios}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link href={`/studios/${item.id}`} asChild>
            <Pressable style={styles.row}>
              <Text style={styles.rowText}>{item.name}</Text>
              <Text style={styles.rowMeta}>
                {item.suburb}, {item.city}
              </Text>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No studios yet.</Text>}
      />

      <View style={styles.footer}>
        <Link href="/bookings" asChild>
          <Pressable style={styles.footerButton}>
            <Text style={styles.footerButtonText}>My bookings</Text>
          </Pressable>
        </Link>
        <Pressable style={styles.footerButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  list: { padding: 16 },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d1d5db",
  },
  rowText: { fontSize: 16, fontWeight: "600" },
  rowMeta: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  empty: { textAlign: "center", color: "#6b7280", padding: 24 },
  error: { color: "#dc2626" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#d1d5db",
  },
  footerButton: { padding: 8 },
  footerButtonText: { color: "#111827", fontWeight: "600" },
  logoutText: { color: "#dc2626", fontWeight: "600" },
});

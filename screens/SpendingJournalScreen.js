import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getData } from "../storage/StorageService";

/* ===== UTIL ===== */
const formatDateTitle = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function SpendingJournalScreen() {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const load = async () => {
      const data = (await getData("transactions")) || [];

      // sort DESC
      const sorted = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // group by date
      const map = {};
      sorted.forEach((t) => {
        const day = new Date(t.date).toISOString().split("T")[0];
        if (!map[day]) map[day] = [];
        map[day].push(t);
      });

      // take latest 7 days
      const limited = Object.keys(map)
        .slice(0, 7)
        .reduce((acc, key) => {
          acc[key] = map[key];
          return acc;
        }, {});

      setGrouped(limited);
    };

    load();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nhật ký chi tiêu</Text>
        <Text style={styles.subtitle}>
          Nhìn lại thói quen chi tiêu của bạn
        </Text>

        {Object.keys(grouped).length === 0 && (
          <Text style={styles.empty}>
            Chưa có dữ liệu chi tiêu
          </Text>
        )}

        {Object.entries(grouped).map(([date, items]) => (
          <View key={date} style={styles.dayBlock}>
            <Text style={styles.dayTitle}>
              📅 {formatDateTitle(date)}
            </Text>

            {items.map((item, idx) => {
              const isExpense = item.type === "expense";

              return (
                <View key={idx} style={styles.item}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.category}>
                      {item.category}
                    </Text>

                    {item.note ? (
                      <Text style={styles.note}>
                        “{item.note}”
                      </Text>
                    ) : null}
                  </View>

                  <Text
                    style={[
                      styles.amount,
                      { color: isExpense ? "#E53935" : "#43A047" },
                    ]}
                  >
                    {isExpense ? "-" : "+"}
                    {item.amount.toLocaleString()} ₫
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F6FA",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 20,
  },
  empty: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
  },

  /* DAY BLOCK */
  dayBlock: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  /* ITEM */
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  category: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  note: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    fontStyle: "italic",
  },
  amount: {
    fontWeight: "700",
    marginLeft: 10,
  },
});

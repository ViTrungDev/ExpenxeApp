import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { getData } from "../storage/StorageService";

export default function TransactionsScreen() {
  const [transactions, setTransactions] =
    useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = (await getData("transactions")) || [];
    setTransactions(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Tất cả giao dịch
      </Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.category}>
                {item.category}
              </Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString(
                  "vi-VN"
                )}
              </Text>
            </View>

            <Text
              style={[
                styles.amount,
                {
                  color:
                    item.type === "expense"
                      ? "#E53935"
                      : "#43A047",
                },
              ]}
            >
              {item.type === "expense" ? "-" : "+"}
              {item.amount.toLocaleString("vi-VN")} ₫
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  category: {
    fontWeight: "600",
  },
  date: {
    color: "#888",
    fontSize: 12,
  },
  amount: {
    fontWeight: "700",
  },
});

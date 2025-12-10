import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getData } from "../storage/StorageService";

export default function HomeScreen() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getData("transactions");
        setTransactions(data || []);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>
        {item.category} - {item.type === "income" ? "+" : "-"}${item.amount}
      </Text>
      <Text style={styles.itemDate}>{item.date}</Text>
      {item.note && <Text style={styles.itemNote}>{item.note}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
  itemDate: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  itemNote: {
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 16,
  },
});

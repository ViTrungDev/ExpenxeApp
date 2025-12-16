import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getData } from "../storage/StorageService";

export default function InsightsScreen({ navigation }) {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useFocusEffect(
  useCallback(() => {
    loadData();
  }, [])
);

  const loadData = async () => {
    const transactions = (await getData("transactions")) || [];

    // Tổng chi
    const expenseList = transactions.filter(
      (t) => t.type === "expense"
    );

    const total = expenseList.reduce(
      (sum, i) => sum + i.amount,
      0
    );
    setTotalExpense(total);
    // Tổng thu
    const incomeList =  transactions.filter(
      (t) => t.type === "income"
    );
    const totalIncomes = incomeList.reduce(
      (sum, i) => sum + i.amount,
      0
    );
    setTotalIncome(totalIncomes);

    setMonthlyData(buildMonthlyExpense(expenseList));
    setCategoryData(buildCategorySummary(expenseList));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tổng quan chi tiêu</Text>

      {/* Tổng thu chi */}
      <View style={styles.card}>
        <View>
          <Text style={styles.label}>Tổng chi</Text>
          <Text style={styles.amount}>
            {totalExpense.toLocaleString("vi-VN")} VND
          </Text>
        </View>
        <Text style={styles.line}>/</Text>
        <View>
          <Text style={styles.amounts}>{totalIncome.toLocaleString("vi-VN")} VND</Text>
        </View>
      </View>

      {/* Biểu đồ */}
      <Text style={styles.sectionTitle}>
        Chi tiêu theo tháng
      </Text>
      <MonthlyChart data={monthlyData} />

      {/* Category */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Chi theo danh mục
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Transactions")
          }
        >
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {categoryData.map((item) => (
        <CategoryCard
          key={item.category}
          item={item}
        />
      ))}
    </ScrollView>
  );
}

/* ===== BIỂU ĐỒ ===== */
function MonthlyChart({ data }) {
  const max = Math.max(...data.map((i) => i.amount), 1);

  return (
    <View style={styles.chart}>
      {data.map((item) => (
        <View key={item.month} style={styles.barWrap}>
          <View
            style={[
              styles.bar,
              { height: `${(item.amount / max) * 100}%` },
            ]}
          />
          <Text style={styles.barText}>
            T{item.month}
          </Text>
        </View>
      ))}
    </View>
  );
}

/* ===== CATEGORY CARD ===== */
function CategoryCard({ item }) {
  return (
    <View style={styles.categoryCard}>
      <Text style={styles.categoryName}>
        {item.category}
      </Text>
      <Text style={styles.categoryAmount}>
        {item.amount.toLocaleString("vi-VN")} ₫
      </Text>
    </View>
  );
}

/* ===== DATA HANDLER ===== */
function buildMonthlyExpense(list) {
  const year = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    amount: 0,
  }));

  list.forEach((i) => {
    const d = new Date(i.date);
    if (d.getFullYear() === year) {
      months[d.getMonth()].amount += i.amount;
    }
  });

  return months;
}

function buildCategorySummary(list) {
  const map = {};
  list.forEach((i) => {
    map[i.category] =
      (map[i.category] || 0) + i.amount;
  });

  return Object.keys(map).map((key) => ({
    category: key,
    amount: map[key],
  }));
}

/* ===== STYLE ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  line:{
    fontSize:50
  },
  label: {
    color: "#888",
  },
  amount: {
    fontSize: 28,
    fontWeight: "600",
  },
  amounts:{
    fontSize: 32,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    color: "#2ecc71",
    fontWeight: "600",
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 150,
    marginBottom: 20,
  },
  barWrap: {
    flex: 1,
    alignItems: "center",
  },
  bar: {
    width: 14,
    backgroundColor: "#4A90E2",
    borderRadius: 6,
  },
  barText: {
    fontSize: 12,
    marginTop: 6,
  },
  categoryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryName: {
    fontWeight: "600",
  },
  categoryAmount: {
    fontWeight: "700",
  },
});

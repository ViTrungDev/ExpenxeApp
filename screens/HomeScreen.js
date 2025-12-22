import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import { useFocusEffect } from "@react-navigation/native";
import { getData } from "../storage/StorageService"; 

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  /* ========= GREETING ========= */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "Chào buổi sáng";
    if (hour >= 11 && hour < 13) return "Chào buổi trưa";
    if (hour >= 13 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const [greeting] = useState(getGreeting());

  /* ========= DATA ========= */
  const [transactions, setTransactions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const data = await getData("transactions");
        setTransactions(Array.isArray(data) ? data : []);
      };
      loadData();
    }, [])
  );

  /* ========= CALCULATE ========= */
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const savedAmount = Math.max(totalIncome - totalExpense, 0);

  /* ========= CATEGORY MAP ========= */
  const categoryMap = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      const key = t.category || "Khác";
      categoryMap[key] = (categoryMap[key] || 0) + Number(t.amount || 0);
    });

  const categories = Object.entries(categoryMap).map(([name, value], i) => ({
    name,
    percentage: value,
    color: ["#2CD9C5", "#FFB84C", "#4D7CFE", "#D9D9D9"][i % 4],
  }));

  const pieData = categories.map(item => ({
    name: item.name,
    population: item.percentage,
    color: item.color,
    legendFontColor: "#4A4A4A",
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: () => "#2D74FF",
    labelColor: () => "#000",
  };

  /* ========= BLOCK 1 ========= */
  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  /* ========= BLOCK 3 ========= */
  const spendingPercent =
    totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  let suggestion = "📌 Hãy bắt đầu ghi chép chi tiêu mỗi ngày";
  if (spendingPercent < 50) suggestion = "👍 Bạn đang chi tiêu rất hợp lý";
  else if (spendingPercent < 80) suggestion = "🙂 Chi tiêu ổn, nên theo dõi thêm";
  else suggestion = "⚠️ Chi tiêu cao, nên cân nhắc cắt giảm";

  /* ========= UI ========= */
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.welcome}>{greeting}</Text>
          <Text style={styles.username}>Bạn</Text>
        </View>

        {/* BUDGET CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ngân sách tháng</Text>

          <Text style={styles.budgetText}>
            ₫{totalExpense.toLocaleString()}
            <Text style={styles.totalBudget}>
              {" "} / ₫{totalIncome.toLocaleString()}
            </Text>
          </Text>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(spendingPercent, 100)}%` },
              ]}
            />
          </View>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Đã chi</Text>
              <Text style={styles.infoValue}>₫{totalExpense.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Tiết kiệm</Text>
              <Text style={styles.infoValue}>₫{savedAmount.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* ===== BIỂU ĐỒ (GIỮ NGUYÊN) ===== */}
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Biểu đồ chi tiêu</Text>
        </View>

        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={Math.max(width, 320)}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            chartConfig={chartConfig}
          />
        ) : (
          <Text style={styles.empty}>Chưa có dữ liệu</Text>
        )}

        {/* ===== BLOCK 1: TOP CHI TIÊU ===== */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Chi tiêu nhiều nhất</Text>
          {topCategories.map(([name, value], i) => (
            <View key={name} style={styles.row}>
              <Text>{i + 1}. {name}</Text>
              <Text style={styles.bold}>₫{value.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* ===== BLOCK 3: GỢI Ý ===== */}
        <View style={styles.suggestion}>
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  /* ===== BASE ===== */
  safe: {
    flex: 1,
    backgroundColor: "#F3F6FA",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  /* ===== HEADER ===== */
  header: {
    marginBottom: 20,
  },
  welcome: {
    color: "#6B7280",
    fontSize: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  /* ===== BUDGET CARD ===== */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
  },
  budgetText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2D74FF",
  },
  totalBudget: {
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#E5ECF6",
    borderRadius: 10,
    marginTop: 14,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2D74FF",
    borderRadius: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
    color: "#111827",
  },

  /* ===== CHART ===== */
  chartHeader: {
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  empty: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 40,
  },

  /* ===== BLOCK: TOP CHI TIÊU ===== */
  block: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginTop: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  bold: {
    fontWeight: "700",
    color: "#2D74FF",
  },

  /* ===== AI SUGGESTION ===== */
  suggestion: {
    marginTop: 20,
    backgroundColor: "#EEF4FF",
    borderRadius: 18,
    padding: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#2D74FF",
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D4ED8",
    lineHeight: 20,
  },
});

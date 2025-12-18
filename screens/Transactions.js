import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getData } from "../storage/StorageService";

/* ===== ICON THEO CATEGORY ===== */
const CATEGORY_ICONS = {
  "Ăn uống": "fast-food-outline",
  "Mua sắm": "cart-outline",
  "Di chuyển": "car-outline",
  "Thuê nhà": "home-outline",
  "Điện nước": "flash-outline",
  "Giải trí": "game-controller-outline",
  "Sức khỏe": "heart-outline",
  "Lương": "cash-outline",
  "Khác": "ellipsis-horizontal-outline",
};

export default function InsightsScreen({ navigation }) {
  const [categoryData, setCategoryData] = useState([]);
  const [yearlyChartData, setYearlyChartData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  /**
   * ===== LOAD DATA (CHUẨN LOGIC) =====
   */
  const loadData = useCallback(async () => {
    const transactions = (await getData("transactions")) || [];

    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    /* ===== DATA THEO THÁNG (DETAIL) ===== */
    const monthlyData = transactions.filter((t) => {
      if (!t.date) return false;
      const d = new Date(t.date);
      return (
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

    const expenseList = monthlyData.filter(
      (t) => t.type === "expense"
    );
    const incomeList = monthlyData.filter(
      (t) => t.type === "income"
    );

    setTotalExpense(
      expenseList.reduce((s, i) => s + i.amount, 0)
    );
    setTotalIncome(
      incomeList.reduce((s, i) => s + i.amount, 0)
    );

    setCategoryData(buildCategorySummary(expenseList));

    /* ===== DATA BIỂU ĐỒ 12 THÁNG (THEO NĂM) ===== */
    const yearlyExpenses = transactions.filter((t) => {
      if (!t.date) return false;
      const d = new Date(t.date);
      return (
        t.type === "expense" &&
        d.getFullYear() === year
      );
    });

    setYearlyChartData(
      buildYearlyExpense(yearlyExpenses)
    );
  }, [selectedDate]);

  /**
   * ===== REFRESH KHI FOCUS =====
   */
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return (
    <ScrollView style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>Tổng quan chi tiêu</Text>

        <TouchableOpacity
          style={styles.monthPicker}
          onPress={() => setShowPicker(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color="#333"
          />
          <Text style={styles.monthText}>
            {selectedDate.getMonth() + 1}/
            {selectedDate.getFullYear()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== PICKER ===== */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={
            Platform.OS === "ios"
              ? "spinner"
              : "default"
          }
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {/* ===== TỔNG THU / CHI ===== */}
      <View style={styles.card}>
        <View>
          <Text style={styles.label}>Tổng chi</Text>
          <Text style={styles.amount}>
            {totalExpense.toLocaleString("vi-VN")} ₫
          </Text>
        </View>

        <Text style={styles.line}>/</Text>

        <View>
          <Text style={styles.label}>Tổng thu</Text>
          <Text style={styles.amounts}>
            {totalIncome.toLocaleString("vi-VN")} ₫
          </Text>
        </View>
      </View>

      {/* ===== BIỂU ĐỒ 12 THÁNG (THEO NĂM) ===== */}
      <Text style={styles.sectionTitle}>
        Chi tiêu theo năm
      </Text>
      <YearlyChart data={yearlyChartData} />

      {/* ===== CATEGORY ===== */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Chi theo danh mục
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Lịch sử")
          }
        >
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {categoryData.length === 0 && (
        <Text style={styles.empty}>
          Không có dữ liệu trong tháng này
        </Text>
      )}

      {categoryData.map((item) => (
        <CategoryCard
          key={item.category}
          item={item}
          totalExpense={totalExpense}
        />
      ))}

    </ScrollView>
  );
}

/* ===== BIỂU ĐỒ 12 THÁNG ===== */
function YearlyChart({ data }) {
  const max = Math.max(...data.map((i) => i.amount), 1);

  return (
    <View style={styles.chart}>
      {data.map((item) => (
        <View
          key={`${item.year}-${item.month}`}
          style={styles.barWrap}
        >
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
function CategoryCard({ item, totalExpense }) {
  const icon =
    CATEGORY_ICONS[item.category] ||
    "pricetag-outline";

  const percent =
    totalExpense > 0
      ? Math.round((item.amount / totalExpense) * 100)
      : 0;

  return (
    <View style={styles.categoryCard}>
      {/* ICON */}
      <View style={styles.iconBox}>
        <Ionicons
          name={icon}
          size={22}
          color="#FF8A65"
        />
      </View>

      {/* INFO */}
      <View style={styles.categoryInfo}>
        <View style={styles.rowBetween}>
          <Text style={styles.categoryName}>
            {item.category}
          </Text>
          <Text style={styles.percentText}>
            {percent}%
          </Text>
        </View>

        <Text style={styles.categoryAmount}>
          {item.amount.toLocaleString("vi-VN")} ₫
        </Text>

        {/* PROGRESS BAR */}
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${percent}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
}


/* ===== DATA HANDLER ===== */
function buildYearlyExpense(list, year) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    year,
    amount: 0,
  }));

  list.forEach((i) => {
    const d = new Date(i.date);
    months[d.getMonth()].amount += i.amount;
  });

  return months;
}


function buildCategorySummary(list) {
  const map = {};
  list.forEach((i) => {
    if (!i.category) return;
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  monthPicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  monthText: {
    marginLeft: 6,
    fontWeight: "600",
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
  line: {
    fontSize: 40,
    color: "#ccc",
  },
  label: {
    color: "#888",
  },
  amount: {
    fontSize: 26,
    fontWeight: "600",
  },
  amounts: {
    fontSize: 28,
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
  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 12,
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
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF0EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontWeight: "600",
    fontSize: 16,
  },
  categoryAmount: {
    fontWeight: "700",
    marginTop: 2,
  },
  rowBetween: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

percentText: {
  fontWeight: "600",
  color: "#888",
},

progressBg: {
  height: 6,
  backgroundColor: "#eee",
  borderRadius: 4,
  marginTop: 6,
  overflow: "hidden",
},

progressFill: {
  height: "100%",
  backgroundColor: "#FF8A65",
  borderRadius: 4,
},

});

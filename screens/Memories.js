import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@react-native-vector-icons/ionicons";
import { getData } from "../storage/StorageService";

/* ===== CATEGORY LIST ===== */
const CATEGORIES = [
  "Tất cả",
  "Ăn uống",
  "Mua sắm",
  "Di chuyển",
  "Thuê nhà",
  "Điện nước",
  "Giải trí",
  "Sức khỏe",
  "Lương",
  "Khác",
];

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("Tất cả");
  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [showDatePicker, setShowDatePicker] =
    useState(false);
  const [showCategoryModal, setShowCategoryModal] =
    useState(false);

  /* ===== LOAD DATA ===== */
  const loadData = useCallback(async () => {
    const data = (await getData("transactions")) || [];
    setTransactions(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ===== AUTO FILTER WHEN CHANGE ===== */
  useEffect(() => {
    filterData(transactions, selectedCategory, selectedDate);
  }, [transactions, selectedCategory, selectedDate]);

  /* ===== FILTER CORE ===== */
  const filterData = (data, category, date) => {
    const month = date.getMonth();
    const year = date.getFullYear();

    let result = [...data];

    // Filter category
    if (category !== "Tất cả") {
      result = result.filter(
        (t) => t.category === category
      );
    }

    // Filter month/year
    result = result.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

    setFiltered(result);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tất cả giao dịch</Text>

      {/* ===== FILTER CARD ===== */}
      <View style={styles.filterCard}>
        <View style={styles.filterRow}>
          {/* MONTH PICKER */}
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.filterLabel}>Tháng</Text>
            <Text style={styles.filterValue}>
              {selectedDate.getMonth() + 1}/
              {selectedDate.getFullYear()}
            </Text>
          </TouchableOpacity>

          {/* CATEGORY PICKER */}
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={styles.filterLabel}>
              Danh mục
            </Text>
            <Text style={styles.filterValue}>
              {selectedCategory}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== LIST ===== */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Không có giao dịch trong tháng này
          </Text>
        }
        renderItem={({ item }) => (
          <TransactionItem item={item} />
        )}
      />

      {/* ===== DATE PICKER ===== */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={
            Platform.OS === "ios"
              ? "spinner"
              : "default"
          }
          onChange={(e, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {/* ===== CATEGORY MODAL ===== */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCategory(c);
                  setShowCategoryModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalText,
                    selectedCategory === c &&
                      styles.activeCategory,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ===== ITEM ===== */
function TransactionItem({ item }) {
  const isExpense = item.type === "expense";

  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.category}>
          {item.category}
        </Text>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString("vi-VN")}
        </Text>
      </View>

      <Text
        style={[
          styles.amount,
          { color: isExpense ? "#E53935" : "#43A047" },
        ]}
      >
        {isExpense ? "-" : "+"}
        {item.amount.toLocaleString("vi-VN")} ₫
      </Text>
    </View>
  );
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

  /* FILTER */
  filterCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  filterItem: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  filterLabel: {
    fontSize: 12,
    color: "#888",
  },
  filterValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },

  /* LIST */
  item: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
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
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalText: {
    fontSize: 16,
  },
  activeCategory: {
    fontWeight: "700",
    color: "#2ecc71",
  },
});

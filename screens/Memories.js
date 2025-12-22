import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  /* ===== DETAIL MODAL ===== */
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  /* ===== LOAD DATA ===== */
  const loadData = useCallback(async () => {
    const data = (await getData("transactions")) || [];
    setTransactions(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ===== FILTER ===== */
  useEffect(() => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    let result = [...transactions];

    if (selectedCategory !== "Tất cả") {
      result = result.filter(
        (t) => t.category === selectedCategory
      );
    }

    result = result.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    setFiltered(result);
  }, [transactions, selectedCategory, selectedDate]);

  /* ===== SAVE EDIT ===== */
  const handleSave = async () => {
    const updated = transactions.map((t) =>
      t.id === editItem.id ? editItem : t
    );

    setTransactions(updated);
    setFiltered(updated);

    await AsyncStorage.setItem(
      "transactions",
      JSON.stringify(updated)
    );

    setShowDetailModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tất cả giao dịch</Text>

      {/* ===== FILTER ===== */}
      <View style={styles.filterCard}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.filterLabel}>Tháng</Text>
            <Text style={styles.filterValue}>
              {selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={styles.filterLabel}>Danh mục</Text>
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
          <Text style={styles.empty}>Không có giao dịch</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSelectedItem(item);
              setEditItem({ ...item });
              setShowDetailModal(true);
            }}
          >
            <TransactionItem item={item} />
          </TouchableOpacity>
        )}
      />

      {/* ===== DATE PICKER ===== */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {/* ===== CATEGORY MODAL ===== */}
      <Modal visible={showCategoryModal} transparent animationType="slide">
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

      {/* ===== DETAIL MODAL ===== */}
      <Modal visible={showDetailModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.detailModal}>
            {editItem && (
              <>
                <Text style={styles.detailTitle}>
                  Chỉnh sửa giao dịch
                </Text>

                <Text style={styles.detailLabel}>Danh mục</Text>
                <TextInput
                  style={styles.input}
                  value={editItem.category}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, category: text })
                  }
                />

                <Text style={styles.detailLabel}>Số tiền</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(editItem.amount)}
                  onChangeText={(text) =>
                    setEditItem({
                      ...editItem,
                      amount: Number(text) || 0,
                    })
                  }
                />

                <Text style={styles.detailLabel}>Ghi chú</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  multiline
                  value={editItem.note || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, note: text })
                  }
                />

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.cancelBtn]}
                    onPress={() => setShowDetailModal(false)}
                  >
                    <Text>Hủy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.saveBtn]}
                    onPress={handleSave}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Lưu
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
        <Text style={styles.category}>{item.category}</Text>
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

  filterCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
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

  detailModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#f6f7fb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#eee",
    marginRight: 10,
  },
  saveBtn: {
    backgroundColor: "#2D74FF",
  },
});

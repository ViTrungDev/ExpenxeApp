import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { scale } from "../utils/scale";
import formatNumber from "../utils/formatNumber";
import { pushData } from "../storage/StorageService";
import { Alert } from "react-native";

export default function AddTransaction({ navigation }) {
  const categories = [
    { lable: "Danh mục", icon: "pricetag" },
    { lable: "Ăn uống", icon: "fast-food" },
    { lable: "Mua sắm", icon: "cart" },
    { lable: "Giải trí", icon: "game-controller" },
    { lable: "Di chuyển", icon: "car" },
    { lable: "Thuê nhà", icon: "home" },
    { lable: "Lương", icon: "cash" },
    { lable: "Điện nước", icon: "flash" },
    { lable: "Dịch vụ", icon: "phone-portrait" },
    { lable: "Sức khỏe", icon: "heart" },
    { lable: "Khác", icon: "ellipsis-horizontal" },
  ];
  const formatDate = (date) => {
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectCategory, setSelectCategory] = useState(categories[0]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("0");
  const [note, setNote] = useState("");

  const resetForm = ()=>{
    setType("expense");
    setAmount("0");
    setSelectCategory(categories[0]);
    setDate(new Date());
    setNote("");
  }

  const handleSaveTransaction = async ()=>{
    if(!amount || amount === "0"){
      Alert.alert("Lỗi","Vui lòng nhập số tiền giao dịch.");
      return;
    }
    if(selectCategory.lable === "Danh mục"){
      Alert.alert("Lỗi","Vui lòng chọn danh mục giao dịch.");
      return;
    }
    const transaction = {
      id: Date.now().toLocaleString(),
      categories: selectCategory.lable,
      type: type,
      amount: Number(amount),
      date: date.toISOString(),
      note: note.trim(),
    }
    try{
      await pushData('transactions',transaction);
      Alert.alert("Thành công","Đã thêm giao dịch thành công.");
      resetForm();
      navigation.goBack();
    }
    catch(e){
      Alert.alert("Lỗi","Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={scale(26)} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thêm giao dịch</Text>

        <TouchableOpacity>
          <Text> </Text>
        </TouchableOpacity>
      </View>

      {/* TYPE SWITCH */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            type === "expense" && styles.switchActive,
          ]}
          onPress={() => setType("expense")}
        >
          <Text
            style={[
              styles.switchText,
              type === "expense" && styles.switchTextActive,
            ]}
          >
            Chi tiêu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.switchButton,
            type === "income" && styles.switchActive,
          ]}
          onPress={() => setType("income")}
        >
          <Text
            style={[
              styles.switchText,
              type === "income" && styles.switchTextActive,
            ]}
          >
            Thu nhập
          </Text>
        </TouchableOpacity>
      </View>
      {/* AMOUNT INPUT */}
      <View style={styles.amountContainer}>
          <TextInput
            value={formatNumber(amount)}
            onChangeText={(text) => {
              const clean = text.replace(/[^0-9]/g, "");
              setAmount(clean);
            }}
            keyboardType="number-pad"
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor="#ccc"
            underlineColorAndroid="transparent"
          />
          <Text style={styles.currencyText}>VND</Text>
        </View>
      {/* CATEGORY + DATE */}
      <View style={styles.card}>
        {/* CATEGORY */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setCategoryModalVisible(true)}
        >
          <View style={styles.rowLeft}>
            <Ionicons
              name={selectCategory.icon}
              size={scale(20)}
              color="#fab8a4ff"
            />
            <Text style={styles.rowText}>{selectCategory.lable}</Text>
          </View>
          <Ionicons name="chevron-forward" size={scale(20)} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* DATE */}
        <TouchableOpacity
            style={styles.row}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="calendar" size={scale(20)} color="#FF8A65" />
              <Text style={styles.rowText}>{formatDate(date)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={scale(20)} />
          </TouchableOpacity>

      </View>

      {/* NOTE */}
      <Text style={styles.noteLabel}>Ghi chú</Text>

      <View style={styles.noteBox}>
        <TextInput
          placeholder="Thêm ghi chú..."
          value={note}
          onChangeText={setNote}
          multiline
          scrollEnabled
          textAlignVertical="top"
          style={styles.noteInput}
        />
      </View>

      {/* BUTTON */}
      <TouchableOpacity onPress={handleSaveTransaction} style={styles.addButton}>
        <Text style={styles.addButtonText}>Lưu giao dịch</Text>
      </TouchableOpacity>

      {/* CATEGORY MODAL */}
      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn danh mục</Text>

            <ScrollView>
              {categories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectCategory(item);
                    setCategoryModalVisible(false);
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={scale(22)}
                    color="#fab8a4ff"
                  />
                  <Text style={styles.modalItemText}>{item.lable}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  headerTitle: {
    fontSize: scale(18),
    fontWeight: "600",
  },
  /* SWITCH */
  switchContainer: {
    flexDirection: "row",
    margin: scale(16),
    borderRadius: scale(16),
    backgroundColor: "#F1F4F8",
    padding: scale(4),
  },
  switchButton: {
    flex: 1,
    paddingVertical: scale(10),
    borderRadius: scale(14),
    alignItems: "center",
  },
  switchActive: {
    backgroundColor: "#fff",
  },
  switchText: {
    fontSize: scale(14),
    color: "#666",
  },
  switchTextActive: {
    color: "#f11111ff",
    fontWeight: "600",
  },

    /* AMOUNT */
    amountContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: scale(20),
    },

    amountInput: {
      fontSize: scale(30),
      fontWeight: "700",
      color: "#abababff",
      textAlign: "center",
      minWidth: scale(120),
    },

    currencyText: {
      fontSize: scale(30),
      marginLeft: scale(2),
      color: "#999",
      fontWeight: "500",
    },

      /* CARD */
  card: {
    marginHorizontal: scale(16),
    borderRadius: scale(16),
    backgroundColor: "#fff",
    padding: scale(12),
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scale(12),
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  rowText: {
    fontSize: scale(16),
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
  },

  /* NOTE */
  noteLabel: {
    marginHorizontal: scale(16),
    marginTop: scale(20),
    marginBottom: scale(8),
    fontSize: scale(14),
    color: "#666",
  },
  noteBox: {
    marginHorizontal: scale(16),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: "#eee",
    padding: scale(12),
    minHeight: scale(120),
  },
  noteInput: {
    fontSize: scale(14),
    lineHeight: scale(22),
    flex:1,
    textAlignVertical: "top",
  },
  cameraIcon: {
    position: "absolute",
    right: scale(12),
    bottom: scale(12),
  },

  /* BUTTON */
  addButton: {
    margin: scale(16),
    backgroundColor: "#fab8a4ff",
    borderRadius: scale(16),
    paddingVertical: scale(14),
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "600",
  },
  /* MODAL */
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
},

modalContent: {
  backgroundColor: "#fff",
  borderTopLeftRadius: scale(20),
  borderTopRightRadius: scale(20),
  padding: scale(16),
  maxHeight: "70%",
},

modalTitle: {
  fontSize: scale(16),
  fontWeight: "600",
  textAlign: "center",
  marginBottom: scale(12),
},

modalItem: {
  flexDirection: "row",
  alignItems: "center",
  gap: scale(12),
  paddingVertical: scale(12),
},

modalItemText: {
  fontSize: scale(15),
},
});


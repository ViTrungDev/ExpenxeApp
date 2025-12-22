import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getData, saveData } from "../storage/StorageService";

export default function AccountsScreen() {
  /* ========= USER ========= */
  const [name, setName] = useState("Bạn");
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const user = await getData("user");
      if (user?.name) {
        setName(user.name);
      }
    };
    loadUser();
  }, []);

  const handleSaveName = async () => {
    if (!tempName.trim()) {
      Alert.alert("Lỗi", "Tên không được để trống");
      return;
    }

    const user = {
      id: "local-user",
      name: tempName.trim(),
      email: "",
    };

    await saveData("user", user);
    setName(user.name);
    setEditing(false);
  };

  /* ========= UI ========= */
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Tài khoản</Text>
          <Text style={styles.subtitle}>Quản lý thông tin cá nhân</Text>
        </View>

        {/* USER CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Tên hiển thị</Text>

          {editing ? (
            <>
              <TextInput
                value={tempName}
                onChangeText={setTempName}
                placeholder="Nhập tên của bạn"
                style={styles.input}
                autoFocus
              />

              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.btn, styles.saveBtn]}
                  onPress={handleSaveName}
                >
                  <Text style={styles.btnText}>Lưu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.cancelBtn]}
                  onPress={() => setEditing(false)}
                >
                  <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.rowBetween}>
              <Text style={styles.name}>{name}</Text>
              <TouchableOpacity
                onPress={() => {
                  setTempName(name);
                  setEditing(true);
                }}
              >
                <Text style={styles.edit}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* FEATURES (GỢI Ý) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chức năng</Text>
          <FeatureItem text="🌙 Giao diện tối (Dark Mode)" />
          <FeatureItem text="🧾 Lịch sử & nhật ký chi tiêu" />
          <FeatureItem text="🔐 Quyền riêng tư & bảo mật dữ liệu" />
          <FeatureItem text="📄 Điều khoản dịch vụ" />
        </View>
          <View style={styles.brandCard}>
            <Text style={styles.brandTitle}>Smart Coin</Text>
            <Text style={styles.brandText}>
              Giúp bạn hiểu rõ tiền của mình mỗi ngày
            </Text>
          </View>

        {/* INFO */}
        <View style={styles.footer}>
          <Text style={styles.version}>Smart coin v1.0</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

/* ========= COMPONENT ========= */
const FeatureItem = ({ text }) => (
  <View style={styles.featureRow}>
    <Text style={styles.featureText}>{text}</Text>
    <Text style={styles.arrow}>›</Text>
  </View>
);

/* ========= STYLES ========= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F6FA",
  },
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    color: "#666",
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  edit: {
    color: "#2D74FF",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E6EF",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#2D74FF",
    marginRight: 10,
  },
  cancelBtn: {
    backgroundColor: "#F1F3F6",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  featureText: {
    fontSize: 15,
  },
  arrow: {
    color: "#999",
    fontSize: 18,
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    marginBottom:30,
  },
  version: {
    color: "#999",
    fontSize: 12,
  },
brandCard: {
  marginTop: 12,
  paddingVertical: 24,
  paddingHorizontal: 20,
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 3,
},

brandTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#2D74FF",
  marginBottom: 6,
},

brandText: {
  fontSize: 14,
  color: "#666",
  textAlign: "center",
  lineHeight: 20,
},

});

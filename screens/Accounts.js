import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
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
  const navigation = useNavigation();

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

    /** @type {User} */
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
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <Text style={styles.title}>Tài khoản</Text>
          <Text style={styles.subtitle}>
            Quản lý thông tin cá nhân & ứng dụng
          </Text>
        </View>

        {/* ===== USER CARD ===== */}
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

        {/* ===== FEATURES ===== */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chức năng</Text>

          <FeatureItem text="💾 Xuất file data" 
            disabled
            onPress={() =>
              Alert.alert(
                "Sắp ra mắt 🚀",
                "Chức năng xuất dữ liệu sẽ được cập nhật trong thời gian tới"
              )
            }
          />
          <FeatureItem text="🧾 Lịch sử & nhật ký chi tiêu" 
            onPress={() => navigation.navigate("SpendingJournal")}
          />
          <FeatureItem text="🔐 Quyền riêng tư & bảo mật dữ liệu" 
            onPress={() => navigation.navigate("Privacy")}
          />
          <FeatureItem
            text="📄 Điều khoản dịch vụ"
            onPress={() => navigation.navigate("Terms")}
          />
        </View>

        {/* ===== BRAND ===== */}
        <View style={styles.brandCard}>
          <Text style={styles.brandTitle}>Smart Coin</Text>
          <Text style={styles.brandText}>
            Giúp bạn hiểu rõ tiền của mình mỗi ngày
          </Text>
        </View>

        {/* ===== FOOTER ===== */}
        <View style={styles.footer}>
          <Text style={styles.version}>Smart Coin v1.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ========= COMPONENT ========= */
function FeatureItem({ text, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[
        styles.featureItem,
        disabled && styles.disabledItem
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.featureText,
          disabled && styles.disabledText
        ]}
      >
        {text}
      </Text>

      {disabled && (
        <Text style={styles.comingSoon}>Sắp có</Text>
      )}
    </TouchableOpacity>
  );
}


/* ========= STYLES ========= */
const styles = StyleSheet.create({
  /* ===== BASE ===== */
  safe: {
    flex: 1,
    backgroundColor: "#F3F6FA",
  },
  container: {
    flex: 1,
    padding: 20,
  },

  /* ===== HEADER ===== */
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  /* ===== CARD ===== */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  /* ===== USER INFO ===== */
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  edit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D74FF",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
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

  /* ===== BUTTON ===== */
  btn: {
    flex: 1,
    paddingVertical: 12,
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
    color: "#FFFFFF",
    fontWeight: "700",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "600",
  },

  /* ===== FEATURES ===== */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  featureItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },

  featureText: {
    fontSize: 15,
    color: "#111827",
  },

  arrow: {
    fontSize: 20,
    color: "#9CA3AF",
  },

  /* ===== COMING SOON ===== */
  disabledItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#9CA3AF",
  },
  comingSoon: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2D74FF",
  },

  /* ===== BRAND ===== */
  brandCard: {
    marginTop: 12,
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2D74FF",
    marginBottom: 6,
  },
  brandText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },

  /* ===== FOOTER ===== */
  footer: {
    marginTop: "auto",
    alignItems: "center",
    marginBottom: 30,
  },
  version: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Điều khoản dịch vụ</Text>

          <Text style={styles.text}>
            Chào mừng bạn đến với Smart Coin. Vui lòng đọc kỹ các điều khoản dịch vụ
            dưới đây trước khi sử dụng ứng dụng.
          </Text>

          <Text style={styles.text}>
            Khi cài đặt và sử dụng Smart Coin, bạn được xem là đã đọc, hiểu và đồng ý
            với toàn bộ các điều khoản được nêu trong tài liệu này.
          </Text>

          <Text style={styles.text}>
            <Text style={{ fontWeight: "700" }}>1. Mục đích sử dụng</Text>
          </Text>
          <Text style={styles.bullet}>
            • Smart Coin là ứng dụng hỗ trợ quản lý thu chi và tài chính cá nhân.
          </Text>
          <Text style={styles.bullet}>
            • Ứng dụng không phải là công cụ tư vấn tài chính, đầu tư hoặc pháp lý.
          </Text>

          <Text style={styles.text}>
            <Text style={{ fontWeight: "700" }}>2. Dữ liệu người dùng</Text>
          </Text>
          <Text style={styles.bullet}>
            • Tất cả dữ liệu (giao dịch, danh mục, thông tin người dùng) được lưu trữ cục bộ
            trên thiết bị của bạn.
          </Text>
          <Text style={styles.bullet}>
            • Smart Coin không thu thập, không gửi và không lưu trữ dữ liệu cá nhân trên máy chủ.
          </Text>
          <Text style={styles.bullet}>
            • Người dùng hoàn toàn chịu trách nhiệm đối với việc sao lưu và bảo quản dữ liệu.
          </Text>

          <Text style={styles.text}>
            <Text style={{ fontWeight: "700" }}>3. Quyền và trách nhiệm của người dùng</Text>
          </Text>
          <Text style={styles.bullet}>
            • Người dùng chịu trách nhiệm về tính chính xác của dữ liệu đã nhập.
          </Text>
          <Text style={styles.bullet}>
            • Không sử dụng ứng dụng cho các mục đích vi phạm pháp luật.
          </Text>
          <Text style={styles.bullet}>
            • Không can thiệp, chỉnh sửa hoặc khai thác trái phép mã nguồn ứng dụng.
          </Text>

          <Text style={styles.text}>
            <Text style={{ fontWeight: "700" }}>4. Giới hạn trách nhiệm</Text>
          </Text>
          <Text style={styles.bullet}>
            • Smart Coin không chịu trách nhiệm cho bất kỳ tổn thất tài chính nào phát sinh
            từ việc sử dụng ứng dụng.
          </Text>
          <Text style={styles.bullet}>
            • Mọi quyết định chi tiêu, tiết kiệm hay đầu tư là trách nhiệm cá nhân của người dùng.
          </Text>

          <Text style={styles.text}>
            <Text style={{ fontWeight: "700" }}>5. Thay đổi và cập nhật</Text>
          </Text>
          <Text style={styles.bullet}>
            • Chúng tôi có thể cập nhật, thay đổi điều khoản dịch vụ bất kỳ lúc nào.
          </Text>
          <Text style={styles.bullet}>
            • Phiên bản mới nhất của điều khoản sẽ được hiển thị trực tiếp trong ứng dụng.
          </Text>

          <Text style={styles.text}>
            Việc tiếp tục sử dụng Smart Coin sau khi điều khoản được cập nhật đồng nghĩa
            với việc bạn chấp nhận các thay đổi đó.
          </Text>

          <Text style={styles.footer}>
            Smart Coin © 2025
          </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F6FA",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 10,
  },
  bullet: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
  },
});

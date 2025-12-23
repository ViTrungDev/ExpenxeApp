import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Quyền riêng tư & bảo mật</Text>
        <Text style={styles.text}>
          Smart Coin cam kết tôn trọng và bảo vệ quyền riêng tư của người dùng.
          Chúng tôi hiểu rằng dữ liệu tài chính cá nhân là thông tin nhạy cảm,
          vì vậy việc bảo mật và minh bạch trong cách xử lý dữ liệu luôn được
          đặt lên hàng đầu.
        </Text>

        <Text style={styles.text}>
          <Text style={{ fontWeight: "700" }}>1. Thu thập thông tin</Text>
        </Text>
        <Text style={styles.bullet}>
          • Smart Coin không yêu cầu người dùng tạo tài khoản trực tuyến.
        </Text>
        <Text style={styles.bullet}>
          • Ứng dụng không thu thập thông tin cá nhân như số điện thoại, email,
          vị trí hay danh bạ.
        </Text>
        <Text style={styles.bullet}>
          • Không có bất kỳ dữ liệu nào được gửi tới máy chủ bên ngoài.
        </Text>

        <Text style={styles.text}>
          <Text style={{ fontWeight: "700" }}>2. Lưu trữ dữ liệu</Text>
        </Text>
        <Text style={styles.bullet}>
          • Tất cả dữ liệu chi tiêu, thu nhập và thông tin người dùng được lưu
          cục bộ trên thiết bị của bạn.
        </Text>
        <Text style={styles.bullet}>
          • Smart Coin không đồng bộ dữ liệu lên đám mây ở phiên bản hiện tại.
        </Text>
        <Text style={styles.bullet}>
          • Việc xóa ứng dụng có thể dẫn đến mất toàn bộ dữ liệu nếu bạn không
          sao lưu trước đó.
        </Text>

        <Text style={styles.text}>
          <Text style={{ fontWeight: "700" }}>3. Quyền kiểm soát của người dùng</Text>
        </Text>
        <Text style={styles.bullet}>
          • Người dùng có toàn quyền chỉnh sửa, cập nhật hoặc xóa dữ liệu trong ứng dụng.
        </Text>
        <Text style={styles.bullet}>
          • Bạn có thể thay đổi tên hiển thị bất kỳ lúc nào trong phần Tài khoản.
        </Text>

        <Text style={styles.text}>
          <Text style={{ fontWeight: "700" }}>4. Bảo mật dữ liệu</Text>
        </Text>
        <Text style={styles.bullet}>
          • Smart Coin không truy cập dữ liệu ngoài phạm vi ứng dụng.
        </Text>
        <Text style={styles.bullet}>
          • Mức độ an toàn của dữ liệu phụ thuộc vào bảo mật thiết bị cá nhân của bạn.
        </Text>
        <Text style={styles.bullet}>
          • Chúng tôi khuyến nghị người dùng đặt mật khẩu hoặc bảo mật sinh trắc học cho thiết bị.
        </Text>

        <Text style={styles.text}>
          <Text style={{ fontWeight: "700" }}>5. Thay đổi chính sách</Text>
        </Text>
        <Text style={styles.bullet}>
          • Chính sách quyền riêng tư có thể được cập nhật trong các phiên bản sau.
        </Text>
        <Text style={styles.bullet}>
          • Mọi thay đổi quan trọng sẽ được thông báo trong ứng dụng.
        </Text>

        <Text style={styles.text}>
          Việc tiếp tục sử dụng Smart Coin đồng nghĩa với việc bạn đã đọc, hiểu
          và đồng ý với chính sách quyền riêng tư & bảo mật dữ liệu này.
        </Text>

        <Text style={styles.footer}>
          Smart Coin © 2025
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F6FA" },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16 },
  text: { fontSize: 14, color: "#374151", lineHeight: 20, marginBottom: 10 },
  bullet: { fontSize: 14, color: "#374151", marginBottom: 6 },
  footer: { marginTop: 30, textAlign: "center", color: "#9CA3AF", fontSize: 12 },
});

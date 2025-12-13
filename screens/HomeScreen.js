import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const remainingBudget = 12450000;
  const totalBudget = 25000000;
    const getGreeting = ()=>{
    const hour = new Date().getHours();
    if(hour >= 5 && hour <11) return "Chào buổi sáng"
    else if(hour >=11 && hour <13 ) return " Chào buổi trưa"
    else if(hour >=13 && hour <18 ) return "Chào buổi chiều"
    return "Chào buổi tối"
  }
  const [greeting, setGreeting] = useState(getGreeting());


  const [categories, setCategories] = useState([
    { name: "Ăn uống", percentage: 60, color: "#2CD9C5" },
    { name: "Di chuyển", percentage: 25, color: "#FFB84C" },
    { name: "Mua sắm", percentage: 15, color: "#4D7CFE" },
    { name: "Khác", percentage: 10, color: "#D9D9D9" },
  ]);

  const pieData = (categories || [])
    .filter((item) => item && typeof item === "object")
    .map((item, idx) => ({
      name: item.name || `Mục ${idx + 1}`,
      population:
        typeof item.percentage === "number" && !isNaN(item.percentage)
          ? item.percentage
          : 0,
      color: item.color || "#999999",
      legendFontColor: "#4A4A4A",
      legendFontSize: 12,
    }))
    .filter((d) => d.population > 0);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(45,116,255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>{greeting}</Text>
            <Text style={styles.username}>Bạn</Text>
          </View>
          <View style={styles.headerIcons}>
            <Text style={styles.icon}>🔔</Text>
            <Text style={[styles.icon, { marginLeft: 10 }]}>⚙️</Text>
          </View>
        </View>

        {/* Remaining Budget Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ngân sách còn lại</Text>
          <Text style={styles.budgetText}>
            ₫{remainingBudget.toLocaleString()}
            <Text style={styles.totalBudget}>
              {" "}
              / ₫{totalBudget.toLocaleString()}
            </Text>
          </Text>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressBar,
                { width: `${(remainingBudget / totalBudget) * 100}%` },
              ]}
            />
          </View>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Lương hàng tháng</Text>
              <Text style={styles.infoValue}>₫25,000,000</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Tiết kiệm dự đoán</Text>
              <Text style={styles.infoValue}>₫5,500,000</Text>
            </View>
          </View>
        </View>

        {/* Spending Alert */}
        <View style={styles.alertCard}>
          <Text style={styles.alertIcon}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Cảnh báo chi tiêu</Text>
            <Text style={styles.alertText}>
              Bạn đã sử dụng 85% ngân sách cho mục “Ăn uống”.
            </Text>
          </View>
          <Text style={styles.closeBtn}>✖</Text>
        </View>

        {/* Spending Chart Title */}
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Biểu đồ chi tiêu</Text>
          <View style={styles.switchTab}>
            <Text style={styles.activeTab}>Tháng này</Text>
            <Text style={styles.inactiveTab}>Tháng trước</Text>
          </View>
        </View>

        {/* Pie Chart */}
        {pieData && pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={Math.max(width, 320)}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            chartConfig={chartConfig}
            absolute={false}
          />
        ) : (
          <View style={{ height: 220, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#999" }}>Không có dữ liệu</Text>
          </View>
        )}

        {/* Category Legend */}
        <View style={styles.legendContainer}>
          {(categories || []).map((item) => {
            if (!item) return null;
            return (
              <View key={item.name || Math.random()} style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color || "#999" }]}
                />
                <Text style={styles.legendLabel}>{item.name}</Text>
                <Text style={styles.legendPercent}>
                  {item.percentage ? `${item.percentage}%` : "-"}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={{ height: 30 }} />
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  welcome: {
    fontSize: 16,
    color: "#666",
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    fontSize: 22,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D74FF",
  },
  totalBudget: {
    fontSize: 16,
    color: "#999",
  },
  progressBackground: {
    marginTop: 10,
    backgroundColor: "#E6ECF5",
    height: 8,
    width: "100%",
    borderRadius: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#2D74FF",
    borderRadius: 10,
  },
  infoRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  alertCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3D9",
    padding: 15,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center",
  },
  alertIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#C68C1E",
  },
  alertText: {
    fontSize: 14,
    color: "#6A5F50",
  },
  closeBtn: {
    fontSize: 20,
    color: "#9A8F78",
  },
  chartHeader: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  switchTab: {
    flexDirection: "row",
  },
  activeTab: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: "700",
  },
  inactiveTab: {
    marginLeft: 10,
    color: "#999",
    alignSelf: "center",
  },
  legendContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
  legendPercent: {
    fontSize: 14,
    fontWeight: "600",
  },
});

import { Icon, Layout, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import useAuth from "../../hooks/useAuth";
import { getDashboard } from "../../services/shannahApi";
import * as theme from "../../theme.json";

function StatCard({ icon, label, value, color }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Icon name={icon} pack="assets" width={28} height={28} style={{ tintColor: color }} />
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value ?? "—"}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const result = await getDashboard(token);
      setStats(result?.data ?? null);
      setLoading(false);
    })();
  }, [token]);

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Layout style={{ ...styles.container, paddingTop: insets?.top }}>
          <View style={styles.header}>
            <Text category="h2" style={styles.headerTitle}>
              لوحة التحكم
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={theme["color-primary-500"]}
                style={styles.loader}
              />
            ) : (
              <View style={styles.statsGrid}>
                <StatCard
                  icon="receipt"
                  label="الطلبات الجديدة"
                  value={stats?.pending_orders}
                  color={theme["color-warning-500"] ?? "#F59E0B"}
                />
                <StatCard
                  icon="clock"
                  label="قيد التنفيذ"
                  value={stats?.processing_orders}
                  color={theme["color-primary-500"]}
                />
                <StatCard
                  icon="shoppingBag"
                  label="مكتملة اليوم"
                  value={stats?.completed_today}
                  color={theme["color-success-500"]}
                />
                <StatCard
                  icon="wallet"
                  label="إيرادات اليوم"
                  value={
                    stats?.revenue_today != null
                      ? `${stats.revenue_today} ر.س`
                      : "—"
                  }
                  color={theme["color-success-600"]}
                />
                <StatCard
                  icon="star"
                  label="التقييم"
                  value={
                    stats?.rating != null
                      ? `${stats.rating} / 5`
                      : "—"
                  }
                  color={theme["color-warning-500"] ?? "#F59E0B"}
                />
                <StatCard
                  icon="bankNote"
                  label="إجمالي الإيرادات"
                  value={
                    stats?.total_revenue != null
                      ? `${stats.total_revenue} ر.س`
                      : "—"
                  }
                  color={theme["color-primary-600"]}
                />
              </View>
            )}
          </ScrollView>
        </Layout>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: theme["color-primary-75"] ?? theme["color-primary-100"],
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontFamily: "TajawalBold",
    color: theme["color-primary-500"],
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  loader: {
    marginTop: 60,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: theme["color-basic-100"],
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statInfo: { gap: 2 },
  statValue: {
    fontFamily: "TajawalBold",
    fontSize: 20,
    color: theme["color-black"],
  },
  statLabel: {
    fontFamily: "Tajawal",
    fontSize: 14,
    color: theme["text-body-color"],
  },
});

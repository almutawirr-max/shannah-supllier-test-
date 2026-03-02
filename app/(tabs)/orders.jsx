import { Layout, Text } from "@ui-kitten/components";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import useAuth from "../../hooks/useAuth";
import { getOrders } from "../../services/shannahApi";
import * as theme from "../../theme.json";

const STATUS_TABS = [
  { key: null, label: "الكل" },
  { key: "pending", label: "جديد" },
  { key: "processing", label: "قيد التنفيذ" },
  { key: "completed", label: "مكتمل" },
  { key: "cancelled", label: "ملغي" },
];

const STATUS_COLORS = {
  pending: { bg: "#FEF3C7", text: "#92400E", label: "جديد" },
  processing: { bg: theme["color-primary-transparent-100"], text: theme["color-primary-600"], label: "قيد التنفيذ" },
  completed: { bg: "#D1FAE5", text: "#065F46", label: "مكتمل" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B", label: "ملغي" },
};

function OrderCard({ order }) {
  const status = STATUS_COLORS[order.status] ?? { bg: "#F3F4F6", text: "#374151", label: order.status };

  return (
    <Pressable
      style={styles.orderCard}
      onPress={() => router.push(`/order/${order.id}`)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>طلب #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.text }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.orderMeta}>
        <Text style={styles.orderMetaText}>
          {order.customer_name ?? order.user?.name ?? "عميل"}
        </Text>
        <Text style={styles.orderMetaText}>
          {order.items_count ?? order.items?.length ?? 0} منتج
        </Text>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>
          {order.total} ر.س
        </Text>
        <Text style={styles.orderDate}>
          {order.created_at
            ? new Date(order.created_at).toLocaleDateString("ar-SA")
            : ""}
        </Text>
      </View>
    </Pressable>
  );
}

export default function OrdersScreen() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      const result = await getOrders(token, activeTab);
      setOrders(result?.data ?? []);
      setLoading(false);
    })();
  }, [token, activeTab]);

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Layout style={{ ...styles.container, paddingTop: insets?.top }}>
          <View style={styles.header}>
            <Text category="h2" style={styles.headerTitle}>
              الطلبات
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScrollView}
            contentContainerStyle={styles.tabsContainer}
          >
            {STATUS_TABS.map((tab) => (
              <Pressable
                key={String(tab.key)}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tab,
                  activeTab === tab.key && styles.tabActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView contentContainerStyle={styles.listContent}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={theme["color-primary-500"]}
                style={styles.loader}
              />
            ) : orders.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>لا توجد طلبات</Text>
              </View>
            ) : (
              orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
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
  tabsScrollView: { maxHeight: 52 },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: theme["color-gray-modern-100"] ?? "#F3F4F6",
  },
  tabActive: {
    backgroundColor: theme["color-primary-500"],
  },
  tabText: {
    fontFamily: "TajawalMedium",
    fontSize: 14,
    color: theme["color-black"],
  },
  tabTextActive: {
    color: "#FFF",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  loader: { marginTop: 60 },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontFamily: "TajawalMedium",
    fontSize: 16,
    color: theme["text-body-color"],
  },
  orderCard: {
    backgroundColor: theme["color-basic-100"],
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontFamily: "TajawalBold",
    fontSize: 16,
    color: theme["color-black"],
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: "TajawalMedium",
    fontSize: 12,
  },
  orderMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderMetaText: {
    fontFamily: "Tajawal",
    fontSize: 14,
    color: theme["text-body-color"],
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme["color-gray"] ?? "#E5E7EB",
    paddingTop: 10,
  },
  orderTotal: {
    fontFamily: "TajawalBold",
    fontSize: 16,
    color: theme["color-primary-500"],
  },
  orderDate: {
    fontFamily: "Tajawal",
    fontSize: 13,
    color: theme["text-body-color"],
  },
});

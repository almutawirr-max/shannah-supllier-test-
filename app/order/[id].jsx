import { Button, Layout, Text } from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import useAuth from "../../hooks/useAuth";
import { getOrder, updateOrderStatus } from "../../services/shannahApi";
import * as theme from "../../theme.json";

const STATUS_LABELS = {
  pending: "جديد",
  processing: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const STATUS_COLORS = {
  pending: { bg: "#FEF3C7", text: "#92400E" },
  processing: { bg: theme["color-primary-transparent-100"], text: theme["color-primary-600"] },
  completed: { bg: "#D1FAE5", text: "#065F46" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B" },
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    (async () => {
      const result = await getOrder(token, id);
      setOrder(result?.data ?? null);
      setLoading(false);
    })();
  }, [token, id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    const result = await updateOrderStatus(token, id, newStatus);
    if (result?.data) {
      setOrder(result.data);
    } else if (result?.status !== false) {
      setOrder((prev) => ({ ...prev, status: newStatus }));
    }
    setUpdating(false);
  };

  const statusStyle = order ? (STATUS_COLORS[order.status] ?? { bg: "#F3F4F6", text: "#374151" }) : {};

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Layout
          style={{ ...styles.container, paddingTop: insets?.top, paddingBottom: insets?.bottom }}
        >
          {loading ? (
            <ActivityIndicator
              size="large"
              color={theme["color-primary-500"]}
              style={styles.loader}
            />
          ) : !order ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>الطلب غير موجود</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* Header */}
              <View style={styles.card}>
                <View style={styles.orderHeaderRow}>
                  <Text style={styles.orderTitle}>طلب #{order.id}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusStyle.bg },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.orderDate}>
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString("ar-SA")
                    : ""}
                </Text>
              </View>

              {/* Customer Info */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>بيانات العميل</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>الاسم</Text>
                  <Text style={styles.infoValue}>
                    {order.customer_name ?? order.user?.name ?? "—"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>الهاتف</Text>
                  <Text style={styles.infoValue}>
                    {order.customer_phone ?? order.user?.phone ?? "—"}
                  </Text>
                </View>
                {order.delivery_address && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>عنوان التوصيل</Text>
                    <Text style={styles.infoValue}>
                      {order.delivery_address}
                    </Text>
                  </View>
                )}
              </View>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>المنتجات</Text>
                  {order.items.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <View style={styles.orderItemInfo}>
                        <Text style={styles.orderItemName}>
                          {item.product_name ?? item.name ?? "منتج"}
                        </Text>
                        {item.notes ? (
                          <Text style={styles.orderItemNotes}>{item.notes}</Text>
                        ) : null}
                      </View>
                      <View style={styles.orderItemRight}>
                        <Text style={styles.orderItemQty}>x{item.quantity}</Text>
                        <Text style={styles.orderItemPrice}>
                          {item.total ?? item.price} ر.س
                        </Text>
                      </View>
                    </View>
                  ))}
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>الإجمالي</Text>
                    <Text style={styles.totalValue}>{order.total} ر.س</Text>
                  </View>
                </View>
              )}

              {/* Actions */}
              {order.status === "pending" && (
                <View style={styles.actionsCard}>
                  <Button
                    style={styles.acceptButton}
                    onPress={() => handleStatusUpdate("processing")}
                    disabled={updating}
                  >
                    {updating ? "جاري التحديث..." : "قبول الطلب"}
                  </Button>
                  <Button
                    appearance="outline"
                    status="danger"
                    style={styles.rejectButton}
                    onPress={() => handleStatusUpdate("cancelled")}
                    disabled={updating}
                  >
                    رفض الطلب
                  </Button>
                </View>
              )}

              {order.status === "processing" && (
                <View style={styles.actionsCard}>
                  <Button
                    status="success"
                    style={styles.acceptButton}
                    onPress={() => handleStatusUpdate("completed")}
                    disabled={updating}
                  >
                    {updating ? "جاري التحديث..." : "تأكيد الاستلام"}
                  </Button>
                </View>
              )}
            </ScrollView>
          )}
        </Layout>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { marginTop: 80 },
  centerContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontFamily: "TajawalMedium", fontSize: 16, color: theme["text-body-color"] },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 32 },
  card: {
    backgroundColor: theme["color-basic-100"],
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTitle: {
    fontFamily: "TajawalBold",
    fontSize: 18,
    color: theme["color-black"],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: "TajawalMedium",
    fontSize: 13,
  },
  orderDate: {
    fontFamily: "Tajawal",
    fontSize: 13,
    color: theme["text-body-color"],
  },
  sectionTitle: {
    fontFamily: "TajawalBold",
    fontSize: 15,
    color: theme["color-black"],
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme["color-gray"] ?? "#E5E7EB",
  },
  infoLabel: {
    fontFamily: "TajawalMedium",
    fontSize: 14,
    color: theme["text-body-color"],
  },
  infoValue: {
    fontFamily: "Tajawal",
    fontSize: 14,
    color: theme["color-black"],
    textAlign: "left",
    flex: 1,
    marginLeft: 8,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme["color-gray"] ?? "#E5E7EB",
  },
  orderItemInfo: { flex: 1, gap: 2 },
  orderItemName: {
    fontFamily: "TajawalMedium",
    fontSize: 14,
    color: theme["color-black"],
  },
  orderItemNotes: {
    fontFamily: "Tajawal",
    fontSize: 12,
    color: theme["text-body-color"],
  },
  orderItemRight: { alignItems: "flex-end", gap: 4 },
  orderItemQty: {
    fontFamily: "TajawalMedium",
    fontSize: 13,
    color: theme["text-body-color"],
  },
  orderItemPrice: {
    fontFamily: "TajawalBold",
    fontSize: 14,
    color: theme["color-primary-500"],
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  totalLabel: {
    fontFamily: "TajawalBold",
    fontSize: 15,
    color: theme["color-black"],
  },
  totalValue: {
    fontFamily: "TajawalBold",
    fontSize: 15,
    color: theme["color-primary-500"],
  },
  actionsCard: {
    gap: 10,
  },
  acceptButton: { borderRadius: 12 },
  rejectButton: { borderRadius: 12 },
});

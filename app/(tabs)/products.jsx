import { Button, Icon, Layout, Text } from "@ui-kitten/components";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import useAuth from "../../hooks/useAuth";
import { deleteProduct, getProducts } from "../../services/shannahApi";
import * as theme from "../../theme.json";

function ProductCard({ product, onDelete }) {
  const handleDelete = () => {
    Alert.alert("حذف المنتج", `هل تريد حذف "${product.name}"؟`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: () => onDelete(product.id),
      },
    ]);
  };

  return (
    <View style={styles.productCard}>
      {product.image ? (
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.productImage, styles.productImagePlaceholder]}>
          <Icon
            name="shoppingBag"
            pack="assets"
            width={32}
            height={32}
            style={{ tintColor: theme["color-primary-300"] }}
          />
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>{product.price} ر.س</Text>
        {product.type && (
          <Text style={styles.productType}>{product.type}</Text>
        )}
      </View>

      <View style={styles.productActions}>
        <Pressable
          style={styles.actionButton}
          onPress={() =>
            router.push({ pathname: "/product/form", params: { id: product.id } })
          }
        >
          <Icon
            name="edit"
            pack="assets"
            width={20}
            height={20}
            style={{ tintColor: theme["color-primary-500"] }}
          />
        </Pressable>
        <Pressable style={styles.actionButton} onPress={handleDelete}>
          <Icon
            name="trash"
            pack="assets"
            width={20}
            height={20}
            style={{ tintColor: "#EF4444" }}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function ProductsScreen() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    if (!token) return;
    setLoading(true);
    const result = await getProducts(token);
    setProducts(result?.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [token]);

  const handleDelete = async (id) => {
    await deleteProduct(token, id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Layout style={{ ...styles.container, paddingTop: insets?.top }}>
          <View style={styles.header}>
            <Text category="h2" style={styles.headerTitle}>
              المنتجات
            </Text>
            <Button
              size="small"
              style={styles.addButton}
              accessoryLeft={(props) => (
                <Icon {...props} name="plus" pack="assets" width={18} height={18} />
              )}
              onPress={() => router.push("/product/form")}
            >
              إضافة
            </Button>
          </View>

          <ScrollView contentContainerStyle={styles.listContent}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={theme["color-primary-500"]}
                style={styles.loader}
              />
            ) : products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon
                  name="shoppingBag"
                  pack="assets"
                  width={56}
                  height={56}
                  style={{ tintColor: theme["color-primary-200"] }}
                />
                <Text style={styles.emptyText}>لا توجد منتجات بعد</Text>
                <Button
                  onPress={() => router.push("/product/form")}
                  style={styles.emptyButton}
                >
                  أضف أول منتج
                </Button>
              </View>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "TajawalBold",
    color: theme["color-primary-500"],
  },
  addButton: { borderRadius: 10 },
  listContent: {
    padding: 16,
    gap: 12,
  },
  loader: { marginTop: 60 },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    gap: 16,
  },
  emptyText: {
    fontFamily: "TajawalMedium",
    fontSize: 16,
    color: theme["text-body-color"],
  },
  emptyButton: { borderRadius: 12 },
  productCard: {
    flexDirection: "row",
    backgroundColor: theme["color-basic-100"],
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 88,
    height: 88,
  },
  productImagePlaceholder: {
    backgroundColor: theme["color-primary-transparent-100"],
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    padding: 12,
    gap: 4,
    justifyContent: "center",
  },
  productName: {
    fontFamily: "TajawalMedium",
    fontSize: 15,
    color: theme["color-black"],
  },
  productPrice: {
    fontFamily: "TajawalBold",
    fontSize: 15,
    color: theme["color-primary-500"],
  },
  productType: {
    fontFamily: "Tajawal",
    fontSize: 12,
    color: theme["text-body-color"],
  },
  productActions: {
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
});

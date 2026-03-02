import { Button, Input, Layout, Select, SelectItem, Text } from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import useAuth from "../../hooks/useAuth";
import {
  createProduct,
  getProduct,
  updateProduct,
} from "../../services/shannahApi";
import * as theme from "../../theme.json";

const PRODUCT_TYPES = ["meal", "banquet", "market"];
const PRODUCT_TYPE_LABELS = { meal: "وجبات", banquet: "ولائم", market: "ماركت" };

export default function ProductFormScreen() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(null);

  useEffect(() => {
    if (!isEditing || !token) return;
    (async () => {
      const result = await getProduct(token, id);
      const product = result?.data;
      if (product) {
        setName(product.name ?? "");
        setNameAr(product.name_ar ?? product.name ?? "");
        setDescription(product.description ?? "");
        setPrice(String(product.price ?? ""));
        const typeIdx = PRODUCT_TYPES.indexOf(product.type);
        if (typeIdx >= 0) setSelectedTypeIndex({ row: typeIdx });
      }
      setLoading(false);
    })();
  }, [token, id]);

  const validate = () => {
    const errs = {};
    if (!nameAr.trim()) errs.nameAr = "اسم المنتج مطلوب";
    if (!price.trim() || isNaN(Number(price))) errs.price = "السعر مطلوب وصحيح";
    if (!selectedTypeIndex) errs.type = "نوع المنتج مطلوب";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    const data = {
      name: nameAr.trim(),
      name_ar: nameAr.trim(),
      description: description.trim(),
      price: Number(price),
      type: PRODUCT_TYPES[selectedTypeIndex.row],
    };

    const result = isEditing
      ? await updateProduct(token, id, data)
      : await createProduct(token, data);

    setSaving(false);

    if (result?.status === false) {
      if (result.errors) {
        setErrors(result.errors);
      }
      return;
    }

    router.back();
  };

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Layout
          style={{ ...styles.container, paddingBottom: insets?.bottom + 16 }}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={theme["color-primary-500"]}
                  style={styles.loader}
                />
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>اسم المنتج</Text>
                    <Input
                      value={nameAr}
                      onChangeText={setNameAr}
                      textStyle={styles.inputText}
                      status={errors.nameAr ? "danger" : "basic"}
                      caption={errors.nameAr}
                      placeholder="مثال: كبسة دجاج"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>الوصف</Text>
                    <Input
                      value={description}
                      onChangeText={setDescription}
                      textStyle={styles.inputText}
                      multiline
                      numberOfLines={3}
                      placeholder="وصف مختصر للمنتج..."
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>السعر (ر.س)</Text>
                    <Input
                      value={price}
                      onChangeText={setPrice}
                      keyboardType="numeric"
                      textStyle={styles.inputText}
                      status={errors.price ? "danger" : "basic"}
                      caption={errors.price}
                      placeholder="0.00"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>نوع المنتج</Text>
                    <Select
                      selectedIndex={selectedTypeIndex}
                      onSelect={(index) => setSelectedTypeIndex(index)}
                      value={
                        selectedTypeIndex
                          ? PRODUCT_TYPE_LABELS[PRODUCT_TYPES[selectedTypeIndex.row]]
                          : "اختر النوع"
                      }
                      status={errors.type ? "danger" : "basic"}
                      caption={errors.type}
                    >
                      {PRODUCT_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          title={PRODUCT_TYPE_LABELS[type]}
                        />
                      ))}
                    </Select>
                  </View>

                  <Button
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={saving}
                  >
                    {saving ? "جاري الحفظ..." : isEditing ? "حفظ التعديلات" : "إضافة المنتج"}
                  </Button>

                  <Button
                    appearance="ghost"
                    status="basic"
                    onPress={() => router.back()}
                    disabled={saving}
                  >
                    إلغاء
                  </Button>
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </Layout>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 40 },
  loader: { marginTop: 60 },
  inputGroup: { gap: 6 },
  label: {
    fontFamily: "TajawalMedium",
    fontSize: 14,
    color: theme["color-black"],
  },
  inputText: {
    fontFamily: "Tajawal",
    fontSize: 16,
  },
  saveButton: { borderRadius: 12, marginTop: 8 },
});

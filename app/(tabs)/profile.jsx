import { Icon, Layout, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { useGlobal } from "../../context/GlobalContext";
import useAuth from "../../hooks/useAuth";
import { getSupplierMe } from "../../services/shannahApi";
import * as theme from "../../theme.json";

function MenuItem({ icon, label, onPress, danger }) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Icon
        name={icon}
        pack="assets"
        width={22}
        height={22}
        style={{ tintColor: danger ? "#EF4444" : theme["color-primary-500"] }}
      />
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
        {label}
      </Text>
      <Icon
        name="chevronLeft"
        pack="assets"
        width={18}
        height={18}
        style={{ tintColor: theme["text-body-color"], marginRight: "auto" }}
      />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { signOut } = useGlobal();
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const result = await getSupplierMe(token);
      setProfile(result?.data ?? null);
      setLoading(false);
    })();
  }, [token]);

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Layout style={{ ...styles.container, paddingTop: insets?.top }}>
          <View style={styles.header}>
            <Text category="h2" style={styles.headerTitle}>
              الملف الشخصي
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
              <>
                <View style={styles.profileCard}>
                  <View style={styles.avatarPlaceholder}>
                    <Icon
                      name="office"
                      pack="assets"
                      width={40}
                      height={40}
                      style={{ tintColor: theme["color-primary-500"] }}
                    />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {profile?.store_name ?? profile?.name ?? "المورد"}
                    </Text>
                    <Text style={styles.profileEmail}>
                      {profile?.email ?? ""}
                    </Text>
                    {profile?.phone && (
                      <Text style={styles.profilePhone}>{profile.phone}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.menuSection}>
                  <MenuItem
                    icon="globe"
                    label="معلومات المتجر"
                    onPress={() => {}}
                  />
                  <MenuItem
                    icon="bell"
                    label="الإشعارات"
                    onPress={() => {}}
                  />
                  <MenuItem
                    icon="helpCircle"
                    label="المساعدة والدعم"
                    onPress={() => {}}
                  />
                  <MenuItem
                    icon="logOut"
                    label="تسجيل الخروج"
                    onPress={signOut}
                    danger
                  />
                </View>
              </>
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
    gap: 16,
  },
  loader: { marginTop: 60 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: theme["color-basic-100"],
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme["color-primary-transparent-100"],
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: { flex: 1, gap: 4 },
  profileName: {
    fontFamily: "TajawalBold",
    fontSize: 18,
    color: theme["color-black"],
  },
  profileEmail: {
    fontFamily: "Tajawal",
    fontSize: 14,
    color: theme["text-body-color"],
  },
  profilePhone: {
    fontFamily: "Tajawal",
    fontSize: 14,
    color: theme["text-body-color"],
  },
  menuSection: {
    backgroundColor: theme["color-basic-100"],
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme["color-gray"] ?? "#E5E7EB",
  },
  menuLabel: {
    flex: 1,
    fontFamily: "TajawalMedium",
    fontSize: 15,
    color: theme["color-black"],
  },
  menuLabelDanger: {
    color: "#EF4444",
  },
});

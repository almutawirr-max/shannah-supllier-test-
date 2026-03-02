import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { router } from "expo-router";
import { setItemAsync } from "expo-secure-store";
import { useState } from "react";
import { Icon } from "@ui-kitten/components";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { useGlobal } from "../context/GlobalContext";
import { login } from "../services/shannahApi";
import * as theme from "../theme.json";

export default function SignInScreen() {
  const { setSignedIn, setUserData } = useGlobal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const eyeIcon = (props) => (
    <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
      <Icon
        {...props}
        name={passwordVisible ? "eyeOff" : "eye"}
        pack="assets"
        width={20}
        height={20}
      />
    </Pressable>
  );

  const handleSignIn = async () => {
    setErrors({});
    if (!email) {
      setErrors((e) => ({ ...e, email: "البريد الإلكتروني مطلوب" }));
      return;
    }
    if (!password) {
      setErrors((e) => ({ ...e, password: "كلمة المرور مطلوبة" }));
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result) return;

    if (result.status === false) {
      setErrors({ general: result.message ?? "بيانات الدخول غير صحيحة" });
      return;
    }

    if (result.token) {
      await setItemAsync("token", result.token);
      await AsyncStorage.setItem("user", JSON.stringify(result.user ?? {}));
      setUserData(result.user ?? {});
      setSignedIn(true);
      router.replace("/(tabs)/dashboard");
    }
  };

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Layout
          style={{
            ...styles.container,
            paddingTop: insets?.top + 32,
            paddingBottom: insets?.bottom + 32,
          }}
        >
          <View style={styles.headerContainer}>
            <Text category="h1" style={styles.title}>
              شنّه للموردين
            </Text>
            <Text style={styles.subtitle}>
              سجّل دخولك لإدارة متجرك وطلباتك
            </Text>
          </View>

          <View style={styles.formContainer}>
            {errors.general && (
              <Text style={styles.errorText}>{errors.general}</Text>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textStyle={styles.inputText}
                status={errors.email ? "danger" : "basic"}
                caption={errors.email}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>كلمة المرور</Text>
              <Input
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                accessoryRight={eyeIcon}
                textStyle={styles.inputText}
                status={errors.password ? "danger" : "basic"}
                caption={errors.password}
              />
            </View>

            <Button
              style={styles.signInButton}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </View>
        </Layout>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 40,
  },
  headerContainer: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: "TajawalExtraBold",
    color: theme["color-primary-500"],
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "TajawalMedium",
    color: theme["text-body-color"],
    textAlign: "center",
    fontSize: 16,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontFamily: "TajawalMedium",
    fontSize: 14,
    color: theme["color-black"],
  },
  inputText: {
    fontFamily: "Tajawal",
    fontSize: 16,
  },
  signInButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  errorText: {
    color: theme["color-danger-500"],
    fontFamily: "TajawalMedium",
    textAlign: "center",
  },
});

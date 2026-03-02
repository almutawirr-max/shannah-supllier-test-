import { Stack } from "expo-router";
import { useGlobal } from "../context/GlobalContext";

export default function StackNavigator() {
  const { signedIn } = useGlobal();

  return (
    <Stack>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Protected guard={signedIn}>
        <Stack.Screen
          name="order/[id]"
          options={{
            title: "تفاصيل الطلب",
            headerTitleStyle: { fontFamily: "TajawalBold" },
          }}
        />
        <Stack.Screen
          name="product/form"
          options={{
            title: "المنتج",
            headerTitleStyle: { fontFamily: "TajawalBold" },
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

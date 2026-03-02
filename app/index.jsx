import { Redirect } from "expo-router";
import { useGlobal } from "../context/GlobalContext";

export default function IndexScreen() {
  const { signedIn } = useGlobal();
  return signedIn ? (
    <Redirect href="/(tabs)/dashboard" />
  ) : (
    <Redirect href="/sign-in" />
  );
}

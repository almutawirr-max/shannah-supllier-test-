import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  Text,
} from "@ui-kitten/components";
import { Tabs } from "expo-router";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import * as theme from "../theme.json";

const { Navigator, Screen } = createBottomTabNavigator();

const dashboardIcon = (props) => (
  <Icon {...props} name="home" pack="assets" width={24} height={24} />
);

const ordersIcon = (props) => (
  <Icon {...props} name="receipt" pack="assets" width={24} height={24} />
);

const productsIcon = (props) => (
  <Icon {...props} name="shoppingBag" pack="assets" width={24} height={24} />
);

const profileIcon = (props) => (
  <Icon {...props} name="user" pack="assets" width={24} height={24} />
);

const tabs = [
  { title: "الرئيسية", route: "dashboard", icon: dashboardIcon },
  { title: "الطلبات", route: "orders", icon: ordersIcon },
  { title: "المنتجات", route: "products", icon: productsIcon },
  { title: "حسابي", route: "profile", icon: profileIcon },
];

const BottomTabBar = ({ navigation, state }) => (
  <SafeAreaInsetsContext.Consumer>
    {(insets) => (
      <BottomNavigation
        appearance="noIndicator"
        selectedIndex={state.index}
        onSelect={(index) => navigation.navigate(state.routeNames[index])}
        style={{
          borderTopWidth: 0.25,
          borderTopColor: theme["color-gray"],
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 21,
          paddingHorizontal: 32,
          paddingTop: 8,
          paddingBottom: 16 + insets.bottom,
        }}
      >
        {tabs.map((tab, index) => (
          <BottomNavigationTab
            key={index}
            title={(evaProps) => (
              <Text
                {...evaProps}
                style={{
                  fontFamily: "TajawalBold",
                  fontSize: 10,
                  color:
                    state.routeNames[state.index] === tab.route
                      ? theme["color-primary-500"]
                      : "#6C7175",
                }}
              >
                {tab.title}
              </Text>
            )}
            icon={tab.icon}
          />
        ))}
      </BottomNavigation>
    )}
  </SafeAreaInsetsContext.Consumer>
);

export const AppNavigator = () => (
  <Tabs tabBar={(props) => <BottomTabBar {...props} />}>
    <Tabs.Screen name="dashboard" options={{ headerShown: false }} />
    <Tabs.Screen
      name="orders"
      options={{
        title: "الطلبات",
        headerTitleStyle: { fontFamily: "TajawalBold" },
        headerShown: false,
      }}
    />
    <Tabs.Screen
      name="products"
      options={{
        title: "المنتجات",
        headerTitleStyle: { fontFamily: "TajawalBold" },
        headerShown: false,
      }}
    />
    <Tabs.Screen name="profile" options={{ headerShown: false }} />
  </Tabs>
);

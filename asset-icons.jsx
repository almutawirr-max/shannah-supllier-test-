import { Image } from "react-native";

const IconProvider = (source) => ({
  toReactElement: ({ animation, ...props }) => (
    <Image {...props} source={source} />
  ),
});

export const AssetIconsPack = {
  name: "assets",
  icons: {
    home: IconProvider(require("./assets/images/icons/home.png")),
    homeOutline: IconProvider(require("./assets/images/icons/home-outline.png")),
    user: IconProvider(require("./assets/images/icons/user.png")),
    eye: IconProvider(require("./assets/images/icons/eye.png")),
    eyeOff: IconProvider(require("./assets/images/icons/eye-off.png")),
    logOut: IconProvider(require("./assets/images/icons/log-out.png")),
    edit: IconProvider(require("./assets/images/icons/edit.png")),
    trash: IconProvider(require("./assets/images/icons/trash.png")),
    plus: IconProvider(require("./assets/images/icons/plus.png")),
    plusCircle: IconProvider(require("./assets/images/icons/plus-circle.png")),
    receipt: IconProvider(require("./assets/images/icons/receipt.png")),
    clock: IconProvider(require("./assets/images/icons/clock.png")),
    sar: IconProvider(require("./assets/images/icons/sar.png")),
    shoppingBag: IconProvider(require("./assets/images/icons/shopping-bag.png")),
    chevronLeft: IconProvider(require("./assets/images/icons/chevron-left.png")),
    arrowRight: IconProvider(require("./assets/images/icons/arrow-right.png")),
    bell: IconProvider(require("./assets/images/icons/bell.png")),
    helpCircle: IconProvider(require("./assets/images/icons/help-circle.png")),
    wallet: IconProvider(require("./assets/images/icons/wallet.png")),
    office: IconProvider(require("./assets/images/icons/office.png")),
    globe: IconProvider(require("./assets/images/icons/globe.png")),
    share: IconProvider(require("./assets/images/icons/share.png")),
    star: IconProvider(require("./assets/images/icons/star.png")),
    bankNote: IconProvider(require("./assets/images/icons/bank-note.png")),
  },
};

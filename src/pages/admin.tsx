import {
  Admin as RAdmin,
  Resource,
  ListGuesser,
  CustomRoutes,
  Layout,
  AppBar,
  RefreshIconButton,
} from "react-admin";
import {
  RAFirebaseOptions,
  FirebaseDataProvider,
  FirebaseAuthProvider,
} from "react-admin-firebase";
import { IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import { CategoryProps } from "../components/category-resource";
import { firebaseConfig } from "../utils/firebase";
import { ItemProps } from "../components/item-resource";
import { OrderProps } from "../components/order-resource";
import { Route } from "react-router-dom";
import { Info } from "../components/info";

const options: RAFirebaseOptions = {
  logging: true,
  persistence: "session",
  lazyLoading: {
    enabled: true,
  },
  watch: ["orders"],
};

const dataProvider = FirebaseDataProvider(firebaseConfig, options);
const authProvider = FirebaseAuthProvider(firebaseConfig, {});

const MyAppBar = () => (
  <AppBar
    toolbar={
      <>
        <RefreshIconButton />
        <IconButton href="/admin/info">
          <SettingsIcon style={{ color: "white" }} />
        </IconButton>
      </>
    }
  />
);

export const MyLayout = (props: any) => <Layout {...props} appBar={MyAppBar} />;

export const Admin = () => {
  return (
    <RAdmin
      layout={MyLayout}
      authProvider={authProvider}
      basename="/admin"
      dataProvider={dataProvider}
    >
      <Resource {...CategoryProps} />
      <Resource {...ItemProps} />
      <Resource {...OrderProps} />
      <CustomRoutes>
        <Route path="/info" element={<Info />} />
      </CustomRoutes>
    </RAdmin>
  );
};

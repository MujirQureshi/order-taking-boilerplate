import { Card } from "@mui/material";
import {
  CheckboxGroupInput,
  SimpleForm,
  TextInput,
  TimeInput,
  useNotify,
} from "react-admin";
import { PAYMENT_METHODS } from "../utils/constants";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useEffect, useState } from "react";

export const Info = () => {
  const notify = useNotify();
  const restaurantRef = doc(db, "restaurant", "info");
  const [defaultValues, setDefaultValues] = useState<any>();

  const handleSubmit = async (data: any) => {
    await setDoc(restaurantRef, data);
    notify(`Restaurant information updated`, { type: "success" });
  };

  const fetchData = async () => {
    const snapshot = await getDoc(restaurantRef);
    setDefaultValues(snapshot.data() || {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!defaultValues) return null;

  return (
    <Card>
      <SimpleForm
        defaultValues={{
          ...defaultValues,
          openingTime: defaultValues.openingTime.toDate(),
          closingTime: defaultValues.closingTime.toDate(),
        }}
        sanitizeEmptyValues
        onSubmit={handleSubmit}
      >
        <TextInput source="name" fullWidth />
        <TextInput source="address" fullWidth />
        <TextInput source="phone" fullWidth />
        <TimeInput source="openingTime" fullWidth />
        <TimeInput source="closingTime" fullWidth />
        <CheckboxGroupInput source="paymentMethods" choices={PAYMENT_METHODS} />
      </SimpleForm>
    </Card>
  );
};

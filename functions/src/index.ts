import * as admin from "firebase-admin";
import {onCall, HttpsError} from "firebase-functions/v2/https";
// @ts-ignore
import {createTransport} from "nodemailer";
import {
  calculateOrderTotal,
  calculateOrderSubtotal,
} from "./utils/calculations";

admin.initializeApp();

const transport = createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "44a2ffd3eeae9a",
    pass: "21a81aa1d269ea",
  },
});

export const placeorder = onCall(async (request) => {
  if (!request.auth) {
    return new HttpsError("failed-precondition", "You are not authorized");
  }

  const firestore = admin.firestore();
  const lines = request.data.lines;

  const draft = {
    ...request.data,
    status: "pending",
    createdBy: request.auth.uid,
    total: calculateOrderTotal(lines, 13),
    subTotal: calculateOrderSubtotal(lines),
    pickupTime: admin.firestore.FieldValue.serverTimestamp(),
    createAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const order = await firestore.collection("order").add(draft);

  const email = request.data.email;
  const restrauntDoc = await firestore.doc("restraunt/info").get();
  const restraunt = restrauntDoc.data();

  if (restraunt) {
    transport.sendMail({
      to: email,
      subject: `${restraunt.name} - Order: ${order.id}`,
      html: `
        <div>
          <h1>Hi ${draft.firstName}, your order is confirmed.</h1>
          <h2>Restraunt address</h2>
          <p>${restraunt.name}</p>
          <p>${restraunt.address}</p>
          <h2>Order details</h2>
          <ul>
            ${draft.lines.map((line: any) => `
              <li>
              <h3>${line.quantity}x ${line.label}: $${line.price.toFixed(2)}</h3>
              <ul>
                ${line.value.map((value: any) => `
                  <li>
                    ${value.variant}: ${value.value} - $${value.price.toFixed(2)}
                  </li>
                `).join("")}
              </ul>
            `).join("")}
            </li>
          </ul>
          <p>Sub-total: $${draft.subTotal.toFixed(2)}</p>
          <p>Total: $${draft.total.toFixed(2)}</p>
          <h4>If you need help with anything else, do not hesitate to contact us at ${restraunt.phone} immediately.</h4>
        </div>
      `,
    });
  }


  return {id: order.id, order: draft};
});

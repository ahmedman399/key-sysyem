const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");
admin.initializeApp();

exports.getCurrentKey = functions.https.onRequest(async (req, res) => {
  // حساب رقم الفترة الزمنية (كل 12 ساعة)
  const period = Math.floor(Date.now() / 1000 / 43200).toString();

  // جلب أو توليد Key جديد
  const docRef = admin.firestore().collection("dynamicKeys").doc(period);
  let doc = await docRef.get();
  let key;
  if (doc.exists) {
    key = doc.data().key;
  } else {
    // توليد Key عشوائي قوي (مثلاً 16 حرف)
    key = crypto.randomBytes(12).toString("base64").replace(/[^a-zA0-9]/g, '').substr(0, 16);
    await docRef.set({ key, created: admin.firestore.FieldValue.serverTimestamp() });
  }
  res.send(key);
});

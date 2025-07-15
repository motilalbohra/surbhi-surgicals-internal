const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteOldOrders = functions.pubsub
.schedule("every 1 hours") // runs every hour
.timeZone("Asia/Kolkata") // change to your timezone
.onRun(async (context) => {
    const db = admin.firestore();
    const now = Date.now();
    const cutoff = new Date(now - 48 * 60 * 60 * 1000); // 48 hours ago

    const snapshot = await db
    .collection("orders")
    .where("completed", "==", true)
    .where("completedAt", "<", cutoff)
    .get();

    if (snapshot.empty) {
        console.log("No orders to delete.");
        return null;
    }

    const batch = db.batch();
    snapshot.forEach((doc) => {
        console.log(`Deleting order ${doc.id}`);
        batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${snapshot.size} orders.`);
    return null;
});

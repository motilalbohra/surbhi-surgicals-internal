import React, {useEffect, useState} from "react";
import {collection, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp} from "firebase/firestore";
import db from "../firebase";
import {Typography, Paper, List, Button} from "@mui/material";
import OrderItem from "./OrderItem";

const initialPeople = ["Navin", "Upendra", "Kishan", "Rajendra", "Bunty", "Anshita", "Motilal", "Add New"];

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [names, setNames] = useState(initialPeople);
    const [sortNewestFirst, setSortNewestFirst] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(data);
        });
        return () => unsub();
    }, []);

    const handleUpdate = async (id, field, value) => {
        const ref = doc(db, "orders", id);
        await updateDoc(ref, {[field]: value});
    };

    const handleComplete = async (id) => {
        const ref = doc(db, "orders", id);
        await updateDoc(ref, {
            completed: true,
            completedAt: serverTimestamp(),
        });

        setTimeout(async () => {
            try {
                await deleteDoc(ref);
                console.log(`Order ${id} deleted after 48 hours.`);
            } catch (err) {
                console.error("Error deleting order:", err);
            }
        }, 60 * 1000);
    };

    const handleSelectChange = async (id, field, value) => {
        if (value === "Add New") {
            const newName = prompt("Enter new name:");
            if (newName && !names.includes(newName)) {
                const updatedNames = [...names.slice(0, -1), newName, "Add New"];
                setNames(updatedNames);
                await handleUpdate(id, field, newName);
            }
        } else {
            await handleUpdate(id, field, value);
        }
    };

    const sortFn = (a, b) => {
        const dateA = a.timestamp?.toDate?.() || new Date(0);
        const dateB = b.timestamp?.toDate?.() || new Date(0);
        return sortNewestFirst ? dateB - dateA : dateA - dateB;
    };

    const completedOrders = orders.filter((o) => o.completed).sort(sortFn);
    const pendingOrders = orders.filter((o) => !o.completed).sort(sortFn);

    return (
        <Paper sx={{p: {xs: 2, md: 3}}}>
            <Typography variant="h6" gutterBottom>
                Order List
            </Typography>

            <Button variant="outlined" sx={{mb: 2}} onClick={() => setSortNewestFirst((prev) => !prev)}>
                Sort: {sortNewestFirst ? "Newest First" : "Oldest First"}
            </Button>

            <Typography variant="subtitle1" gutterBottom>
                🕗 Pending Orders
            </Typography>
            <List>
                {pendingOrders.map((order) => (
                    <OrderItem
                        key={order.id}
                        order={order}
                        names={names}
                        setNames={setNames}
                        handleUpdate={handleUpdate}
                        handleComplete={handleComplete}
                        handleSelectChange={handleSelectChange}
                    />
                ))}
            </List>

            <Typography variant="subtitle1" gutterBottom>
                ✅ Completed Orders
            </Typography>
            <List>
                {completedOrders.map((order) => (
                    <OrderItem
                        key={order.id}
                        order={order}
                        names={names}
                        setNames={setNames}
                        handleUpdate={handleUpdate}
                        handleComplete={handleComplete}
                        handleSelectChange={handleSelectChange}
                        // user={currentUser} // includes isAdmin or role
                    />
                ))}
            </List>
        </Paper>
    );
}

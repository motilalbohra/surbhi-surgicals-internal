import React, {useEffect, useState} from "react";
import {collection, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp} from "firebase/firestore";
import db from "../firebase";
import {
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    TextField,
    Button,
    MenuItem,
    Grid,
} from "@mui/material";

const initialPeople = ["Navin", "Upendra", "Kishan", "Rajendra", "Bunty", "Anshita", "Motilal"];

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [names, setNames] = useState(initialPeople);

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
        }, 48 * 60 * 60 * 1000);
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

    return (
        <Paper sx={{p: {xs: 2, md: 3}}}>
            <Typography variant="h6" gutterBottom>
                Order List
            </Typography>
            <List>
                {orders.map((order) => {
                    const disabled = order.completed;

                    return (
                        <ListItem key={order.id} divider sx={{flexDirection: "column", alignItems: "stretch"}}>
                            <ListItemText
                                primary={`Party Name: ${order.orderedBy}`}
                                secondary={
                                    <>
                                        <Typography variant="subtitle2">Items:</Typography>
                                        <ul style={{margin: 0, paddingLeft: 20}}>
                                            {order.items?.map((item, index) => (
                                                <li key={index}>
                                                    {item.product} ({item.quantity})
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                }
                            />

                            <Grid container spacing={1} alignItems="center" sx={{mt: 1}}>
                                {/* Packing By */}
                                <Grid item xs={6} sm={4} md={2}>
                                    <TextField
                                        select
                                        label="Packing By"
                                        value={order.takenOutBy || ""}
                                        onChange={(e) => handleSelectChange(order.id, "takenOutBy", e.target.value)}
                                        fullWidth
                                        disabled={disabled}
                                    >
                                        {names.map((name, idx) => (
                                            <MenuItem key={idx} value={name}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item>
                                    <Checkbox
                                        checked={order.takenOutChecked}
                                        disabled={!order.takenOutBy || disabled}
                                        onChange={(e) => handleUpdate(order.id, "takenOutChecked", e.target.checked)}
                                    />
                                </Grid>

                                {/* Delivered By */}
                                <Grid item xs={6} sm={4} md={2}>
                                    <TextField
                                        select
                                        label="Delivered By"
                                        value={order.deliveredBy || ""}
                                        onChange={(e) => handleSelectChange(order.id, "deliveredBy", e.target.value)}
                                        fullWidth
                                        disabled={!order.takenOutChecked || disabled}
                                    >
                                        {names.map((name, idx) => (
                                            <MenuItem key={idx} value={name}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item>
                                    <Checkbox
                                        checked={order.deliveredChecked}
                                        disabled={!order.deliveredBy || disabled}
                                        onChange={(e) => handleUpdate(order.id, "deliveredChecked", e.target.checked)}
                                    />
                                </Grid>

                                {/* Signed Copy */}
                                <Grid item xs={6} sm={4} md={2}>
                                    <TextField label="Signed Copy" value="" disabled fullWidth />
                                </Grid>
                                <Grid item>
                                    <Checkbox
                                        checked={order.signedCopyReceived || false}
                                        disabled={!order.deliveredChecked || disabled}
                                        onChange={(e) => handleUpdate(order.id, "signedCopyReceived", e.target.checked)}
                                    />
                                </Grid>

                                {/* Complete Button */}
                                <Grid item xs={12} sm={6} md={2}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            backgroundColor: order.completed ? "green" : "red",
                                            "&:hover": {
                                                backgroundColor: order.completed ? "green" : "darkred",
                                            },
                                        }}
                                        onClick={() => handleComplete(order.id)}
                                        disabled={
                                            !order.takenOutChecked ||
                                            !order.deliveredChecked ||
                                            !order.signedCopyReceived ||
                                            order.completed
                                        }
                                    >
                                        {order.completed ? "Completed" : "Complete"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
}

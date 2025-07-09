// components/InventoryList.js
import React, {useEffect, useState} from "react";
import {collection, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp} from "firebase/firestore";
import db from "../firebase";
import {List, ListItem, ListItemText, Paper, Typography, Container, Checkbox, IconButton, Box} from "@mui/material";
import {Delete} from "@mui/icons-material";

export default function InventoryList() {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "inventory"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setInventory(data);
        });
        return () => unsub();
    }, []);

    const handleUsedCheck = async (id) => {
        const ref = doc(db, "inventory", id);
        try {
            await updateDoc(ref, {
                used: true,
                usedAt: serverTimestamp(),
            });

            // Schedule deletion after 24 hours (86400000 ms)
            setTimeout(async () => {
                try {
                    await deleteDoc(ref);
                    console.log(`Inventory item ${id} deleted after 24 hours.`);
                } catch (err) {
                    console.error("Error deleting inventory item:", err);
                }
            }, 24 * 60 * 60 * 1000);
        } catch (err) {
            console.error("Error updating inventory item:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "inventory", id));
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{p: 3, mt: 3}}>
                <Typography variant="h6" gutterBottom>
                    Inventory List
                </Typography>
                <List>
                    {inventory.map((item) => (
                        <ListItem key={item.id} divider>
                            <Box sx={{flex: 1}}>
                                <ListItemText primary={item.product} secondary={`Quantity: ${item.quantity}`} />
                            </Box>
                            <Checkbox
                                checked={!!item.used}
                                onChange={() => handleUsedCheck(item.id)}
                                disabled={!!item.used}
                            />
                            <IconButton edge="end" color="error" onClick={() => handleDelete(item.id)}>
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
}

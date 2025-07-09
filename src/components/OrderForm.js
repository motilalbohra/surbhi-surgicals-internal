import React, {useState, useRef} from "react";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";
import db from "../firebase";
import {Box, TextField, Button, Paper, Typography, IconButton, Grid} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";

export default function OrderForm() {
    const [orderedBy, setOrderedBy] = useState("");
    const [items, setItems] = useState([{product: "", quantity: ""}]);
    const productRefs = useRef([]);
    const quantityRefs = useRef([]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems((prev) => [...prev, {product: "", quantity: ""}]);
        setTimeout(() => {
            const nextIndex = items.length;
            productRefs.current[nextIndex]?.focus();
        }, 50);
    };

    const removeItem = (index) => {
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
    };

    const handleSubmit = async () => {
        if (!orderedBy.trim() || items.some((item) => !item.product || !item.quantity)) {
            alert("Please fill all fields before submitting.");
            return;
        }

        await addDoc(collection(db, "orders"), {
            orderedBy,
            items,
            takenOutChecked: false,
            deliveredChecked: false,
            signedCopyReceived: false,
            completed: false,
            timestamp: serverTimestamp(),
        });

        setOrderedBy("");
        setItems([{product: "", quantity: ""}]);
        productRefs.current = [];
        quantityRefs.current = [];
    };

    return (
        <Paper sx={{p: {xs: 2, md: 3}, mb: 4}}>
            <Typography variant="h6" gutterBottom>
                Create New Order
            </Typography>
            <Box component="form" onSubmit={(e) => e.preventDefault()}>
                <TextField
                    label="Party Name"
                    value={orderedBy}
                    onChange={(e) => setOrderedBy(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            productRefs.current[0]?.focus();
                        }
                    }}
                    fullWidth
                    sx={{mb: 2}}
                />

                {items.map((item, index) => (
                    <Grid container spacing={1} key={index} sx={{mb: 1}}>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                label="Product"
                                fullWidth
                                value={item.product}
                                inputRef={(el) => (productRefs.current[index] = el)}
                                onChange={(e) => handleItemChange(index, "product", e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        quantityRefs.current[index]?.focus();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                label="Quantity"
                                type="number"
                                inputProps={{min: 1}}
                                fullWidth
                                value={item.quantity}
                                inputRef={(el) => (quantityRefs.current[index] = el)}
                                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addItem();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={4} sm={3}>
                            <IconButton onClick={() => removeItem(index)} disabled={items.length === 1}>
                                <Delete />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}

                <Button startIcon={<Add />} onClick={addItem} sx={{mb: 2}}>
                    Add Item
                </Button>

                <br />
                <Button variant="contained" type="button" onClick={handleSubmit}>
                    Submit Order
                </Button>
            </Box>
        </Paper>
    );
}

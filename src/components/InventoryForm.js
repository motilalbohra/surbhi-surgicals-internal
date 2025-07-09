// components/InventoryForm.js
import React, {useState} from "react";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";
import db from "../firebase";
import {TextField, Button, Paper, Typography, Box, Container} from "@mui/material";

export default function InventoryForm() {
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!product || !quantity) {
            alert("Please fill all fields");
            return;
        }

        await addDoc(collection(db, "inventory"), {
            product,
            quantity: Number(quantity),
            createdAt: serverTimestamp(),
        });

        setProduct("");
        setQuantity("");
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{p: 3, mt: 3}}>
                <Typography variant="h6" gutterBottom>
                    Add Inventory Item
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Product Name"
                        fullWidth
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        sx={{mb: 2}}
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        inputProps={{min: 1}}
                        fullWidth
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        sx={{mb: 2}}
                    />
                    <Button variant="contained" type="submit">
                        Add to Inventory
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

// OrderItem.jsx
import React from "react";
import {
    ListItem,
    ListItemText,
    Typography,
    TextField,
    MenuItem,
    Checkbox,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import {format} from "date-fns";
import {doc, deleteDoc} from "firebase/firestore"; // ⬅️ Import this
import db from "../firebase"; // ⬅️ Adjust path to your firebase config

export default function OrderItem({order, names, handleSelectChange, handleUpdate, handleComplete}) {
    // Inside component
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await deleteDoc(doc(db, "orders", order.id));
                alert("Order deleted successfully");
            } catch (error) {
                console.error("Error deleting order:", error);
                alert("Failed to delete order");
            }
        }
    };
    const {
        takenOutBy,
        takenOutChecked,
        deliveredBy,
        deliveredChecked,
        signedCopyReceived,
        completed,
        timestamp,
        items,
        orderedBy,
    } = order;

    const disablePackingSelect = takenOutChecked || completed;
    const disablePackingCheck = !takenOutBy || takenOutChecked || completed;

    const disableDeliverySelect = !takenOutChecked || deliveredChecked || completed;
    const disableDeliveryCheck = !deliveredBy || deliveredChecked || completed;

    const disableSignedCopyCheck = !deliveredChecked || signedCopyReceived || completed;

    const canComplete = takenOutChecked && deliveredChecked && signedCopyReceived && !completed;

    return (
        <ListItem divider sx={{flexDirection: "column", alignItems: "stretch"}}>
            <ListItemText
                primary={`Party Name: ${orderedBy}`}
                secondary={
                    <>
                        <Typography variant="subtitle2" sx={{fontSize: "1rem"}}>
                            Order Placed:{" "}
                            {timestamp?.toDate ? format(timestamp.toDate(), "dd MMM yyyy hh:mm a") : "N/A"}
                        </Typography>

                        <Typography variant="subtitle2" sx={{fontSize: "1rem", mt: 1}}>
                            Items:
                        </Typography>

                        <TableContainer component={Paper} sx={{mt: 1}}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Ordered Qty</TableCell>
                                        <TableCell>Available Qty</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.product}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    fullWidth
                                                    inputProps={{
                                                        min: 0,
                                                        max: item.quantity,
                                                    }}
                                                    disabled={completed}
                                                    value={item.available ?? ""}
                                                    onChange={(e) => {
                                                        let value = parseInt(e.target.value);
                                                        if (isNaN(value)) value = "";
                                                        else if (value > item.quantity) value = item.quantity;
                                                        else if (value < 0) value = 0;

                                                        const updatedItems = [...items];
                                                        updatedItems[index].available = value;
                                                        handleUpdate(order.id, "items", updatedItems);
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                }
            />

            <Grid container spacing={1} alignItems="center" sx={{mt: 1}}>
                {/* Packing By */}
                <Grid item xs={6} sm={4} md={2}>
                    <TextField
                        select
                        label="Packing By"
                        value={takenOutBy || ""}
                        onChange={(e) => handleSelectChange(order.id, "takenOutBy", e.target.value)}
                        fullWidth
                        disabled={disablePackingSelect}
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
                        checked={takenOutChecked || false}
                        disabled={disablePackingCheck}
                        onChange={(e) => handleUpdate(order.id, "takenOutChecked", e.target.checked)}
                    />
                </Grid>

                {/* Delivered By */}
                <Grid item xs={6} sm={4} md={2}>
                    <TextField
                        select
                        label="Delivered By"
                        value={deliveredBy || ""}
                        onChange={(e) => handleSelectChange(order.id, "deliveredBy", e.target.value)}
                        fullWidth
                        disabled={disableDeliverySelect}
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
                        checked={deliveredChecked || false}
                        disabled={disableDeliveryCheck}
                        onChange={(e) => handleUpdate(order.id, "deliveredChecked", e.target.checked)}
                    />
                </Grid>

                {/* Signed Copy */}
                <Grid item xs={6} sm={4} md={2}>
                    <TextField label="Signed Copy" value="" disabled fullWidth />
                </Grid>
                <Grid item>
                    <Checkbox
                        checked={signedCopyReceived || false}
                        disabled={disableSignedCopyCheck}
                        onChange={(e) => handleUpdate(order.id, "signedCopyReceived", e.target.checked)}
                    />
                </Grid>

                {/* Complete Button */}
                <Grid item xs={12} sm={6} md={2}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: completed ? "green" : "red",
                            "&:hover": {
                                backgroundColor: completed ? "green" : "darkred",
                            },
                            "&.Mui-disabled": {
                                backgroundColor: completed ? "green" : "red",
                                color: !canComplete && !completed ? "rgba(255,255,255,0.6)" : "white",
                            },
                        }}
                        onClick={() => handleComplete(order.id)}
                        disabled={!canComplete}
                    >
                        {completed ? "Completed" : "Complete"}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={handleDelete}
                        // disabled={!user?.isAdmin} // ⬅️ Optional: restrict only for admin
                    >
                        Delete
                    </Button>
                </Grid>
            </Grid>
        </ListItem>
    );
}

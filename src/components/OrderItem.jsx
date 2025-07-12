// OrderItem.jsx
import React from "react";
import {ListItem, ListItemText, Typography, TextField, MenuItem, Checkbox, Button, Grid} from "@mui/material";
import {format} from "date-fns";

export default function OrderItem({order, names, handleSelectChange, handleUpdate, handleComplete}) {
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

                        <Typography variant="subtitle2" sx={{fontSize: "1rem"}}>
                            Items:
                        </Typography>
                        <ul style={{margin: 0, paddingLeft: 20}}>
                            {items?.map((item, index) => (
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
                        }}
                        onClick={() => handleComplete(order.id)}
                        disabled={!canComplete}
                    >
                        {completed ? "Completed" : "Complete"}
                    </Button>
                </Grid>
            </Grid>
        </ListItem>
    );
}

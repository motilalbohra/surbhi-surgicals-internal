import React, {useState, useEffect} from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Button,
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {Link as RouterLink} from "react-router-dom";

const navLinks = [
    {label: "New Order", path: "/"},
    {label: "Order List", path: "/orders"},
    {label: "Add Inventory", path: "/inventory"},
    {label: "View Inventory", path: "/inventory-list"},
];

export default function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isCompact, setIsCompact] = useState(false);

    const isSmallScreen = useMediaQuery("(max-width: 680px)");

    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    // Dynamically decide layout by screen size and logo + buttons fitting logic
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            // Trigger compact if screen is too narrow for logo + 4 buttons
            setIsCompact(width < 700); // You can adjust this value as needed
        };
        handleResize(); // on load
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    paddingTop: "env(safe-area-inset-top)",
                    backgroundColor: "#1976d2",
                }}
            >
                <Toolbar sx={{justifyContent: "space-between", gap: 2}}>
                    {/* Logo + Title */}
                    <Box sx={{display: "flex", alignItems: "center", minWidth: 0}}>
                        <Box
                            component="img"
                            src="/surbhi_surgical_logo.jpeg"
                            alt="Logo"
                            sx={{
                                height: 36,
                                width: 36,
                                borderRadius: 1,
                                mr: 1,
                                flexShrink: 0,
                            }}
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                fontWeight: 600,
                                color: "white",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            Surbhi Surgical
                        </Typography>
                    </Box>

                    {/* Buttons or Drawer */}
                    {isCompact || isSmallScreen ? (
                        <>
                            <IconButton color="inherit" edge="end" onClick={toggleDrawer}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
                                <Box sx={{width: 200}} role="presentation" onClick={toggleDrawer}>
                                    <List>
                                        {navLinks.map((item) => (
                                            <ListItem button key={item.path} component={RouterLink} to={item.path}>
                                                <ListItemText primary={item.label} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        <Box sx={{display: "flex", flexWrap: "nowrap"}}>
                            {navLinks.map((item) => (
                                <Button
                                    key={item.path}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        textDecoration: "underline",
                                        fontSize: "0.9rem",
                                        whiteSpace: "nowrap",
                                        mx: 0.5,
                                    }}
                                >
                                    {item.label.toUpperCase()}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
}

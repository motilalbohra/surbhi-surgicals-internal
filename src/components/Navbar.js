import React, {useState} from "react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme,
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <>
            <AppBar position="static" sx={{backgroundColor: "#2f76d2"}}>
                <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <img
                            src="/surbhi_surgical_logo.jpeg" // If it's inside public folder
                            alt="Surbhi Surgical"
                            style={{height: 40, marginRight: 10}}
                        />
                        <Typography variant="h6" sx={{fontWeight: "bold", color: "#fff"}}>
                            Surbhi Surgical
                        </Typography>
                    </Box>

                    {isMobile ? (
                        <>
                            <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
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
                        <Box>
                            {navLinks.map((item) => (
                                <Button
                                    key={item.path}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        mx: 1,
                                        textDecoration: "underline",
                                        fontSize: "1rem",
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

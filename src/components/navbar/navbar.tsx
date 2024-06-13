import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { FaComment, FaGamepad, FaCog } from 'react-icons/fa';

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton color="inherit">
                    <FaComment />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Chat
                </Typography>
                <IconButton color="inherit">
                    <FaGamepad />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Game
                </Typography>
                <IconButton color="inherit">
                    <FaCog />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Settings
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

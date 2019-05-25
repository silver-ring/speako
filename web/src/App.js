import React from 'react';
import './App.css';
import HomePage from "./HomePage";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2492EB'
        },
    },
    status: {
        danger: 'orange',
    },
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <HomePage/>
        </MuiThemeProvider>
    );
}

export default App;

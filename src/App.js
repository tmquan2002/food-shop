import './App.css';
import { HomePage, Checkout, GoogleLogin, Manage } from './pages/routes';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { deepOrange } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<GoogleLogin />} />
          <Route path="/dashboard" element={<Manage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

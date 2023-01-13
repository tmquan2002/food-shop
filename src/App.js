import './App.css';
import { HomeMainPage, Orders, GoogleLogin, Manage, CartPage } from './pages/routes';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { deepOrange } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
    secondary: {
      main: deepOrange[300],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeMainPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<GoogleLogin />} />
          <Route path="/dashboard" element={<Manage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

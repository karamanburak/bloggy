import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppRouter from "./router/AppRouter";
import { Provider } from "react-redux";
import store from "./app/store";
import { ToastContainer } from "react-toastify";
import { ColorModeContext, useMode } from "./styles/theme";

function App() {
  const [theme, colorMode] = useMode()

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AppRouter />
        </Provider>
        <ToastContainer />
      </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;

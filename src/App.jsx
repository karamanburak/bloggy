import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppRouter from "./router/AppRouter";
import { Provider } from "react-redux";
import store, {persistor} from "./app/store";
import { ToastContainer } from "react-toastify";
import { ColorModeContext, useMode } from "./styles/theme";
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  const [theme, colorMode] = useMode()

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppRouter />
            </PersistGate>
          </Provider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastClassName="custom-toast"
            bodyClassName="custom-toast-body"
            progressClassName="custom-toast-progress"
          />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;

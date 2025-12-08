import AppRouter from "./router/AppRouter";
import { Provider } from "react-redux";
import store, {persistor} from "./app/store";
import { Toaster } from "sonner";
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRouter />
        </PersistGate>
      </Provider>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;

import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
// import { makeStore } from './app/store.ts';

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <Toaster richColors position="top-center" />
      <App />
    </Provider>
  </BrowserRouter>
  //  </React.StrictMode>
);

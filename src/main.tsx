import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import React from "react";
// import { makeStore } from './app/store.ts';

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster richColors position="top-center" />
        <App />
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);

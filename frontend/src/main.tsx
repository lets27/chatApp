import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from "./context/userContetProvider.tsx";
import SocketProvider from "./context/socketConnector.tsx";
import { MessageProvider } from "./context/MessageContex.tsx";
import ThemeProvider from "./context/themeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <MessageProvider>
          {/* Move MessageProvider UP */}
          <SocketProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </SocketProvider>
        </MessageProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>
);

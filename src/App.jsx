import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  AdminEditRow,
  AdminPage,
  AdminSettings,
  ForgotPassword,
  HomePage,
  LoginPage,
} from "./pages";

import { DataProvider } from "./context/DataContext";
import { LoadingProvider } from "./context/LoadingContext";
import { AuthContextProvider } from "./context/AuthContext";

import { LoadingOverlay, PrivateRoute } from "./components";

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <DataProvider>
          <LoadingOverlay />
          <AuthContextProvider>
            <Routes>
              <Route
                exact
                path="/"
                element={<HomePage />}
              />
              <Route
                exact
                path="/login"
                element={<LoginPage />}
              />
              <Route
                exact
                path="/forgot-password"
                element={<ForgotPassword />}
              />
              <Route element={<PrivateRoute />}>
                <Route
                  exact
                  path="/admin/settings"
                  element={<AdminSettings />}
                />
                <Route
                  exact
                  path="/admin/:date?"
                  element={<AdminPage />}
                />
                <Route
                  exact
                  path="/admin/edit/:date/:timeId"
                  element={<AdminEditRow />}
                />
              </Route>
            </Routes>
          </AuthContextProvider>
        </DataProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;

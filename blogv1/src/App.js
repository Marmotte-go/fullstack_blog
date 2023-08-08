import "./App.scss";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Write from "./pages/Write";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

import { AuthContextProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const Layout = () => (
    <div className="App">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "post/:id", element: <Single /> },
        { path: "write", element: <Write /> },
        { path: "edit/:id", element: <Write /> },
        { path: "profile", element: <Profile />},
        { path: "profile/:username", element: <Profile /> },
      ],
    },
    {
      path: "/auth",
      element: <Login />,
    },
  ]);

  return (
    <ThemeProvider>
      <AuthContextProvider>
      <RouterProvider router={router} />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;

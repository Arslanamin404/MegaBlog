import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./features/authSlice";
import authService from "./appwriteServices/auth_service";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";


export const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <>
      <div className="min-h-screen flex flex-wrap justify-center bg-gray-200">
        <div className="block">
          <Header />
          <main>
            {/* <Outlet /> */}
          </main>
          <Footer />
        </div>
      </div>
    </>
  ) : (
    <p>Loading...</p>
  );
};

import logo from "./logo.svg";
import "./App.css";
import EmployeeHome from "./pages/Employee/EmployeeHome";
import Login from "./pages/User/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Thankyou from "./pages/Thankyou/Thankyou";
import AdminHome from './pages/Admin/AdminHome'
import { useEffect } from "react";
import Error404 from "./pages/Error/Error404";
import Error500 from "./pages/Error/Error500"; 
import Details from "./pages/Admin/Details";
import Loginotp from './pages/User/Loginotp'

function App() {

  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    // Attach the event listener when the component is mounted
    document.addEventListener('contextmenu', disableRightClick);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
    };
  }, []);


  const route = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/Employee/",
      element: <EmployeeHome />,
    },
    {
      path: "/Admin/",
      element: <AdminHome />,
    },
    {
      path:'/thank-you',
      element:<Thankyou/>
    },
    {
      path:'/error404',
      element:<Error404/>
    },
    {
      path:'/error500',
      element:<Error500/>
    },
    {
      path:'/details',
      element:<Details/>
    },
    {
      path:'/loginotp',
      element:<Loginotp/>
    },
    {
      path:"*",
      element:<Error404/>
    }
  ]);
  return (
    <>
      <RouterProvider router={route} />
    </>
  );
}

export default App;

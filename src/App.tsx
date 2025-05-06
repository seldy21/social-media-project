import { Layout } from "components/Layout";
import Router from "./components/Router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Loader from "components/loader/Loader";
import { RecoilRoot } from "recoil";

function App() {
  const auth = getAuth(app);

  const [init, setInit] = useState<boolean>(false);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(
    auth.currentUser !== null
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        // User is signed out
        setAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);
  return (
    <RecoilRoot>
      <Layout>
        <ToastContainer theme="dark" autoClose={1000} newestOnTop />
        {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
      </Layout>
    </RecoilRoot>
  );
}

export default App;

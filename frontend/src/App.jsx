import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/login";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <>
      <Navbar />
      <MainPage />
      <Signup />
      <Login />
    </>
  );
}

export default App;

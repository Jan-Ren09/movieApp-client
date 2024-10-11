import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './components/AppNavbar';
// import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
// import Products from './pages/Products';
// import Profile from './pages/Profile';

function App() {

  const [user, setUser] = useState({
    id: null,
    email: null,
    isAdmin: false
  })

  function unsetUser(){
    localStorage.clear()
  }

  useEffect(() => {
    fetch(`https://movieapp-api-lms1.onrender.com/users/details`, {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('token') }`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      console.log(data.auth !== "Failed")
      if (data.auth !== "Failed") {
        setUser({
          id: data.user._id,
          email: data.user.email,
          isAdmin: data.user.isAdmin
        });

      } else {
        setUser({
          id: null,
          isAdmin: null,
          email: null,
        });
      }
    })
  }, []) 


  useEffect(()=> {
    console.log(user);
    console.log(localStorage);
  }, [user])



  return (
      <>
        <UserProvider value={{ user, setUser, unsetUser}}>
          <Router>
          <AppNavbar />
            <Container>
              <Routes>
                {/* <Route path="/get-cart" element={<Cart/>}/> */}
                 <Route path="/" element={<Home/>}/>
                 <Route path="/login" element={<Login/>}/>
                {/* <Route path="/profile" element={<Profile />} />
                <Route path="/products" element={<Products />}/>
                <Route path="/orders" element={<Orders />}/>
                <Route path="*" element={<ErrorPage />} /> */}
                <Route path="/register" element={<Register />}/>
                <Route path="/logout" element={<Logout />}/>
              </Routes>
            </Container>
          </Router> 
        </UserProvider>
      </>
  );
}

export default App;
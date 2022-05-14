import './App.css';
import { Box, AppBar, Button, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function Home() {
  return (
    <>
      <Typography variant="body1" component="p">Home</Typography>
    </>
  )
}
function Reg() {
  return (
    <>
      <Typography variant="body1" component="p">Reg</Typography>
    </>
  )
}
function Board() {
  return (
    <>
      <Typography variant="body1" component="p">Board</Typography>
    </>
  )
}
function Header() {
  let navigate = useNavigate()
  return(
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="header" sx={{ flexGrow: 1 }}>
              BTA Registration
            </Typography>
            <Button color="inherit" onClick={()=>navigate('/')}>About</Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
            <Button color="inherit" onClick={() => navigate('/board')}>
              Board
            </Button>
          </Toolbar>
        </AppBar>
  )
}

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={<Reg />}>
          </Route>
          <Route path="/board" element={<Board />}>
          </Route>
        </Routes>
      </Box>
    </Router>
  );
}

export default App;

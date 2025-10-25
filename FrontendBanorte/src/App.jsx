
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Pure/DashBoard/Dashboard.jsx'
import LogIn from './Components/Pure/LogIn/LogIn.jsx'

function App() {
  

  return (
    <div>
    <Routes>
      <Route path="/" element={<LogIn></LogIn>}></Route>
      <Route path="/Dashboard" element={<Dashboard/>}></Route>
    </Routes>
      
    </div>
  )
}

export default App

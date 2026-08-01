import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProveedorTema } from './tema/ProveedorTema'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProveedorTema>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProveedorTema>
  </StrictMode>,
)

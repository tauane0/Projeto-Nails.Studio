import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import Home from './pages/Home';
import Booking from './pages/Booking';
// Add page imports here


function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        {/* As rotas agora são renderizadas diretamente, sem autenticação */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agendar" element={<Booking />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
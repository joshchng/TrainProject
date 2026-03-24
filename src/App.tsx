import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RetroFooter } from '@/components/chrome/RetroFooter';
import { RetroHeader } from '@/components/chrome/RetroHeader';
import { About } from '@/pages/About';
import { Home } from '@/pages/Home';
import { StationPage } from '@/pages/StationPage';
import styles from './App.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className={styles.shell}>
          <RetroHeader />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/station/:abbr" element={<StationPage />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <RetroFooter />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

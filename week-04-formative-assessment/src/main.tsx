import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

createRoot(document.getElementById('root')!).render(
<StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
</StrictMode>
)

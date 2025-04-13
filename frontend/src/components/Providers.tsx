"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
// Importar do @tanstack/react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Hydrate da v5 é diferente, remover por enquanto se não estiver sendo usado especificamente
// import { Hydrate } from "@tanstack/react-query"; // Se necessário, usar a versão correta
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {/* <Hydrate state={pageProps.dehydratedState}> */} {/* Exemplo de como seria Hydrate v5 se necessário */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
        {/* </Hydrate> */}
      </QueryClientProvider>
    </SessionProvider>
  );
}

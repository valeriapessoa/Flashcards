"use client";
import React from "react";
import { Alert, Box, Typography, Button, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useRouter } from "next/navigation";

const AccessDeniedMessage: React.FC = () => {
  const router = useRouter();
  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      zIndex={1300}
      sx={{
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '100vw',
        minHeight: '100vh',
        bgcolor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Alert
        severity="warning"
        icon={false}
        sx={{
          bgcolor: "#fff8e1",
          color: "#795548",
          border: "1px solid #ffe082",
          boxShadow: 3,
          maxWidth: 400,
          width: "100%",
          py: 4,
          px: 3,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "#ffe082",
            borderRadius: "50%",
            width: 72,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
            boxShadow: 2,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 40, color: "#ffa000" }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 1 }}>
          Acesso restrito
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: "#6d4c41" }}>
          Você precisa estar logado para acessar esta página.
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="large"
          fullWidth
          sx={{ mt: 3, borderRadius: 2, fontWeight: "bold", color: "#fff", boxShadow: 1, py: 1.5, fontSize: 18, letterSpacing: 1 }}
          onClick={() => router.push("/login")}
        >
          Fazer Login
        </Button>
        <Typography variant="body2" sx={{ mt: 3, color: "#795548" }}>
          Não tem uma conta?
        </Typography>
        <Button
          component={Link}
          href="/register"
          variant="outlined"
          color="warning"
          fullWidth
          sx={{ mt: 1, borderRadius: 2, fontWeight: "bold", borderColor: "#ffa000", color: "#ffa000", py: 1.2, fontSize: 16, letterSpacing: 1, textTransform: 'none', '&:hover': { borderColor: '#ffa000', bgcolor: '#fffde7' } }}
        >
          Criar Conta
        </Button>
      </Alert>
    </Box>
  );
};

export default AccessDeniedMessage;

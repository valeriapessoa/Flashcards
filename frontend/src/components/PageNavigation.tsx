"use client";
import React from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Flashcards", path: "/flashcards" },
  { label: "Estudar", path: "/estudar" },
  { label: "Revisão Inteligente", path: "/revisao-inteligente" },
];

const PageNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box display="flex" justifyContent="center" my={3}>
      <ButtonGroup variant="outlined" color="primary" aria-label="navigation buttons">
        {navLinks.map((link) => (
          <Button
            key={link.path}
            onClick={() => router.push(link.path)}
            variant={pathname === link.path ? "contained" : "outlined"}
            disabled={pathname === link.path}
          >
            {link.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default PageNavigation;

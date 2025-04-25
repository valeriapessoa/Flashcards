"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "⚠️",
  title,
  subtitle,
  buttonText,
  buttonHref,
  onButtonClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonHref) {
      router.push(buttonHref);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      bgcolor="#E3F2FD"
      p={4}
      borderRadius={2}
      boxShadow={2}
    >
      <Typography fontSize={36} mb={1}>
        {icon}
      </Typography>
      <Typography color="text.secondary" fontSize={18} mb={1} fontWeight={600}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" mb={2}>
          {subtitle}
        </Typography>
      )}
      {buttonText && (
        <Button variant="contained" color="primary" onClick={handleClick}>
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;

import { Box, Grid, Typography } from "@mui/material"
import Image from "next/image"

const FeatureHighlightSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 1, sm: 2 },
        background: "linear-gradient(135deg, rgb(255 235 235) 0%, rgba(255, 248, 240, 0.9) 100%)",
        position: "relative",
        width: "100%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "5%",
          right: "5%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255, 152, 0, 0.3), transparent)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: "5%",
          right: "5%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255, 152, 0, 0.3), transparent)",
        },
      }}
    >
      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        alignItems="center"
        justifyContent="center"
        sx={{ maxWidth: 1400, mx: "auto" }}
      >
        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: 350, sm: 500, md: 700 },
              height: { xs: 250, sm: 350, md: 500 },
              mx: "auto",
              "& img": {
                objectFit: "contain !important",
              },
            }}
          >
            <Image src="/images/home/img-2.png" alt="Estudar com Flashcards" layout="fill" priority />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: { xs: "center", md: "left" },
            px: { xs: 2, md: 0 },
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
              fontWeight: 800,
              mb: { xs: 2, md: 3 },
              color: "primary.main",
              lineHeight: { xs: 1.2, md: 1.1 },
            }}
          >
            Transforme sua forma de estudar
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.7rem" },
              color: "text.secondary",
              lineHeight: { xs: 1.5, md: 1.4 },
              maxWidth: { xs: "100%", md: "90%" },
            }}
          >
            Aprenda de forma mais eficiente e divertida com nossa plataforma de flashcards interativos
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FeatureHighlightSection

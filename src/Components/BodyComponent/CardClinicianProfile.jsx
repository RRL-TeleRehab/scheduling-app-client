import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Divider,
  Grid,
  Stack,
  Chip,
  Typography,
  Box,
} from "@mui/material";

const cardStyle = {
  card: {
    maxWidth: 450,
    m: 1,
    border: "1px solid #1976d2",
    borderRadius: 1,
    "&:hover": {
      boxShadow: 10,
    },
  },
  cardContent: {
    backgroundColor: "#1976d2",
  },
  cardContentTypography: {
    color: "#ffffff",
  },
  cardAvatar: {
    width: 120,
    height: 120,
    border: "2px solid #1976d2",
  },
  cardContentChip: {
    m: 0.25,
  },
  bottomCardContent: {
    minHeight: 80,
    p: 1,
  },
  clinicianDescription: {
    textAlign: "justify",
    p: 1,
    borderRadius: 1,
    border: "1px solid #1976d2",
    minHeight: 170,
    maxHeight: 170,
    minWidth: 230,
    maxWidth: 230,
    overflow: "auto",
  },
  cardLeftStack: {
    my: 0.5,
  },
  clinicianInfo: {
    fontWeight: "bold",
  },
  clinicianEmail: { fontWeight: "bold", fontSize: 10 },
  cardRightStack: { mr: 1.5, my: 1 },
};

const CardClinicianProfile = ({ clinician }) => {
  return (
    <Card key={clinician._id} sx={cardStyle.card}>
      <CardActionArea>
        <CardContent sx={cardStyle.cardContent} align="center">
          <Typography
            sx={cardStyle.cardContentTypography}
            variant="body2"
            color="text.primary"
          >
            {clinician.title}. {clinician.firstName.toUpperCase()}{" "}
            {clinician.lastName.toUpperCase()}({clinician.gender})
          </Typography>
        </CardContent>
        <Divider></Divider>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <Stack
              alignItems="center"
              direction="column"
              sx={cardStyle.cardLeftStack}
            >
              {clinician.profilePhoto && (
                <Avatar
                  src={clinician.profilePhoto}
                  alt="no-image"
                  sx={cardStyle.cardAvatar}
                />
              )}
              <Typography variant="overline" sx={cardStyle.clinicianInfo}>
                {clinician.clinicName}
              </Typography>
              <Typography variant="caption" sx={cardStyle.clinicianInfo}>
                {clinician.clinicContact}
              </Typography>
              <Typography variant="caption" sx={cardStyle.clinicianEmail}>
                {clinician.email}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={7}>
            <Stack
              alignItems="center"
              direction="column"
              sx={cardStyle.cardRightStack}
            >
              <Box sx={cardStyle.clinicianDescription}>
                {clinician.aboutClinician.length > 0
                  ? clinician.aboutClinician
                  : "No Information"}
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <Divider></Divider>
        <CardContent sx={cardStyle.bottomCardContent}>
          {clinician.clinicianSpecialization.length > 0 ? (
            clinician.clinicianSpecialization.map((specialization, key) => (
              <Chip
                sx={cardStyle.cardContentChip}
                key={specialization}
                label={specialization}
              ></Chip>
            ))
          ) : (
            <Typography variant="caption" display="block" gutterBottom>
              No specialization mentioned.
            </Typography>
          )}

          {clinician.clinicianProfessionalCourses.length > 0 ? (
            clinician.clinicianProfessionalCourses.map((course, key) => (
              <Chip
                sx={cardStyle.cardContentChip}
                key={course}
                label={course}
              ></Chip>
            ))
          ) : (
            <Typography variant="caption" display="block" gutterBottom>
              No professional courses mentioned.
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardClinicianProfile;

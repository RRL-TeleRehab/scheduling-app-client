import React from "react";
import {
  Button,
  Grid,
  List,
  Stack,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import facebookSvg from "../../media/facebook.svg";
import twitterSvg from "../../media/twitter.svg";
import linkedinSvg from "../../media/linkedin.svg";
import instagramSvg from "../../media/instagram.svg";

const openInNewTab = (url) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

const ClinicianBio = ({
  title,
  firstName,
  lastName,
  email,
  gender,
  profilePhoto,
  clinicContact,
  yearsOfExperience,
  affiliatedFrom,
  clinicianTrainedLocation,
  clinicianProfessionalCourses,
  socialMediaHandles,
  aboutClinician,
  clinicianSpecialization,
}) => {
  return (
    <Box sx={{ backgroundColor: "#FFFFFF" }}>
      <Stack
        direction="row"
        justifyContent="center"
        sx={{ backgroundColor: "#1976d2" }}
      >
        <ListSubheader sx={{ backgroundColor: "#1976d2" }}>
          <Typography
            variant="h6"
            color="text.primary"
            sx={{ color: "#FFFFFF" }}
          >
            {title}.{firstName.toUpperCase()}
            {lastName.toUpperCase()} ({gender})
          </Typography>
        </ListSubheader>
      </Stack>
      <Grid container>
        <Grid item xs={6}>
          <Stack direction="column" alignItems="center" sx={{ p: 1 }}>
            {profilePhoto && (
              <Avatar
                src={profilePhoto}
                alt="no-image"
                sx={{
                  height: 100,
                  width: 100,
                  border: "2px solid #1976d2",
                }}
              />
            )}
            <List
              dense
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                border: "1px solid #1976d2",
                borderRadius: "5px",
                mt: 1,
              }}
              component="nav"
              aria-label="mailbox folders"
            >
              <ListItem button divider>
                <ListItemText primary={<Typography>{`${email}`}</Typography>} />
              </ListItem>
              <ListItem button divider>
                <ListItemText
                  primary={
                    <Typography
                      variant="overline"
                      color="text.primary"
                    >{`Contact: ${clinicContact}`}</Typography>
                  }
                />
              </ListItem>
              <ListItem
                divider
                button
                secondaryAction={<Typography>{yearsOfExperience}</Typography>}
              >
                <ListItemText
                  primary={
                    <Typography variant="overline">
                      Years of Experience:
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem
                button
                divider
                secondaryAction={<Typography>{affiliatedFrom}</Typography>}
              >
                <ListItemText
                  primary={
                    <Typography variant="overline">Affiliation:</Typography>
                  }
                />
              </ListItem>
              <ListItem
                button
                secondaryAction={
                  <Typography>{clinicianTrainedLocation}</Typography>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="overline">
                      Trained Location:
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              onClick={() => openInNewTab(`${socialMediaHandles.facebook}`)}
              variant="outlined"
            >
              <Avatar src={facebookSvg}></Avatar>
            </IconButton>
            <IconButton
              onClick={() => openInNewTab(`${socialMediaHandles.instagram}`)}
              variant="outlined"
            >
              <Avatar src={instagramSvg}></Avatar>{" "}
            </IconButton>
            <IconButton
              onClick={() => openInNewTab(`${socialMediaHandles.linkedin}`)}
              variant="outlined"
            >
              <Avatar src={linkedinSvg}></Avatar>
            </IconButton>
            <IconButton
              size="small"
              onClick={() => openInNewTab(`${socialMediaHandles.twitter}`)}
              variant="outlined"
            >
              <Avatar src={twitterSvg}></Avatar>
            </IconButton>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="column"
            alignItems="center"
            sx={{ m: 1, p: 1 }}
            spacing={1}
          >
            <Box
              sx={{
                textAlign: "justify",
                p: 1,
                boxShadow: 5,
                minHeight: 240,
                maxHeight: 240,
                minWidth: "100%",
                overflow: "hidden",
                overflowY: "scroll",
              }}
            >
              {aboutClinician}
            </Box>
            <Box>
              <Typography variant="overline" sx={{ fontWeight: 600 }}>
                specialization:
              </Typography>
              {clinicianSpecialization.length > 0 ? (
                clinicianSpecialization.map((specialization, key) => (
                  <Chip
                    sx={{ m: 0.25 }}
                    key={specialization}
                    label={specialization}
                  ></Chip>
                ))
              ) : (
                <Typography variant="caption">
                  No specialization mentioned by clinician.
                </Typography>
              )}
            </Box>
            <Box>
              <Typography variant="overline" sx={{ fontWeight: 600 }}>
                Professional Courses:
              </Typography>
              {clinicianProfessionalCourses.length > 0 ? (
                clinicianProfessionalCourses.map((course, key) => (
                  <Chip sx={{ m: 0.25 }} key={course} label={course}></Chip>
                ))
              ) : (
                <Typography variant="caption">
                  No courses mentioned by clinician.
                </Typography>
              )}
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClinicianBio;

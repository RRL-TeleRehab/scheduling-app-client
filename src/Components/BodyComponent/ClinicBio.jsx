import React from "react";
import {
  Grid,
  List,
  Stack,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
  Box,
} from "@mui/material";

const ClinicBio = ({
  clinicName,
  clinicAddress,
  clinicRegisteredYear,
  clinicRegistrationNo,
}) => {
  return (
    <Box sx={{ mt: 1, bgcolor: "background.paper" }}>
      <Stack direction="row" justifyContent="center">
        <ListSubheader>
          <Typography variant="overline">CLINIC INFORMATION</Typography>
        </ListSubheader>
      </Stack>
      <Grid container>
        <Grid item xs={6}>
          <Stack sx={{ p: 1 }} direction="column" alignItems="center">
            <List
              dense
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                border: "1px solid #1976d2",
                borderRadius: "5px",
              }}
              component="nav"
              aria-label="mailbox folders"
            >
              <ListItem
                divider
                button
                secondaryAction={<Typography>{clinicName}</Typography>}
              >
                <ListItemText
                  primary={
                    <Typography variant="overline">Clinic Name:</Typography>
                  }
                />
              </ListItem>
              <ListItem
                button
                divider
                secondaryAction={
                  <Typography>{clinicRegisteredYear}</Typography>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="overline">Registered Year:</Typography>
                  }
                />
              </ListItem>
              <ListItem
                button
                secondaryAction={
                  <Typography>{clinicRegistrationNo}</Typography>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="overline">registration No:</Typography>
                  }
                />
              </ListItem>
            </List>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack sx={{ p: 1 }}>
            <Box
              sx={{
                p: 1,
                border: "1px solid #1976d2",
                borderRadius: "5px",
              }}
            >
              <ListSubheader>
                <Typography variant="overline">Clinic Address</Typography>
              </ListSubheader>
              <Typography>
                {clinicAddress.address1} {clinicAddress.address2}
              </Typography>
              <Typography></Typography>
              <Typography>{clinicAddress.city}</Typography>
              <Typography>
                {clinicAddress.province} {clinicAddress.postalCode}
              </Typography>
              <Typography>{clinicAddress.country}</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClinicBio;

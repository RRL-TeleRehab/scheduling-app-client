import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { isAuth, getCookie, signout } from "../../Common/helpers";
import NavBreadCrumb from "./NavBreadCrumb";
import {
  Button,
  Grid,
  List,
  Stack,
  TextField,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
  Box,
  Radio,
  CircularProgress,
} from "@mui/material";
import ClinicianBio from "./ClinicianBio";
import ClinicBio from "./ClinicBio";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import MapsMarker from "./MapsMarker";

const AppointmentBooking = ({ match, history }) => {
  const [values, setValues] = useState({
    appointmentDate: new Date(),
    availableTimeSlots: [],
    patientFirstName: "",
    patientLastName: "",
    patientEmail: "",
    selectedTimeSlot: "",
    bookAppointmentLoad: false,
  });
  const [userValues, setUserValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    aboutClinician: "",
    affiliatedFrom: "",
    clinicAddress: {},
    clinicContact: "",
    clinicName: "",
    clinicRegisteredYear: "",
    clinicRegistrationNo: "",
    clinicianProfessionalCourses: [],
    clinicianSpecialization: [],
    clinicianTrainedLocation: "",
    createdAt: "",
    updatedAt: "",
    gender: "",
    profilePhoto: "",
    socialMediaHandles: [],
    title: "",
    username: "",
    dateOfBirth: "",
    yearsOfExperience: 0,
    _id: "",
    loading: false,
  });
  const [errors, setErrors] = useState({});

  const {
    appointmentDate,
    availableTimeSlots,
    patientFirstName,
    patientLastName,
    patientEmail,
    selectedTimeSlot,
    bookAppointmentLoad,
  } = values;

  const {
    firstName,
    lastName,
    email,
    loading,
    role,
    affiliatedFrom,
    clinicAddress,
    clinicContact,
    clinicName,
    aboutClinician,
    clinicRegisteredYear,
    clinicRegistrationNo,
    clinicianProfessionalCourses,
    clinicianSpecialization,
    clinicianTrainedLocation,
    createdAt,
    updatedAt,
    gender,
    profilePhoto,
    socialMediaHandles,
    title,
    username,
    dateOfBirth,
    yearsOfExperience,
    _id,
  } = userValues;

  const token = getCookie("token");

  const convertToDate = (str) => {
    var date = new Date(str);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return [month, day, date.getFullYear()].join("-");
  };

  const validate = () => {
    let temp = { ...errors };

    const isNameValid = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    if (patientFirstName.length === 0) {
      temp.patientFirstName = "First Name is required";
    } else if (!isNameValid.test(patientFirstName)) {
      temp.patientFirstName = "First Name invalid";
    } else {
      temp.patientFirstName = "";
    }

    if (patientLastName.length === 0) {
      temp.patientLastName = "Last Name is required";
    } else if (!isNameValid.test(patientLastName)) {
      temp.patientLastName = "Last Name invalid";
    } else {
      temp.patientLastName = "";
    }

    temp.patientEmail = patientEmail ? "" : "Email is required";
    if (patientEmail) {
      temp.patientEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(patientEmail)
        ? ""
        : "Email is not valid";
    }

    setErrors({ ...temp });
    const isValid =
      patientFirstName &&
      patientLastName &&
      patientEmail &&
      Object.values(temp).every((x) => x === "");
    console.log(isValid);
    return isValid;
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  function tConv24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? "0" + h : h; // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }

  const loadClinicianProfile = () => {
    const clinicianId = match.params.clinicianId;

    setUserValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${clinicianId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const {
          firstName,
          lastName,
          email,
          role,
          password,
          confirmPassword,
          aboutClinician,
          affiliatedFrom,
          clinicAddress,
          clinicContact,
          clinicName,
          clinicRegisteredYear,
          clinicRegistrationNo,
          clinicianProfessionalCourses,
          clinicianSpecialization,
          clinicianTrainedLocation,
          createdAt,
          updatedAt,
          gender,
          profilePhoto,
          socialMediaHandles,
          title,
          username,
          dateOfBirth,
          yearsOfExperience,
          _id,
        } = response.data;
        setUserValues({
          ...values,
          firstName,
          lastName,
          email,
          role,
          gender,
          password,
          confirmPassword,
          aboutClinician,
          affiliatedFrom,
          clinicAddress,
          clinicContact,
          clinicName,
          clinicRegisteredYear,
          clinicRegistrationNo,
          clinicianProfessionalCourses,
          clinicianSpecialization,
          clinicianTrainedLocation,
          createdAt,
          updatedAt,
          profilePhoto,
          socialMediaHandles,
          title,
          username,
          dateOfBirth,
          yearsOfExperience,
          _id,
          loading: false,
        });
      })
      .catch((error) => {
        setUserValues({ ...values, loading: false });
        console.log("User Profile Error", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
        toast.error(error.response.data.error);
      });
  };

  const getAvailabilityByDate = () => {
    const clinicianId = match.params.clinicianId;
    const availabilityDate = convertToDate(appointmentDate);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/availability/${clinicianId}/${availabilityDate}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        let availableTimeSlotsByDate = [];
        response.data.availableSlots.length === 0
          ? setValues({
              ...values,
              availableTimeSlots: availableTimeSlotsByDate,
            })
          : response.data.availableSlots[0].availability.slots.map((slot) => {
              slot.isAvailable === true &&
                availableTimeSlotsByDate.push(slot.time);
            });
        setValues({ ...values, availableTimeSlots: availableTimeSlotsByDate });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      setValues({ ...values, bookAppointmentLoad: true });
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_API}/request-appointment`,
        headers: { Authorization: `Bearer ${token}` },
        data: {
          requestedBy: isAuth()._id,
          requestedTo: match.params.clinicianId,
          appointmentStatus: "pending",
          appointmentTime: selectedTimeSlot,
          appointmentDate: convertToDate(appointmentDate),
          patientEmail: patientEmail,
          patientFirstName: patientFirstName,
          patientLastName: patientLastName,
        },
      })
        .then((response) => {
          console.log("Appointment confirmed", response);
          toast.success(response.data.message);
          setValues({
            ...values,
            patientFirstName: "",
            selectedTimeSlot: "",
            patientLastName: "",
            patientEmail: "",
            bookAppointmentLoad: false,
          });
        })
        .catch((error) => {
          setValues({
            ...values,
            patientFirstName: "",
            selectedTimeSlot: "",
            patientLastName: "",
            patientEmail: "",
            bookAppointmentLoad: false,
          });
          console.log("Availability ERROR", error);
        });
    }
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  useEffect(() => {
    getAvailabilityByDate();
  }, [appointmentDate]);

  useEffect(() => {
    loadClinicianProfile();
  }, []);

  return (
    <Fragment>
      <NavBreadCrumb
        path={`/clinicians/${match.params.clinicianId}`}
        name="Book Appointment"
      ></NavBreadCrumb>
      <ToastContainer></ToastContainer>
      <Stack direction="row" sx={{ mt: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            {loading ? (
              <CircularProgress></CircularProgress>
            ) : (
              <Fragment>
                <ClinicianBio
                  title={title}
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  gender={gender}
                  profilePhoto={profilePhoto}
                  clinicContact={clinicContact}
                  yearsOfExperience={yearsOfExperience}
                  affiliatedFrom={affiliatedFrom}
                  clinicianTrainedLocation={clinicianTrainedLocation}
                  clinicianProfessionalCourses={clinicianProfessionalCourses}
                  socialMediaHandles={socialMediaHandles}
                  aboutClinician={aboutClinician}
                  clinicianSpecialization={clinicianSpecialization}
                ></ClinicianBio>
                <ClinicBio
                  clinicName={clinicName}
                  clinicAddress={clinicAddress}
                  clinicRegisteredYear={clinicRegisteredYear}
                  clinicRegistrationNo={clinicRegistrationNo}
                ></ClinicBio>
              </Fragment>
            )}
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                disablePast
                openTo="day"
                value={appointmentDate}
                onChange={(newValue) => {
                  setValues({ ...values, appointmentDate: newValue });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Box sx={{ mt: 1 }}>
              <MapsMarker></MapsMarker>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Stack direction="column">
              <List
                subheader={
                  <ListSubheader>
                    <Typography variant="overline">Time Slot</Typography>
                  </ListSubheader>
                }
                sx={{
                  bgcolor: "background.paper",
                  minHeight: 350,
                  maxHeight: 350,
                  overflow: "auto",
                }}
              >
                {availableTimeSlots.length === 0 ? (
                  <ListItem>
                    <ListItemText>
                      No slots available for today. Select different date
                    </ListItemText>
                  </ListItem>
                ) : (
                  availableTimeSlots.map((value) => {
                    const labelId = `checkbox-list-label-${value}`;
                    return (
                      <ListItem key={value} disablePadding>
                        <ListItemButton
                          dense
                          sx={{
                            border: "1px solid #1976d2",
                            mx: 1,
                            marginTop: 1,
                            borderRadius: 1,
                          }}
                        >
                          <ListItemIcon>
                            <Radio
                              edge="start"
                              tabIndex={-1}
                              inputProps={{ "aria-labelledby": labelId }}
                              value={value}
                              checked={value === selectedTimeSlot}
                              onChange={handleChange("selectedTimeSlot")}
                              name="radio"
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={labelId}
                            primary={`${value} [${tConv24(value)}]`}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })
                )}
              </List>
              <Box
                component="form"
                sx={{ mt: 1, bgcolor: "background.paper", p: 1 }}
              >
                <Grid item xs={12}>
                  <ListSubheader>
                    <Typography variant="overline">
                      patient information
                    </Typography>
                  </ListSubheader>
                  <TextField
                    required
                    fullWidth
                    name="patientFirstName"
                    label="First Name"
                    type="text"
                    id="patientFirstName"
                    placeholder="Enter patient first name"
                    size="small"
                    value={patientFirstName}
                    onChange={handleChange("patientFirstName")}
                    sx={{ mt: 1 }}
                    {...(errors["patientFirstName"] && {
                      error: true,
                      helperText: errors["patientFirstName"],
                    })}
                  ></TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="patientLastName"
                    label="Last Name"
                    type="text"
                    id="patientLastName"
                    placeholder="Enter patient last name"
                    size="small"
                    value={patientLastName}
                    sx={{ mt: 1 }}
                    onChange={handleChange("patientLastName")}
                    {...(errors["patientLastName"] && {
                      error: true,
                      helperText: errors["patientLastName"],
                    })}
                  ></TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="patientEmail"
                    label="Email Address"
                    type="email"
                    id="patientEmail"
                    placeholder="Enter patient email address"
                    size="small"
                    value={patientEmail}
                    sx={{ mt: 1 }}
                    onChange={handleChange("patientEmail")}
                    {...(errors["patientEmail"] && {
                      error: true,
                      helperText: errors["patientEmail"],
                    })}
                  ></TextField>
                </Grid>
                <Button
                  sx={{ my: 2 }}
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Book appointment
                  {bookAppointmentLoad ? (
                    <CircularProgress
                      sx={{ ml: 2 }}
                      color="warning"
                      size={20}
                    />
                  ) : null}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Fragment>
  );
};

export default AppointmentBooking;

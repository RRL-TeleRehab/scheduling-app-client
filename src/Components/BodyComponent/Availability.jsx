import React, { useEffect, useState, Fragment } from "react";
import moment from "moment";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Paper,
  TextField,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
  CssBaseline,
} from "@mui/material";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { isAuth, getCookie } from "../../Common/helpers";
import NavBreadCrumb from "./NavBreadCrumb";
import VerifiedIcon from "@mui/icons-material/Verified";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";

var currentDate = new Date();
let minutes = currentDate.getMinutes();
let hours = currentDate.getHours();
minutes = minutes <= 9 ? "0" + minutes : minutes;
hours = hours <= 9 ? "0" + hours : hours;
var currentTime = hours + ":" + minutes;

const not = (a, b) => {
  return a.filter((value) => b.indexOf(value) === -1);
};

const intersection = (a, b) => {
  return a.filter((value) => b.indexOf(value) !== -1);
};

export default function Availability() {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [fulfilledSlots, setFulfilledSlots] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [pendingRequestSlots, setPendingRequestSlots] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const token = getCookie("token");

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left).sort());
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked).sort());
    setLeft(not(left, leftChecked).sort());
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked).sort());
    setRight(not(right, rightChecked).sort());
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right).sort());
    setRight([]);
  };

  const convertToDate = (str) => {
    var date = new Date(str);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return [month, day, date.getFullYear()].join("-");
  };

  // Generate Time Slots
  let generateTimeSlots = {
    slotInterval: 30,
    clinicOpenTime: "00:00",
    clinicCloseTime: "24:00",
  };
  let generatedTimeSlots = [];
  let startTime = moment(generateTimeSlots.clinicOpenTime, "HH:mm");
  let endTime = moment(generateTimeSlots.clinicCloseTime, "HH:mm").add(
    0,
    "days"
  );
  while (startTime < endTime) {
    generatedTimeSlots.push(startTime.format("HH:mm"));
    startTime.add(generateTimeSlots.slotInterval, "minutes");
  }

  const getAvailabilityByDate = () => {
    const clinicianId = isAuth()._id;
    const availabilityDate = convertToDate(appointmentDate);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/availability/${clinicianId}/${availabilityDate}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        let availabilityByDate = [];
        let confirmedSlots = [];
        response.data.availableSlots.length === 0
          ? setLeft(generatedTimeSlots) && setRight([])
          : response.data.availableSlots[0].availability.slots.map((slot) => {
              slot.isAvailable === false && confirmedSlots.push(slot.time);
              availabilityByDate.push(slot.time);
            });
        availabilityByDate.length > 0
          ? setRight(availabilityByDate.sort())
          : setRight([]);

        let leftSlotsAvailable = generatedTimeSlots.filter(function (slot) {
          return !availabilityByDate.includes(slot);
        });
        setLeft(leftSlotsAvailable.sort());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // write API to get confirmed appointment Bookings and set it's values to setBookedSlots state
  const getConfirmedAppointmentsByDate = () => {
    setBookedSlots([]);
    setFulfilledSlots([]);
    let availabilityByDate = convertToDate(appointmentDate);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/confirmed-appointments/${availabilityByDate}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log(response.data);
        let confirmedSlots = [];
        let fulfilledSlots = [];
        response.data.confirmedAppointments.length === 0
          ? setBookedSlots(confirmedSlots)
          : response.data.confirmedAppointments.map((appointment) => {
              appointment.status === "active" &&
                confirmedSlots.push(appointment.appointmentTime);
              appointment.status === "fulfilled" &&
                fulfilledSlots.push(appointment.appointmentTime);
            });
        confirmedSlots.length > 0 && setBookedSlots(confirmedSlots);
        fulfilledSlots.length > 0 && setFulfilledSlots(fulfilledSlots);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getPendingRequestsByDate = () => {
    setPendingRequestSlots([]);
    const clinicianId = isAuth()._id;
    const availabilityDate = convertToDate(appointmentDate);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/pending-requests/${clinicianId}/${availabilityDate}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        const { data } = response;
        console.log(data);
        let timeSlots = [];
        if (data.pendingAppointmentRequests.length > 0) {
          data.pendingAppointmentRequests.map((appointmentRequest) => {
            timeSlots.push(appointmentRequest.appointmentTime);
          });
          setPendingRequestSlots(timeSlots);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getAvailabilityByDate();
    getPendingRequestsByDate();
    getConfirmedAppointmentsByDate();
  }, [appointmentDate]);

  // Function to update availability
  const updateAvailability = (event) => {
    event.preventDefault();
    handleDialogClose();
    setLoading(true);
    let data = [];
    for (let i = 0; i < right.length; i++) {
      data.push({
        time: right[i],
        isAvailable: true,
      });
    }
    const clinicianId = isAuth()._id;
    const availability = [
      {
        date: convertToDate(appointmentDate),
        slots: data,
      },
    ];
    // check if the updating availability is greater than or equal to the current date then update availability accordingly otherwise show the error message
    if (convertToDate(appointmentDate) >= convertToDate(new Date())) {
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_API}/availability`,
        headers: { Authorization: `Bearer ${token}` },
        data: { clinicianId, availability },
      })
        .then((response) => {
          setLoading(false);
          // console.log("created availability", response);
          toast.success(response.data.message);
          getAvailabilityByDate();
        })
        .catch((error) => {
          setLoading(false);
          console.log("Availability ERROR", error);
        });
    } else {
      setLoading(false);
      toast.error(`Can not update availability for previous dates`);
    }
  };

  // function to convert 24 hour time to 12 hour time with AM/PM
  function tConv24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? "0" + h : h; // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }

  //function to check and disable if the time slot is valid to update for a selected appointment date
  const validTimeSlot = (value) => {
    if (convertToDate(appointmentDate) <= convertToDate(new Date())) {
      if (currentTime <= value) {
        return false;
      } else return true;
    }
  };

  const customList = (items) => (
    <Paper
      sx={{
        width: 300,
        height: 500,
        overflow: "auto",
        px: 1,
        border: "1px solid gray",
      }}
    >
      <List dense component="div" role="list" sx={{ padding: 0 }}>
        {items.length > 0 ? (
          items.map((value) => {
            const labelId = `transfer-list-item-${value}-label`;
            return (
              <ListItem
                key={value}
                role="listitem"
                button
                onClick={
                  !validTimeSlot(value) ? handleToggle(value) : undefined
                }
                sx={{
                  border: "1px solid #000",
                  mt: 1,
                  borderRadius: 1,
                }}
                style={{
                  backgroundColor: validTimeSlot(value) && "#eeeeee",
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                    disabled={validTimeSlot(value)}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={`${value} [${tConv24(value)}]`}
                />
                {validTimeSlot(value) && (
                  <Tooltip title={`Time slot: ${value} is expired`}>
                    <RunningWithErrorsIcon color="error"></RunningWithErrorsIcon>
                  </Tooltip>
                )}
                {bookedSlots.length > 0 && bookedSlots.includes(value) && (
                  <Tooltip
                    title={`An appointment is already confirmed at ${value}`}
                  >
                    <CheckCircleIcon color="success"></CheckCircleIcon>
                  </Tooltip>
                )}
                {fulfilledSlots.length > 0 && fulfilledSlots.includes(value) && (
                  <Tooltip
                    title={`Appointment completed successfully at ${value}`}
                  >
                    <VerifiedIcon color="primary"></VerifiedIcon>
                  </Tooltip>
                )}
                {pendingRequestSlots.length > 0 &&
                  pendingRequestSlots.includes(value) && (
                    <Tooltip
                      title={`There is pending appointment request at ${value}. Please approve or reject the request`}
                    >
                      <PendingIcon color="primary"></PendingIcon>
                    </Tooltip>
                  )}
              </ListItem>
            );
          })
        ) : (
          <Typography sx={{ fontWeight: "bold" }}>No slots</Typography>
        )}

        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Fragment>
      <NavBreadCrumb path="/availability" name="/Availability"></NavBreadCrumb>
      <ToastContainer></ToastContainer>
      <CssBaseline />
      <Grid container justifyContent="center" alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={appointmentDate}
            onChange={(newValue) => {
              setAppointmentDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Box
          sx={{
            backgroundColor: "#fff",
            m: 2,
            p: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Grid>
                  <Typography variant="overline">Available slots</Typography>
                </Grid>
                <Grid item>{customList(left)}</Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button
                  sx={{ my: 1 }}
                  variant="contained"
                  size="small"
                  onClick={handleAllRight}
                  disabled={left.length === 0}
                  aria-label="move all right"
                >
                  ≫
                </Button>
                <Button
                  sx={{ my: 1 }}
                  variant="contained"
                  size="small"
                  onClick={handleCheckedRight}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  sx={{ my: 1 }}
                  variant="contained"
                  size="small"
                  onClick={handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
                <Button
                  sx={{ my: 2 }}
                  variant="contained"
                  size="small"
                  onClick={handleAllLeft}
                  disabled={right.length === 0}
                  aria-label="move all left"
                >
                  ≪
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Grid>
                  <Typography variant="overline">
                    Current availability
                  </Typography>
                </Grid>
                <Grid item>{customList(right)}</Grid>
              </Grid>
            </Grid>
          </Stack>
          <Stack sx={{ mt: 2 }} alignItems="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleDialogOpen}
            >
              Update
              {loading ? (
                <CircularProgress sx={{ ml: 2 }} color="warning" size={20} />
              ) : (
                <UpgradeIcon sx={{ ml: 2 }}></UpgradeIcon>
              )}
            </Button>
          </Stack>
        </Box>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Update Availability
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to update your availability for{" "}
            {convertToDate(appointmentDate)} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button onClick={updateAvailability} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

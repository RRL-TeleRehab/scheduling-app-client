import React, { useState, useEffect, Fragment, useRef, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  isAuth,
  getCookie,
  signout,
  updateUserInfo,
} from "../../Common/helpers";
import NavBreadCrumb from "./NavBreadCrumb";
import PropTypes from "prop-types";
import {
  CircularProgress,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Stack,
  Avatar,
  Button,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Typography,
  InputAdornment,
  Link as UILink,
  Grid,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import storage from "../../firebase";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import countryList from "react-select-country-list";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import KeyIcon from "@mui/icons-material/Key";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const UserEditProfile = ({ history }) => {
  const ABOUT_CLINICIAN_CHAR_LIMIT = 300;
  const allInputs = { imgUrl: "" };
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    newPassword: "",
    confirmNewPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    aboutClinician: "",
    affiliatedFrom: "",
    clinicAddress: {
      address1: "",
      address2: "",
      city: "",
      province: "",
      country: "",
      postalCode: "",
    },
    clinicContact: "",
    clinicName: "",
    clinicRegisteredYear: "",
    clinicRegistrationNo: "",
    clinicianProfessionalCourses: [],
    newCourse: "",
    clinicianSpecialization: [],
    newSpecialty: "",
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
    meetingLink: "",
    experienceDropDownValues: [],
    yearDropDownValues: [],
    loading: false,
    profilePhotoUploading: false,
  });
  const [value, setValue] = useState(0);
  const [errors, setErrors] = useState({});
  const inputFile = useRef(null);
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

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
    meetingLink,
    experienceDropDownValues,
    yearDropDownValues,
    profilePhotoUploading,
    newCourse,
    newSpecialty,
    newPassword,
    confirmNewPassword,
    showPassword,
    showConfirmPassword,
  } = values;

  const token = getCookie("token");

  const countriesList = useMemo(() => countryList().getData(), []);
  const provincesList = [
    {
      label: "Alberta",
      value: "AB",
    },
    {
      label: "British Columbia",
      value: "BC",
    },
    {
      label: "Manitoba",
      value: "MB",
    },
    {
      label: "New Brunswick",
      value: "NB",
    },
    {
      label: "Newfoundland and Labrador",
      value: "NL",
    },
    {
      label: "Northwest Territories",
      value: "NT",
    },
    {
      label: "Nova Scotia",
      value: "NS",
    },
    {
      label: "Nunavut",
      value: "NU",
    },
    {
      label: "Ontario",
      value: "ON",
    },
    {
      label: "Prince Edward Island",
      value: "PE",
    },
    {
      label: "Quebec",
      value: "QC",
    },
    {
      label: "Saskatchewan",
      value: "SK",
    },
    {
      label: "Yukon Territory",
      value: "YT",
    },
  ];

  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  const handleContact = (value) => {
    return value.replace(phoneRegex, "($1) $2-$3");
  };

  useEffect(() => {
    loadUserProfile();
    generateExperienceValues();
    generateYearsValues();
  }, []);

  const generateExperienceValues = () => {
    for (let i = 0; i <= 30; i++) {
      values.experienceDropDownValues.push(i);
    }
  };

  const generateYearsValues = () => {
    var currentYear = new Date().getFullYear();
    for (let i = 1950; i <= currentYear; i++) {
      values.yearDropDownValues.push(i);
    }
  };

  const validate = () => {
    let temp = { ...errors };
    const postalRegex =
      /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
    const isNameValid = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const isValidURI =
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

    if (firstName.length === 0) {
      temp.firstName = "First Name is required";
    } else if (!isNameValid.test(firstName)) {
      temp.firstName = "First Name invalid";
    } else {
      temp.firstName = "";
    }

    if (lastName.length === 0) {
      temp.lastName = "Last Name is required";
    } else if (!isNameValid.test(lastName)) {
      temp.lastName = "Last Name invalid";
    } else {
      temp.lastName = "";
    }
    const isNonWhiteSpace = /^\S*$/;
    const isValidLength = /^.{8,16}$/;
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (newPassword.length > 0) {
      if (!isNonWhiteSpace.test(newPassword)) {
        temp.newPassword = "Password must not contain any white spaces.";
      } else if (!isValidLength.test(newPassword)) {
        temp.newPassword = "Password must be between 8 and 16 characters";
      } else if (!isContainsUppercase.test(newPassword)) {
        temp.newPassword =
          "Password must contain at least one uppercase letter";
      } else if (!isContainsLowercase.test(newPassword)) {
        temp.newPassword =
          "Password must contain at least one lowercase letter";
      } else if (!isContainsNumber.test(newPassword)) {
        temp.newPassword = "Password must contain at least one number";
      } else if (!isContainsSymbol.test(newPassword)) {
        temp.newPassword =
          "Password must contain at least one special character";
      } else {
        temp.newPassword = "";
      }
    }
    if (confirmNewPassword.length > 0) {
      if (!isNonWhiteSpace.test(confirmNewPassword)) {
        temp.confirmNewPassword = "Password must not contain any white spaces.";
      } else if (!isValidLength.test(confirmNewPassword)) {
        temp.confirmNewPassword =
          "Password must be between 8 and 16 characters";
      } else if (!isContainsUppercase.test(confirmNewPassword)) {
        temp.confirmNewPassword =
          "Password must contain at least one uppercase letter";
      } else if (!isContainsLowercase.test(confirmNewPassword)) {
        temp.confirmNewPassword =
          "Password must contain at least one lowercase letter";
      } else if (!isContainsNumber.test(confirmNewPassword)) {
        temp.confirmNewPassword = "Password must contain at least one number";
      } else if (!isContainsSymbol.test(confirmNewPassword)) {
        temp.confirmNewPassword =
          "Password must contain at least one special character";
      } else {
        temp.confirmNewPassword = "";
      }
    }
    if (newPassword.length > 0 && confirmNewPassword.length > 0) {
      if (newPassword !== confirmNewPassword) {
        temp.confirmNewPassword = "Passwords do not match";
        temp.newPassword = "Passwords do not match";
      }
    }
    if (clinicAddress.postalCode.length > 0) {
      if (!postalRegex.test(clinicAddress.postalCode)) {
        temp.postalCode = "Invalid Postal Code";
      } else {
        temp.postalCode = "";
      }
    }
    if (clinicContact.length > 0) {
      if (clinicContact.length < 10) {
        temp.clinicContact = "Contact number must be 10 digits";
      } else if (!phoneRegex.test(clinicContact)) {
        temp.clinicContact = "Invalid Phone Number";
      } else {
        temp.clinicContact = "";
      }
    }
    if (socialMediaHandles.facebook.length > 0) {
      if (!isValidURI.test(socialMediaHandles.facebook)) {
        temp.facebookLink = "Enter a valid URI";
      } else {
        temp.facebookLink = "";
      }
    }
    if (socialMediaHandles.twitter.length > 0) {
      if (!isValidURI.test(socialMediaHandles.twitter)) {
        temp.twitterLink = "Enter a valid URI";
      } else {
        temp.twitterLink = "";
      }
    }
    if (socialMediaHandles.instagram.length > 0) {
      if (!isValidURI.test(socialMediaHandles.instagram)) {
        temp.instagramLink = "Enter a valid URI";
      } else {
        temp.instagramLink = "";
      }
    }
    if (socialMediaHandles.linkedin.length > 0) {
      if (!isValidURI.test(socialMediaHandles.linkedin)) {
        temp.linkedInLink = "Enter a valid URI";
      } else {
        temp.linkedInLink = "";
      }
    }

    setErrors({ ...temp });
    const isValid =
      firstName && lastName && Object.values(temp).every((x) => x === "");
    return isValid;
  };

  const handlePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleConfirmPasswordVisibility = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleImageAsFile = (event) => {
    const image = event.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const handleAddNewCourse = (newCourse) => (event) => {
    if (event.key === "Enter") {
      const newCourseList = clinicianProfessionalCourses.concat(newCourse);
      setValues({
        ...values,
        clinicianProfessionalCourses: newCourseList,
        newCourse: "",
      });
    }
  };

  const handleAddNewSpecialty = (newSpecialty) => (event) => {
    if (event.key === "Enter") {
      const newSpecialtyList = clinicianSpecialization.concat(newSpecialty);
      setValues({
        ...values,
        clinicianSpecialization: newSpecialtyList,
        newSpecialty: "",
      });
    }
  };

  const handleFirebaseUpdate = (event) => {
    event.preventDefault();
    console.log("start of upload");
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    console.log(imageAsFile.name);
    setValues({ ...values, profilePhotoUploading: true });
    const storageRef = ref(storage, `/userAvatar/${imageAsFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageAsFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImageAsUrl((prevObject) => ({
            ...prevObject,
            imgUrl: url,
          }));
          setValues({
            ...values,
            profilePhoto: url,
            profilePhotoUploading: false,
          });
        });
      }
    );
  };

  const loadUserProfile = () => {
    setValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        const {
          firstName,
          lastName,
          email,
          role,
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
          meetingLink,
          _id,
        } = response.data;
        setValues({
          ...values,
          firstName,
          lastName,
          email,
          role,
          gender,
          aboutClinician,
          affiliatedFrom,
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
          meetingLink,
          clinicAddress: {
            ...values.clinicAddress,
            address1: clinicAddress.address1,
            address2: clinicAddress.address2,
            city: clinicAddress.city,
            country: clinicAddress.country,
            postalCode: clinicAddress.postalCode,
            province: clinicAddress.province,
          },
          _id,
          loading: false,
        });
      })
      .catch((error) => {
        console.log("User Profile Error", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
        toast.error(error.response.data.error);
      });
  };

  const handleUpdateProfile = (event) => {
    event.preventDefault();
    if (validate()) {
      axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API}/user/update`,
        data: {
          firstName,
          lastName,
          newPassword,
          confirmNewPassword,
          clinicContact,
          aboutClinician,
          title,
          gender,
          clinicAddress,
          clinicName,
          clinicRegisteredYear,
          clinicRegistrationNo,
          clinicianProfessionalCourses,
          clinicianSpecialization,
          socialMediaHandles,
          clinicianTrainedLocation,
          affiliatedFrom,
          dateOfBirth,
          yearsOfExperience,
          profilePhoto,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log("PRIVATE PROFILE UPDATE SUCCESS", response);
          console.log("to be updated response", response.data);
          updateUserInfo(response, () => {
            toast.success("Profile Updated Successfully");
          });
        })
        .catch((error) => {
          console.log(
            "PRIVATE PROFILE UPDATE ERROR",
            error.response.data.errors
          );
          toast.error("Profile Update Failed. Please try again");
          toast.error(error.response.data.errors);
        });
    }
  };

  return (
    <Fragment>
      <NavBreadCrumb path="/edit-profile" name="Edit Profile"></NavBreadCrumb>
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <Fragment>
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "background.paper",
              display: "flex",
              height: 500,
            }}
          >
            <ToastContainer />
            <Tabs
              orientation="vertical"
              value={value}
              onChange={handleTabChange}
              sx={{ borderRight: 1, borderColor: "divider" }}
            >
              <Tab
                label="User Information"
                icon={<PersonIcon />}
                {...a11yProps(0)}
              />
              <Tab
                icon={<KeyIcon />}
                label="Change Password"
                {...a11yProps(1)}
              />
              <Tab
                icon={<LocalHospitalIcon></LocalHospitalIcon>}
                label="Clinic Information"
                {...a11yProps(2)}
              />
              <Tab
                icon={<SchoolIcon></SchoolIcon>}
                label="Clinician Skills"
                {...a11yProps(3)}
              />
              <Tab
                icon={<LocationOnIcon></LocationOnIcon>}
                label="Clinic Address"
                {...a11yProps(4)}
              />
              <Tab
                icon={<ConnectWithoutContactIcon></ConnectWithoutContactIcon>}
                label="Social Accounts"
                {...a11yProps(5)}
              />
            </Tabs>
            <TabPanel variant="scrollable" value={value} index={0}>
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="center"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid item xs={8}>
                  <Box
                    sx={{
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="overline">User Information</Typography>
                    <Typography>AccountID : {_id}</Typography>
                    <Typography>Role : {role}</Typography>
                    <Typography>Username : {username}</Typography>
                    <Typography>
                      Account created on: {Date(createdAt)}
                    </Typography>
                    <Typography> Last updated on: {Date(updatedAt)}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleFirebaseUpdate}
                  >
                    <Avatar
                      alt={`${firstName} ${lastName}`}
                      src={profilePhoto}
                      sx={{ width: 100, height: 100 }}
                    ></Avatar>
                    <Button containerelement="label" size="small">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageAsFile}
                        ref={inputFile}
                      ></input>
                    </Button>
                    <IconButton
                      variant="contained"
                      color="primary"
                      size="small"
                      type="submit"
                    >
                      {profilePhotoUploading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <FileUploadIcon></FileUploadIcon>
                      )}
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Stack spacing={2} direction="row">
                    <FormControl size="small">
                      <InputLabel id="demo-title">Title</InputLabel>
                      <Select
                        required
                        labelId="demo-title"
                        id="demo-title"
                        value={title}
                        label="Title"
                        name="title"
                        onChange={handleChange("title")}
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value={"Dr"}>Dr</MenuItem>
                        <MenuItem value={"Mr"}>Mr</MenuItem>
                        <MenuItem value={"Mrs"}>Mrs</MenuItem>
                        <MenuItem value={"Ms"}>Ms</MenuItem>
                        <MenuItem value={"Miss"}>Miss</MenuItem>
                        <MenuItem value={"Mx"}>Mx</MenuItem>
                        <MenuItem value={"Rev"}>Rev</MenuItem>
                        <MenuItem value={"Sir"}>Sir</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      required
                      autoComplete="given-name"
                      name="firstName"
                      id="firstName"
                      label="First Name"
                      placeholder="Enter first name"
                      size="small"
                      value={firstName}
                      onChange={handleChange("firstName")}
                      {...(errors["firstName"] && {
                        error: true,
                        helperText: errors["firstName"],
                      })}
                    />
                    <TextField
                      required
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                      placeholder="Enter last name"
                      size="small"
                      value={lastName}
                      onChange={handleChange("lastName")}
                      {...(errors["lastName"] && {
                        error: true,
                        helperText: errors["lastName"],
                      })}
                    />
                  </Stack>
                  <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
                    <FormControl sx={{ minWidth: 80 }} size="small">
                      <InputLabel id="demo-experience">Experience</InputLabel>
                      <Select
                        labelId="demo-experience"
                        id="demo-experience"
                        value={yearsOfExperience}
                        label="Experience"
                        name="yearsOfExperience"
                        onChange={handleChange("yearsOfExperience")}
                      >
                        {experienceDropDownValues.map((experience, index) => (
                          <MenuItem key={index} value={experience}>
                            {experience}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 80 }} size="small">
                      <InputLabel id="demo-gender">Gender</InputLabel>
                      <Select
                        labelId="demo-gender"
                        id="demo-gender"
                        value={gender}
                        label="Gender"
                        name="gender"
                        onChange={handleChange("gender")}
                      >
                        <MenuItem value={"male"}>Male</MenuItem>
                        <MenuItem value={"female"}>Female</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      disabled
                      id="email"
                      label="Email Address"
                      name="email"
                      size="small"
                      value={email}
                    />
                  </Stack>
                  <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date of Birth"
                        value={dateOfBirth}
                        onChange={(newValue) => {
                          setValues({
                            ...values,
                            dateOfBirth: newValue,
                          });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <TextField
                      id="clinicianTrainedLocation"
                      label="Clinician Trained Location"
                      name="clinicianTrainedLocation"
                      size="small"
                      placeholder="Enter clinic trained location"
                      value={clinicianTrainedLocation}
                      sx={{ width: 300 }}
                      onChange={handleChange("clinicianTrainedLocation")}
                      {...(errors["clinicianTrainedLocation"] && {
                        error: true,
                        helperText: errors["clinicianTrainedLocation"],
                      })}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack direction="column" spacing={2}>
                    <TextField
                      id="aboutClinician"
                      label="About yourself"
                      name="aboutClinician"
                      placeholder="Add something about yourself..."
                      size="small"
                      multiline
                      rows={10}
                      value={aboutClinician}
                      onChange={handleChange("aboutClinician")}
                      helperText={`${aboutClinician.length}/${ABOUT_CLINICIAN_CHAR_LIMIT}`}
                      {...(errors["aboutClinician"] && {
                        error: true,
                        helperText: errors["aboutClinician"],
                      })}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="meetingLink"
                    label="Meeting Link"
                    name="meetingLink"
                    autoComplete="meetingLink"
                    placeholder="Enter your personal meeting link"
                    size="small"
                    value={meetingLink}
                    onChange={handleChange("meetingLink")}
                    {...(errors["meetingLink"] && {
                      error: true,
                      helperText: errors["meetingLink"],
                    })}
                  />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Typography variant="overline">Update Password</Typography>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter new password"
                size="small"
                autoComplete="new-password"
                value={newPassword}
                sx={{ width: "40ch" }}
                onChange={handleChange("newPassword")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handlePasswordVisibility}
                        aria-label="toggle password"
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon></VisibilityOffIcon>
                        ) : (
                          <VisibilityIcon></VisibilityIcon>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...(errors["newPassword"] && {
                  error: true,
                  helperText: errors["newPassword"],
                })}
              />
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm new password"
                size="small"
                value={confirmNewPassword}
                sx={{ width: "40ch" }}
                onChange={handleChange("confirmNewPassword")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleConfirmPasswordVisibility}
                        aria-label="toggle password"
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon></VisibilityOffIcon>
                        ) : (
                          <VisibilityIcon></VisibilityIcon>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...(errors["confirmNewPassword"] && {
                  error: true,
                  helperText: errors["confirmNewPassword"],
                })}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Typography variant="overline">Clinic Information</Typography>
              <Stack direction="row">
                <FormControl sx={{ minWidth: 80 }} size="small">
                  <InputLabel id="demo-registeredYear">
                    Registered Year
                  </InputLabel>
                  <Select
                    labelId="demo-registeredYear"
                    id="demo-registeredYear"
                    value={clinicRegisteredYear}
                    label="Clinic Registered Year"
                    name="clinicRegisteredYear"
                    onChange={handleChange("clinicRegisteredYear")}
                  >
                    {yearDropDownValues.map((year, index) => (
                      <MenuItem key={index} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  required
                  id="clinicName"
                  label="Clinic Name"
                  name="clinicName"
                  placeholder="Enter clinic name"
                  size="small"
                  value={clinicName}
                  onChange={handleChange("clinicName")}
                  {...(errors["clinicName"] && {
                    error: true,
                    helperText: errors["clinicName"],
                  })}
                />
                <TextField
                  id="clinicContact"
                  label="Clinic contact"
                  name="clinicContact"
                  size="small"
                  pattern="[0-9]*"
                  value={handleContact(clinicContact)}
                  placeholder="(xxx) xxx-xxxx"
                  maxLength="10"
                  minLength="10"
                  sx={{ width: 300 }}
                  onChange={handleChange("clinicContact")}
                  {...(errors["clinicContact"] && {
                    error: true,
                    helperText: errors["clinicContact"],
                  })}
                />
              </Stack>

              <Stack direction="row" sx={{ mt: 2 }}>
                <TextField
                  id="clinicRegistrationNo"
                  label="Clinic registration no"
                  name="clinicRegistrationNo"
                  size="small"
                  value={clinicRegistrationNo}
                  sx={{ width: 300 }}
                  onChange={handleChange("clinicRegistrationNo")}
                  {...(errors["clinicRegistrationNo"] && {
                    error: true,
                    helperText: errors["clinicRegistrationNo"],
                  })}
                />
                <TextField
                  id="affiliatedFrom"
                  label="Affiliated From"
                  name="affiliatedFrom"
                  size="small"
                  placeholder="Enter clinic affiliation name"
                  value={affiliatedFrom}
                  sx={{ width: 300 }}
                  onChange={handleChange("affiliatedFrom")}
                  {...(errors["affiliatedFrom"] && {
                    error: true,
                    helperText: errors["affiliatedFrom"],
                  })}
                />
              </Stack>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Typography variant="overline">Clinician Skills</Typography>
              <TextField
                id="newCourse"
                label="Professional Courses"
                name="newCourse"
                size="small"
                placeholder="Enter course name"
                value={newCourse}
                sx={{ width: 300 }}
                onChange={handleChange("newCourse")}
                onKeyDown={handleAddNewCourse(newCourse)}
                {...(errors["newCourse"] && {
                  error: true,
                  helperText: errors["newCourse"],
                })}
              />

              {clinicianProfessionalCourses.length > 0
                ? clinicianProfessionalCourses.map((course, index) => (
                    <Chip size="small" key={index} label={course} />
                  ))
                : ""}

              <TextField
                id="newSpecialty"
                label="Add new specialization"
                name="newSpecialty"
                size="small"
                placeholder="Add new specialization"
                value={newSpecialty}
                sx={{ width: 300 }}
                onChange={handleChange("newSpecialty")}
                onKeyDown={handleAddNewSpecialty(newSpecialty)}
                {...(errors["newSpecialty"] && {
                  error: true,
                  helperText: errors["newSpecialty"],
                })}
              />

              {clinicianSpecialization.length > 0
                ? clinicianSpecialization.map((specialty, index) => (
                    <Chip size="small" key={index} label={specialty} />
                  ))
                : ""}
            </TabPanel>
            <TabPanel value={value} index={4}>
              <Typography variant="overline">Clinic Address</Typography>
              <Stack direction="row" sx={{ mt: 2 }}>
                <TextField
                  id="address1"
                  label="address1"
                  name="address1"
                  placeholder="Enter Address"
                  size="small"
                  value={clinicAddress.address1}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      clinicAddress: {
                        ...values.clinicAddress,
                        address1: e.target.value,
                      },
                    })
                  }
                  {...(errors["address1"] && {
                    error: true,
                    helperText: errors["address1"],
                  })}
                />
                <TextField
                  id="address2"
                  label="address2"
                  name="address2"
                  placeholder="Enter Address"
                  size="small"
                  value={clinicAddress.address2}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      clinicAddress: {
                        ...values.clinicAddress,
                        address2: e.target.value,
                      },
                    })
                  }
                  {...(errors["address2"] && {
                    error: true,
                    helperText: errors["address2"],
                  })}
                />
                <TextField
                  id="city"
                  label="city"
                  name="city"
                  placeholder="Enter city"
                  size="small"
                  value={clinicAddress.city}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      clinicAddress: {
                        ...values.clinicAddress,
                        city: e.target.value,
                      },
                    })
                  }
                  {...(errors["city"] && {
                    error: true,
                    helperText: errors["city"],
                  })}
                />
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <InputLabel id="demo-country">Country</InputLabel>
                  <Select
                    labelId="demo-country"
                    id="demo-country"
                    value={clinicAddress.country}
                    label="country"
                    name="country"
                    onChange={(e) =>
                      setValues({
                        ...values,
                        clinicAddress: {
                          ...values.clinicAddress,
                          country: e.target.value,
                        },
                      })
                    }
                  >
                    {countriesList.map((country, index) => (
                      <MenuItem key={index} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <InputLabel id="demo-province">Province</InputLabel>
                  <Select
                    labelId="demo-province"
                    id="demo-province"
                    value={clinicAddress.province}
                    label="province"
                    name="province"
                    onChange={(e) =>
                      setValues({
                        ...values,
                        clinicAddress: {
                          ...values.clinicAddress,
                          province: e.target.value,
                        },
                      })
                    }
                  >
                    {provincesList.map((province, index) => (
                      <MenuItem key={index} value={province.value}>
                        {province.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  id="postalCode"
                  label="Postal Code"
                  name="postalCode"
                  placeholder="Enter postal code"
                  size="small"
                  value={clinicAddress.postalCode}
                  maxLength={6}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      clinicAddress: {
                        ...values.clinicAddress,
                        postalCode: e.target.value,
                      },
                    })
                  }
                  {...(errors["postalCode"] && {
                    error: true,
                    helperText: errors["postalCode"],
                  })}
                />
              </Stack>
            </TabPanel>
            <TabPanel value={value} index={5}>
              <Typography variant="overline">Social Accounts</Typography>
              <Stack direction="column">
                <TextField
                  id="facebookLink"
                  label="Facebook"
                  name="facebookLink"
                  size="small"
                  placeholder="Enter facebook profile link"
                  value={socialMediaHandles.facebook}
                  sx={{ width: 300 }}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      socialMediaHandles: {
                        ...values.socialMediaHandles,
                        facebook: e.target.value,
                      },
                    });
                  }}
                  {...(errors["facebookLink"] && {
                    error: true,
                    helperText: errors["facebookLink"],
                  })}
                />
                <UILink href={socialMediaHandles.facebook} underline="always">
                  {socialMediaHandles.facebook}
                </UILink>
                <TextField
                  id="twitterLink"
                  label="Twitter"
                  name="twitterLink"
                  size="small"
                  placeholder="Enter twitter profile link"
                  value={socialMediaHandles.twitter}
                  sx={{ width: 300 }}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      socialMediaHandles: {
                        ...values.socialMediaHandles,
                        twitter: e.target.value,
                      },
                    });
                  }}
                  {...(errors["twitterLink"] && {
                    error: true,
                    helperText: errors["twitterLink"],
                  })}
                />
                <TextField
                  id="linkedInLink"
                  label="LinkedIn"
                  name="linkedInLink"
                  size="small"
                  placeholder="Enter linkedIn profile link"
                  value={socialMediaHandles.linkedin}
                  sx={{ width: 300 }}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      socialMediaHandles: {
                        ...values.socialMediaHandles,
                        linkedin: e.target.value,
                      },
                    });
                  }}
                  {...(errors["linkedInLink"] && {
                    error: true,
                    helperText: errors["linkedInLink"],
                  })}
                />
                <TextField
                  id="instagramLink"
                  label="Instagram"
                  name="instagramLink"
                  size="small"
                  placeholder="Enter facebook profile link"
                  value={socialMediaHandles.instagram}
                  sx={{ width: 300 }}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      socialMediaHandles: {
                        ...values.socialMediaHandles,
                        instagram: e.target.value,
                      },
                    });
                  }}
                  {...(errors["instagramLink"] && {
                    error: true,
                    helperText: errors["instagramLink"],
                  })}
                />
              </Stack>
            </TabPanel>
          </Box>
          <Button
            onClick={handleUpdateProfile}
            sx={{ mt: 2, boxShadow: 10 }}
            variant="contained"
          >
            Update
          </Button>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UserEditProfile;

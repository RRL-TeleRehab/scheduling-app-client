import React, { Fragment, useState, useEffect, useRef } from "react";
import NavBreadCrumb from "./NavBreadCrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import axios from "axios";
import {
  isAuth,
  getCookie,
  signout,
  updateUserInfo,
} from "../../Common/helpers";
import {
  CircularProgress,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Avatar,
  Button,
  Box,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import storage from "../../firebase";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const AdminProfile = ({ history }) => {
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
    createdAt: "",
    updatedAt: "",
    profilePhoto: "",
    username: "",
    _id: "",
    loading: false,
    profilePhotoUploading: false,
  });
  const [errors, setErrors] = useState({});
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);
  const inputFile = useRef(null);

  const {
    firstName,
    lastName,
    email,
    loading,
    role,
    newPassword,
    confirmNewPassword,
    showPassword,
    showConfirmPassword,
    createdAt,
    updatedAt,
    username,
    profilePhotoUploading,
    _id,
    profilePhoto,
  } = values;

  const token = getCookie("token");

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
          createdAt,
          updatedAt,
          profilePhoto,
          username,
          _id,
        } = response.data;
        setValues({
          ...values,
          firstName,
          lastName,
          email,
          role,
          createdAt,
          updatedAt,
          profilePhoto,
          username,
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

  useEffect(() => {
    loadUserProfile();
  }, []);

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

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handlePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleConfirmPasswordVisibility = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleImageAsFile = (event) => {
    const image = event.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const validate = () => {
    let temp = { ...errors };
    const isNameValid = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
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
    setErrors({ ...temp });
    const isValid =
      firstName && lastName && Object.values(temp).every((x) => x === "");
    return isValid;
  };

  const handleUpdateProfile = (event) => {
    event.preventDefault();
    if (validate()) {
      axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API}/admin/update`,
        data: {
          firstName,
          lastName,
          newPassword,
          confirmNewPassword,
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
      <ToastContainer></ToastContainer>
      <NavBreadCrumb path="/admin/profile" name="/Profile"></NavBreadCrumb>
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <Fragment>
          <Typography>AccountID : {_id}</Typography>
          <Typography>Role : {role}</Typography>
          <Typography>Username : {username}</Typography>
          <Typography>Account created on: {Date(createdAt)}</Typography>
          <Typography> Last updated on: {Date(updatedAt)}</Typography>
          <Box component="form" noValidate onSubmit={handleFirebaseUpdate}>
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
          <TextField
            disabled
            id="email"
            label="Email Address"
            name="email"
            size="small"
            value={email}
          />
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

export default AdminProfile;

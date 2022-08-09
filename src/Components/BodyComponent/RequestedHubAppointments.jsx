import React, { useEffect, useState, Fragment } from "react";
import NavBreadCrumb from "./NavBreadCrumb";
import axios from "axios";
import { getCookie, convertToDate } from "../../Common/helpers";
import { styled } from "@mui/material/styles";
import {
  CircularProgress,
  Tooltip,
  Avatar,
  Button,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  tableCellClasses,
  TableCell,
  Typography,
  Badge,
  Stack,
  Pagination,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { Link } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: theme.palette.common.white,
    padding: 8,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 8,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const tableHeadStyle = {
  textTransform: "uppercase",
  minWidth: 700,
};

const RequestedHubAppointments = () => {
  const [values, setValues] = useState({
    requestedAppointments: [],
    loading: false,
    numberOfPages: 0,
    pageNumber: 1,
  });
  const { requestedAppointments, loading, numberOfPages, pageNumber } = values;

  const token = getCookie("token");

  const handleChange = (event, newPage) => {
    setValues({ ...values, pageNumber: newPage });
  };

  const getRequestedAppointments = () => {
    setValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/request-appointment?page=${pageNumber}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setValues({
          ...values,
          requestedAppointments: response.data.appointments,
          numberOfPages: response.data.totalPages,
          loading: false,
        });
      })
      .catch((error) => {
        setValues({ ...values, loading: false });
        console.log("Appointments Info Error", error.response.data.error);
      });
  };

  useEffect(() => {
    getRequestedAppointments();
  }, [pageNumber]);

  return (
    <Fragment>
      <NavBreadCrumb
        path="/request/appointment"
        name="/requested/Appointments"
      ></NavBreadCrumb>{" "}
      {loading ? (
        <CircularProgress color="inherit" />
      ) : (
        <Fragment>
          {requestedAppointments.length > 0 ? (
            <Fragment>
              <TableContainer component={Paper}>
                <Table sx={tableHeadStyle} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell>Requested By</StyledTableCell>
                      <StyledTableCell>Requested For</StyledTableCell>
                      <StyledTableCell>Appointment Date</StyledTableCell>
                      <StyledTableCell>Appointment Time</StyledTableCell>
                      <StyledTableCell colSpan={2}>
                        Appointment Status
                      </StyledTableCell>
                      <StyledTableCell colSpan={2}>
                        Appointment request Id
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requestedAppointments.map((row) => (
                      <StyledTableRow
                        style={{ textAlign: "left" }}
                        key={row._id}
                      >
                        <StyledTableCell>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            badgeContent={
                              <SmallAvatar
                                alt="img"
                                src={row.requestedTo.profilePhoto}
                              />
                            }
                          >
                            <Avatar
                              alt="img"
                              src={row.requestedBy.profilePhoto}
                            ></Avatar>
                          </Badge>
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.requestedBy.firstName} {row.requestedBy.lastName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.requestedFor.firstName}{" "}
                          {row.requestedFor.lastName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {convertToDate(row.appointmentDate)}
                        </StyledTableCell>
                        <StyledTableCell>{row.appointmentTime}</StyledTableCell>
                        <StyledTableCell>{row.status}</StyledTableCell>
                        <StyledTableCell>
                          <Tooltip
                            title={
                              row.status === "pending" ? "PENDING" : "REJECTED"
                            }
                          >
                            <span>
                              <Button>
                                {row.status === "pending" && (
                                  <HelpIcon color="primary"></HelpIcon>
                                )}
                                {row.status === "rejected" && (
                                  <CancelIcon color="error"></CancelIcon>
                                )}
                              </Button>
                            </span>
                          </Tooltip>
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row._id}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Tooltip title="more information">
                            <Button
                              size="small"
                              component={Link}
                              to={`/request/appointment/${row._id}`}
                            >
                              <OpenInFullIcon
                                color="primary"
                                size="small"
                              ></OpenInFullIcon>
                            </Button>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack sx={{ m: 2 }} alignItems="center">
                <Pagination
                  count={numberOfPages}
                  defaultPage={pageNumber}
                  color="primary"
                  onChange={handleChange}
                />
              </Stack>
            </Fragment>
          ) : (
            <Typography>No appointment requests found</Typography>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default RequestedHubAppointments;

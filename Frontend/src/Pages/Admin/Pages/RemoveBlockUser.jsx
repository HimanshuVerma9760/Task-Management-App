import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  Button,
  CircularProgress,
  Grid2,
  Input,
  ListItemButton,
  TableHead,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Form, Link, useNavigate, useNavigation } from "react-router-dom";
// import ModalContent from "./Modal/ModalContent";
// import useAuth from "../util/hooks/useAuth";
import { Search } from "@mui/icons-material";
import useAdminAuth from "../../../util/hooks/useAdminAuth";
import AdminModal from "../Components/Modal/AdminModel";
import ModalContent from "../../../components/Modal/ModalContent";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(
  id,
  fullName,
  userName,
  email,
  createdAt,
  isVerified,
  isBlocked
) {
  return { id, fullName, userName, email, createdAt, isVerified, isBlocked };
}

export default function RemoveBlockUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [myUsers, setMyUsers] = useState([]);
  const [totalUsers, setTotalTasks] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function onChangeHandler(event) {
    const id = event.target.id || event.target.name;
    const value = event.target.value;
    switch (id) {
      case "search":
        setSearch(value);
    }
  }
  async function fetchData() {
    const verifyToken = await useAdminAuth();
    if (verifyToken.response) {
      try {
        const response = await fetch(
          `http://localhost:3000/admin/get-users/${localStorage.getItem(
            "token"
          )}/${search.length === 0 ? "all" : search}/?page=${
            page + 1
          }&limit=${rowsPerPage}`
        );
        if (response) {
          if (response.ok) {
            const result = await response.json();
            console.log(result.myUsers);
            setMyUsers(result.myUsers);
            setTotalTasks(result.totalUsers);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Something went wrong..!!", error);
      }
    } else {
    }
  }
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  let rows;
  rows = myUsers.map((eachUser) =>
    createData(
      eachUser._id,
      eachUser.fullName,
      eachUser.userName,
      eachUser.email,
      eachUser.createdAt.split("T")[0],
      eachUser.isVerified,
      eachUser.isBlocked
    )
  );

  async function onSubmitHandler(event) {
    event.preventDefault();
    setMyUsers([]);
    setIsLoading(true);
    fetchData();
  }
  const [showModal, setShowModal] = useState({
    state: false,
    type: "",
    id: "",
  });
  async function removeUserHandler(id) {
    const verifyToken = await useAdminAuth();
    if (!verifyToken.response) {
      setIsAuthenticated(false);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/admin/remove-user/${id}/${localStorage.getItem(
          "token"
        )}`
      );
      if (response.ok) {
        setMessage("Operation Successfull!");
        fetchData();
      } else {
        console.log(response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
    handleCloseModal();
  }
  async function blockUserHandler(id) {
    const verifyToken = await useAdminAuth();
    if (!verifyToken.response) {
      setIsAuthenticated(false);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/admin/block-user/${id}/${localStorage.getItem(
          "token"
        )}`
      );
      if (response.ok) {
        setMessage("Operation Successfull!");
        fetchData();
      } else {
        console.log(response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
    handleCloseModal();
  }
  function popUpModel(id, type) {
    console.log("pop up");
    setShowModal({
      state: true,
      type: type,
      id: id,
    });
  }
  const handleCloseModal = () => {
    setShowModal({
      state: false,
      type: "",
      id: "",
    });
  };
  if (showModal.state) {
    return (
      <AdminModal
        isOpen={showModal.state}
        onClose={handleCloseModal}
        type={showModal.type}
        id={showModal.id}
      />
    );
  }
  if (!isAuthenticated) {
    return (
      <ModalContent
        isOpen={showSignupPrompt}
        onClose={handleCloseSignupPrompt}
        message={{
          message: "Sign Up Required",
          caption: "You need to sign up to add tasks.",
        }}
        btn={{ text: "Go to Sign up", loc: "/" }}
      />
    );
  }
  return (
    <Box>
      <Grid2
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          height: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        <Grid2>
          <Form onSubmit={onSubmitHandler}>
            <Input
              type="search"
              disableUnderline
              id="search"
              name="search"
              value={search}
              placeholder="Search by Name"
              onChange={onChangeHandler}
              sx={{
                backgroundColor: "whitesmoke",
                borderRadius: "15px",
                width: "35rem",
                height: "2rem",
                padding: "1.2rem",
              }}
            />
            <IconButton type="submit">
              <Search />
            </IconButton>
            <Typography variant="caption" color="green">
              {message}
            </Typography>
          </Form>
        </Grid2>
      </Grid2>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "90%",
          margin: "auto",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          boxShadow: "0px 0px 3px 0px",
        }}
      >
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow sx={{ marginBottom: "2rem" }}>
              <TableCell>
                <Typography variant="h5" color="green" align="left">
                  Name
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5" color="green" align="left">
                  Username
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5" color="green" align="center">
                  Email
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h5" color="green">
                  Created
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5" color="green">
                  Verified
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5" color="green">
                  Blocked
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5" color="green">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <Grid2 sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Grid2>
            ) : myUsers.length === 0 ? (
              <Typography variant="h5" color="red" align="center">
                No User
              </Typography>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    <Link
                      to={`/taskDetailPage/${row.id}`}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItemButton>
                        {row.fullName.split(" ")[0]}
                      </ListItemButton>
                    </Link>
                  </TableCell>
                  <TableCell style={{ width: 145 }} align="left">
                    {row.userName}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {row.email}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="left">
                    {row.createdAt}
                  </TableCell>
                  <TableCell style={{ width: 50 }} align="center">
                    {row.isVerified.toString()}
                  </TableCell>
                  <TableCell style={{ width: 50 }} align="center">
                    {row.isBlocked.toString()}
                  </TableCell>
                  <TableCell style={{ width: 150 }} align="right">
                    <Button
                      onClick={() =>
                        popUpModel(row.id, {
                          message: "This action will remove the user.",
                          func: removeUserHandler,
                        })
                      }
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={() =>
                        popUpModel(row.id, {
                          message:
                            "This action will block the user permanently.",
                          func: blockUserHandler,
                        })
                      }
                    >
                      Block
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={5}
                count={totalUsers}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}

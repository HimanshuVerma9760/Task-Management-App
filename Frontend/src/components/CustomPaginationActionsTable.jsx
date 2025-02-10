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
  CircularProgress,
  Grid2,
  Input,
  InputAdornment,
  ListItemButton,
  MenuItem,
  Select,
  TableHead,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Form, Link } from "react-router-dom";
import ModalContent from "./Modal/ModalContent";
import useAuth from "../util/hooks/useAuth";
import { Search } from "@mui/icons-material";

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

function createData(id, taskName, taskDate, taskPriority) {
  return { id, taskName, taskDate, taskPriority };
}

export default function CustomPaginationActionsTable() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function checkAuth(params) {
      const token = await useAuth();
      if (!token.result) {
        setShowSignupPrompt(true);
      } else {
        setIsAuthenticated(true);
      }
    }
    checkAuth();
  }, []);

  const handleCloseSignupPrompt = () => {
    setShowSignupPrompt(false);
  };
  const [myTasks, setMyTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [priorityFilter, setPriorityFilter] = useState("Filter by Priority");

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
      case "priorityFilter":
        setIsLoading(true);
        setPriorityFilter(value);
        setMyTasks([]);
        break;
      case "search":
        setSearch(value);
    }
  }
  async function fetchData() {
    const verifyToken = await useAuth();
    if (verifyToken.result) {
      try {
        const response = await fetch(
          `http://localhost:3000/tasks/${localStorage.getItem("token")}/${
            search.length === 0 ? "all" : search
          }/?page=${page + 1}&limit=${rowsPerPage}&s=${priorityFilter}`
        );
        if (response) {
          if (response.ok) {
            const result = await response.json();
            setMyTasks(result.myTasks);
            setTotalTasks(result.totalTasks);
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
  }, [page, rowsPerPage, priorityFilter]);

  let rows;
  rows = myTasks.map((eachTask) =>
    createData(
      eachTask._id,
      eachTask.taskName,
      eachTask.taskDate.split("T")[0],
      eachTask.taskPriority
    )
  );
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

  async function onSubmitHandler(event) {
    event.preventDefault();
    setMyTasks([]);
    setIsLoading(true);
    fetchData();
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
              placeholder="Search by Task Name"
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
          </Form>
        </Grid2>

        <Select
          value={priorityFilter}
          name="priorityFilter"
          id="priorityFilter"
          onChange={onChangeHandler}
          sx={{ padding: "1rem", width: "12rem", textAlign: "center" }}
          onClick={() => setPage(0)}
        >
          <MenuItem value="Filter by Priority" disabled={true}>
            Filter by Priority
          </MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </Grid2>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "70%",
          margin: "auto",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow sx={{marginBottom:"2rem"}}>
              <TableCell>
                <Typography variant="h5" color="green">
                  Name
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5" color="green">
                  Date
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5" color="green">
                  Priority
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <Grid2 sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Grid2>
            ) : myTasks.length === 0 ? (
              <Typography variant="h5" color="red" align="center">
                No Tasks
              </Typography>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    <Link
                      to={`/taskDetailPage/${row.id}`}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItemButton>{row.taskName}</ListItemButton>
                    </Link>
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.taskDate}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.taskPriority}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={2}
                count={totalTasks}
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

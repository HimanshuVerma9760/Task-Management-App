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
  Grid2,
  ListItemButton,
  MenuItem,
  Select,
  TableHead,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModalContent from "./Modal/ModalContent";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowSignupPrompt(true);
    } else {
      setIsAuthenticated(true);
    }
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
        setPriorityFilter(value);
        break;
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:3000/tasks?page=${
            page + 1
          }&limit=${rowsPerPage}&s=${priorityFilter}`
        );
        if (!response.ok) {
          console.log(response.statusText);
        } else {
          const result = await response.json();
          console.log(result);
          setMyTasks(result.allTasks);
          setTotalTasks(result.totalTasks);
          console.log(result);
          console.log("Tasks fetched successfully!");
        }
      } catch (error) {
        console.error("Something went wrong..!!", error);
      }
    }
    fetchData();
  }, [page, rowsPerPage, priorityFilter]);

  const rows = myTasks.map((eachTask) =>
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
      />
    );
  }

  return (
    <Box>
      <Grid2
        sx={{
          display: "flex",
          justifyContent: "right",
          height: "2rem",
          marginRight: "12rem",
          marginBottom: "1rem",
        }}
      >
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
          <MenuItem value="All">All</MenuItem>
        </Select>
      </Grid2>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: "70%", margin: "auto" }}
      >
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
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
            {rows.map((row) => (
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
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={totalTasks}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
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

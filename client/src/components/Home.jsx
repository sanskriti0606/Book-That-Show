import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import SelectMovie from "./SelectMovie";
import SelectTimeSlot from "./SelectTimeSlot";
import SelectSeats from "./SelectSeats";
import LastBookingDetails from "./LastBookingDetails";
import { movies, seats, slots } from "./data";
import useLocalStorage from "./UseLocalStorage";
// import axios from "../axiosConfig";
import axios from "axios";

// validation on negative numbers for seat input
function containNegativeVal(seats) {
  let hasNegativeValue = false;

  for (const seat in seats) {
    //check if the number is negative
    if (seats.hasOwnProperty(seat) && seats[seat] < 0) {
      hasNegativeValue = true;
      break;
    }
  }

  return hasNegativeValue;
}

const initialState = {
  movie: "",
  timeSlots: "",
  seats: {
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    d1: 0,
    d2: 0,
  },
};

const Home = () => {
  const [state, setState] = useLocalStorage("state", initialState);

  const [lastBooking, setLastBooking] = useState({
    movie: "",
    timeSlots: "",
    isFinishLoading: false,
    dataPresent: false,
    isLoading: false,
    error: null,
    seats: {
      a1: 0,
      a2: 0,
      a3: 0,
      a4: 0,
      d1: 0,
      d2: 0,
    },
  });

  useEffect(() => {
    //getting api data
    setLastBooking({ isFinishLoading: false });

    axios
      .get("https://book-that-show.onrender.com/api/booking")
      .then((res) => {
        if (typeof res.data.message === "string") {
          setLastBooking({
            ...lastBooking,
            error: res.data.message,
            isFinishLoading: true,
            dataPresent: false,
          });
        } else if (res.data.data) {
          let { movie, slot, seats } = res.data.data;

          setLastBooking({
            ...lastBooking,
            movie: movie,
            timeSlots: slot,
            dataPresent: true,
            isFinishLoading: true,
            seats: {
              a1: seats.A1 ? seats.A1 : 0,
              a2: seats.A2 ? seats.A2 : 0,
              a3: seats.A3 ? seats.A3 : 0,
              a4: seats.A4 ? seats.A4 : 0,
              d1: seats.D1 ? seats.D1 : 0,
              d2: seats.D2 ? seats.D2 : 0,
            },
            error: null,
          });
        } else {
          setLastBooking({
            ...lastBooking,
            dataPresent: false,
            isFinishLoading: true,
          });
        }
      })
      .catch((error) => {
        setLastBooking({
          ...lastBooking,
          dataPresent: false,
          isFinishLoading: true,
        });
      });
  }, []);

  // set state of movie selector in a function
  const movieSelectHandler = (item) => {
    //update state
    setState((preState) => ({
      ...preState,
      movie: item,
    }));
  };

  // set state of time Slot in a function
  const timeSlotSelectHandler = (item) => {
    //update state
    setState((preState) => ({
      ...preState, //copy
      timeSlots: item,
    }));
  };

  //set state of seats in a function
  const seatSelectHandler = (e) => {
    setState({
      ...state,
      seats: {
        ...state.seats,
        [e.target.name]: e.target.value,
      },
    });
  };

  const submitBooking = (e) => {
    const { movie, timeSlots, seats } = state;

    // Validation
    const notSelectedAnySeat = Object.values(seats).every(
      (field) => field === 0
    );

    if (movie === "") {
      enqueueSnackbar("Please Select a movie", { variant: "error" });
      return;
    } else if (timeSlots === "") {
      enqueueSnackbar("Please Select a time slot", { variant: "error" });
      return;
    } else if (notSelectedAnySeat) {
      enqueueSnackbar("Please Select Atleast one seat", { variant: "error" });
      return;
    } else if (containNegativeVal(seats)) {
      enqueueSnackbar("Invalid Seat Entered, Please re-Submit", {
        variant: "error",
      });
      return;
    }

    setLastBooking({
      ...lastBooking,

      isLoading: true,
    });

    //post request
    axios
      .post("https://book-that-show.onrender.com/api/booking", {
        movie: state.movie,
        slot: state.timeSlots,
        seats: {
          A1: Number(state.seats.a1),
          A2: Number(state.seats.a2),
          A3: Number(state.seats.a3),
          A4: Number(state.seats.a4),
          D1: Number(state.seats.d1),
          D2: Number(state.seats.d2),
        },
      })

      .then((res) => {
        if (res.status === 200) {
          //set state in last bookings details
          setLastBooking({
            ...lastBooking,
            movie: state.movie,
            timeSlots: state.timeSlots,
            dataPresent: true,
            iSFinishLoading: true,
            isLoading: false,
            seats: {
              a1: state.seats.a1,
              a2: state.seats.a2,
              a3: state.seats.a3,
              a4: state.seats.a4,
              d1: state.seats.d1,
              d2: state.seats.d2,
            },
          });
          setState({
            ...state,
            movie: "",
            timeSlots: "",
            dataPresent: false,

            iSFinishLoading: false,
            seats: {
              a1: 0,
              a2: 0,
              a3: 0,
              a4: 0,
              d1: 0,
              d2: 0,
            },
          });
        }
        enqueueSnackbar("Booking successful!", { variant: "success" });
      })
      .catch((error) => {
        setLastBooking({
          ...lastBooking,
          isLoading: false,
        });
        console.log(error);
      });
  };
  return (
    <Container className="mt-5 bg-custom">
      <SnackbarProvider />
      {/* Main Heading */}
      <Row>
        <Col className="p-3">
          <h3 className="">Book That Show!!</h3>
        </Col>
      </Row>

      <Row>
        <Col md={8} lg={8} sm={8} xs={12}>
          {/* Movies Container */}
          <SelectMovie
            mainHeading="Select a Movie"
            items={movies}
            selectedValue={state.movie}
            onClick={movieSelectHandler}
            display="block"
          />
          {/* Time slot Container */}
          <SelectTimeSlot
            mainHeading="Select a Time Slot"
            items={slots}
            selectedValue={state.timeSlots}
            onClick={timeSlotSelectHandler}
            display="block"
          />

          {/* Seats Container */}
          <SelectSeats
            mainHeading="Select the Seats"
            items={seats}
            type="number"
            selectedValue={state.seats}
            seats={state.seats}
            onChange={seatSelectHandler}
            submitBooking={submitBooking}
          />
        </Col>

        {/* Last Booking Container */}

        <Col md={4} lg={4} sm={4} xs={12} className="text-center">
          <LastBookingDetails
            movieName={lastBooking.movie}
            finishLoading={lastBooking.isFinishLoading}
            timing={lastBooking.timeSlots}
            seat={lastBooking.seats}
            lastBookingPresent={lastBooking.dataPresent}
            errorMsg={lastBooking?.error}
            loading={lastBooking.isLoading}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

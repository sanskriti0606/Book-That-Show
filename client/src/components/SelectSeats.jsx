import React from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";

const SelectSeats = (props) => {
  const { mainHeading, seats, items, onChange, submitBooking } = props;
  return (
    <>
      <Container className="container-fluid ContainerStyle">
        <Row>
          <h4 className="ContainerHeading">{mainHeading}</h4>
          <ButtonGroup
            aria-label="Basic outlined example"
            style={{ display: "contents" }}
            className=""
          >
            {/* map function is used for movie, time slot and seat container */}
            {items.map((item, index) => (
              <Col lg={2} md={2} xs={6} sm={3} key={index}>
                <div className="seatWrapper">
                  <label htmlFor={`seat-${item}`}>{`Type ${item}`}</label>
                  <input
                    className="form-control"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                    type="number"
                    name={item.toLowerCase()}
                    value={seats && seats[item.toLowerCase()]}
                    onChange={(e) => onChange(e)}
                    style={{ width: "77%" }}
                    id={`seat-${item}`}
                  />
                </div>
              </Col>
            ))}
          </ButtonGroup>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>
            {/* book now button */}
            <div className="book-button">
              <button
                // className="btn btn-success"
                variant="success"
                onClick={submitBooking}
              >
                <span>Book Now</span>
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectSeats;

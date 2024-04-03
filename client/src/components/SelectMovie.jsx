import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";

const SelectMovie = (props) => {
  const { mainHeading, items, selectedValue, onClick } = props;
  return (
    <Container className="container-fluid ContainerStyle">
      <Row className="gx-4">
        <Col xs={12} md={12}>
          <h4 className="ContainerHeading">{mainHeading}</h4>
          <ButtonGroup
            aria-label="Basic outlined example"
            className="d-inline-block"
          >
            {items.map((item, i) => (
              <React.Fragment key={i}>
                <button
                  type="button"
                  className={
                    item === selectedValue
                      ? "btn btn-danger btn-active shadow-none btnSelector"
                      : "btn btn-outline-secondary btnSelector"
                  }
                  style={{
                    marginRight: "15px",
                    marginBottom: "19px",
                    borderRadius: "7px",
                  }}
                  onClick={() => onClick(item)}
                >
                  {item}
                </button>
              </React.Fragment>
            ))}
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default SelectMovie;

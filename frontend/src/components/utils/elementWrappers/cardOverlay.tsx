import React, { FunctionComponent } from "react";
import { Modal, Container } from "react-bootstrap";
import styled from "styled-components";

const Overlay = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  min-height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10;
  .card-overlay {
    margin: 5rem auto;
    max-width: 40rem;
  }
  .rel {
    position: relative;
  }
  .exit-container {
    z-index: 100;
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: flex-end;
  }
  .card-container {
    max-height: calc(100vh - 10rem);
  }
  .scroller-box {
    overflow-y: auto !important;
    overflow-x: hidden !important;
  }
`;

interface Props {
  closeOverlay: Function;
  title: string;
}

const CardOverlay: FunctionComponent<Props> = props => (
  <Overlay>
    <Container className="card-overlay rel">
      <Modal
        className="card-container"
        show={true}
        onHide={() => props.closeOverlay()}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="scroller-box">{props.children}</Modal.Body>
      </Modal>
    </Container>
  </Overlay>
);

export default CardOverlay;

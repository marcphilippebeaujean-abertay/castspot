import React from "react";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import { Route } from "react-router-dom";

import FunctionalityRoutes from "./views/bodyRoutes";
import NavBar from "./navigation/navMenu";
import AlertsContainer from "./alerting/alertsContainer";
import SessionChecker from "./utils/sessionChecker";
import LandingPage from "./views/landingPage";
import Footer, { footerHeight } from "./footer";
import ScrollToTopOnRouteChange from "./utils/scrollToTopOnRouteChange";
import FAQSection, { faqLink } from "./views/faq/faqSection";

const Background = styled.div`
  width: 100%;
  min-height: 100vh;
  margin: 0;
  position: relative;
  .content-wrapper {
    padding-bottom: ${footerHeight};
  }
`;

function App() {
  return (
    <Background className="bg-light">
      <Container fluid className="px-0 main content-wrapper">
        <ScrollToTopOnRouteChange />
        <SessionChecker />
        <NavBar />
        <Route path={"/home"}>
          <LandingPage />
        </Route>
        <Route path={faqLink.link} component={FAQSection} />
        <Container className="mt-2">
          <AlertsContainer />
          <FunctionalityRoutes />
        </Container>
      </Container>
      <Footer />
    </Background>
  );
}

export default App;

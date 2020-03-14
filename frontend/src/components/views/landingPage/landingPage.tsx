import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import styled from "styled-components";
import * as Io from "react-icons/io";
import * as Fa from "react-icons/fa";

import IconWrapper from "../../utils/elementWrappers/IconWrapper";
import PodcastSVG from "../../../images/undraw_podcast_q6p7.svg";
import SecuritySVG from "../../../images/undraw_security_o890.svg";
import Logo from "../../../images/logo_castspot.svg";
import Carousel from "./carousel";
import { register } from "../userAccess/userAccessLinks";
import { themeColour } from "../../../constants/style";

const Banner = styled.div`
  #logo {
    display: block;
    max-width: 800px;
    width: 100%;
    height: auto;
  }
  color: ${themeColour} !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 25px;
  padding: 1rem 0;
  background-color: rgba(0, 0, 0, 0) !important;
  a:hover {
    text-decoration: none !important;
  }
`;

const FeatureList = styled.ul`
  list-style-type: none;
  text-align: center;
  padding-left: 0;
`;

const ConversionButton = styled(Button)`
  padding: 1rem !important;
  display: block;
  border: none;
  color: white;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  border-radius: 50px !important;
  margin: 0 auto;
  transition: ease-in 0.2s;
`;

const MainImage = styled.img`
  max-width: 100%;
  overflow: hidden;
  height: auto;
`;

const Section = styled.section`
  max-width: 100%;
`;

export const SectionMainBg = styled(Section)`
  background-color: ${themeColour};
  box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.3);
  color: white;
`;

const CardOnPurpleBg = styled(Card)`
  color: black;
  margin-bottom: 2rem;
  .hr-sect {
    display: flex;
    flex-basis: 100%;
    align-items: center;
    color: rgba(0, 0, 0, 0.35);
    font-size: 12px;
    margin: 8px 0px;
  }
  .hr-sect::before,
  .hr-sect::after {
    content: "";
    flex-grow: 1;
    background: rgba(0, 0, 0, 0.35);
    height: 1px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 16px;
  }
`;

export default () => {
  const dispatch = useDispatch();
  return (
    <div>
      <Banner>
        <div
          style={{
            maxWidth: "90%",
            minHeight: "90vh",
            display: "block",
            margin: "0 auto"
          }}
          className="d-flex flex-column"
        >
          <div
            style={{
              minHeight: "40vh",
              width: "100%",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <img
              src={Logo}
              alt="CastSpot Logo"
              style={{ maxWidth: "500px", width: "100%", height: "auto" }}
            />
          </div>
          <div className="d-block">
            <div className="text-center">
              <h1>
                <i className="mb-3">The fastest way to grow a Podcast?</i>
              </h1>
              <h1>
                <b>Working with other Podcasters.</b>
              </h1>
            </div>
          </div>
          <h3 className="text-center mt-1">
            Feature them on your show or become a Guest Speaker.
          </h3>
          <FeatureList className="d-block mr-auto ml-auto mt-2 mb-4">
            <li>
              <IconWrapper Icon={Fa.FaPodcast} />
              Connect with real Podcasters
            </li>
            <li>
              <IconWrapper Icon={Io.IoIosPeople} />
              Grow your Audience
            </li>
            <li>
              <IconWrapper Icon={Fa.FaHandshake} />
              Build a personal Network
            </li>
            <li>
              <IconWrapper Icon={Io.IoIosLock} />
              Keep your Contact Details private
            </li>
          </FeatureList>
          <ConversionButton
            className="ml-auto mr-auto"
            onClick={() => dispatch(push(register.link))}
          >
            Join For Free
          </ConversionButton>
          <a href="#info-start">
            <Io.IoIosArrowDown
              className="ml-auto mr-auto d-block arrow-btn mt-4"
              size={60}
            />
          </a>
        </div>
      </Banner>
      <Section>
        <Container className="">
          <div className="pt-4 pb-4 mt-4 mb-4" id="info-start" />
          <Row className="mb-4">
            <Col lg={6}>
              <div
                style={{ height: "100%" }}
                className="d-flex flex-column justify-content-center"
              >
                <MainImage src={PodcastSVG} />
              </div>
            </Col>
            <Col lg={6}>
              <Banner>
                <h2>The first Podcasters Cross-Speaking Platform.</h2>
                <p>
                  Start reaching <b>real podcasters</b> in seconds. Find your
                  ideal guest or increase your exposure by speaking on different
                  shows.
                </p>
                <a href="#benefits-container">
                  <ConversionButton className="ml-auto mr-auto">
                    Discover the Benefits
                  </ConversionButton>
                </a>
              </Banner>
            </Col>
          </Row>
          <div className="pt-4 pb-4 mt-4 mb-4" />
          <Row className="mb-4 mt-md-4">
            <Col className="d-block d-lg-none">
              <div style={{ height: "100%" }}>
                <MainImage src={SecuritySVG} />
              </div>
            </Col>
            <Col lg={6}>
              <Banner>
                <h2>
                  Podcasters instead of Catfishs and self-proclaimed Experts.
                </h2>
                <p>
                  Authenticate yourself as a podcast host in a few seconds,
                  using your RSS feed. Your contact details aren't shared
                  without your permission.
                </p>
              </Banner>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div
                style={{ height: "100%" }}
                className="d-flex flex-column justify-content-center"
              >
                <MainImage src={SecuritySVG} />
              </div>
            </Col>
          </Row>
          <div className="pt-4 pb-4 mt-4 mb-4" />
        </Container>
      </Section>
      <div className="d-block d-md-none pd-mb-4 pd-mt-4" />
      <SectionMainBg>
        <Container id="benefits-container" className="pb-4 pt-4">
          <h2 className="text-center pt-4">Who is using CastSpot?</h2>
          <div className="pb-md-4 pt-md-4"></div>
          <Carousel />
        </Container>
      </SectionMainBg>
      <SectionMainBg>
        <Container id="benefits-container" className="pb-4 pt-4">
          <h2 className="text-center pt-4">
            Why Podcasters are the best Guests
          </h2>
          <div className="pb-md-4 pt-md-4"></div>
          <Row>
            <Col md={4} xs={12}>
              <CardOnPurpleBg>
                <Card.Header className="text-center bg-white">
                  <IconWrapper Icon={Io.IoIosChatboxes} />
                  Speaking Experience
                </Card.Header>
                <Card.Body>
                  <p>
                    Podcasters know how to keep discussions engaging and have
                    experience talking for an audience.
                  </p>
                </Card.Body>
              </CardOnPurpleBg>
            </Col>
            <Col md={4} xs={12}>
              <CardOnPurpleBg>
                <Card.Header className="text-center bg-white">
                  <IconWrapper Icon={Io.IoIosMic} />
                  Audio Quality Awareness
                </Card.Header>
                <Card.Body>
                  <p>
                    Typical guests can be oblivious to the quality of their
                    audio, but a bad recording can ruin the episode.
                  </p>
                </Card.Body>
              </CardOnPurpleBg>
            </Col>
            <Col md={4} xs={12}>
              <CardOnPurpleBg>
                <Card.Header className="text-center bg-white">
                  <IconWrapper Icon={Io.IoIosPeople} />
                  Audience Growth
                </Card.Header>
                <Card.Body>
                  <p>
                    When two podcasters cover similar topics, it is likely that
                    a collaborative episode can result in high listener growth
                    for both.
                  </p>
                </Card.Body>
              </CardOnPurpleBg>
            </Col>
          </Row>
          <div className="pb-md-4 pt-md-4"></div>
          <Row>
            <Col md={4} xs={12}>
              <CardOnPurpleBg>
                <Card.Header className="text-center bg-white bg-white">
                  <IconWrapper Icon={Fa.FaUserCheck} />
                  Easier Guest Vetting
                </Card.Header>
                <Card.Body>
                  <p>
                    Given how much audio there is to listen to, it's easy to
                    tell if a given podcaster would be a good guest on your show
                    or not.
                  </p>
                </Card.Body>
              </CardOnPurpleBg>
            </Col>
            <Col md={4} xs={12}>
              <CardOnPurpleBg>
                <Card.Header className="text-center bg-white bg-white">
                  <IconWrapper Icon={Fa.FaUserTie} />
                  Increases Credibility
                </Card.Header>
                <Card.Body>
                  <p>
                    Speaking on a popular podcast or featuring a presitigous
                    podcaster shows listeners that you know your stuff.
                  </p>
                </Card.Body>
              </CardOnPurpleBg>
            </Col>
            <Col md={4} xs={12}>
              <CardOnPurpleBg>
                <Card.Header className="text-center bg-white">
                  <IconWrapper Icon={Io.IoMdSchool} /> Knowledge Exchange
                </Card.Header>
                <Card.Body>
                  <p>
                    Learn from each other - discover and share strategies on how
                    to organise, prepare and grow your shows.
                  </p>
                </Card.Body>
              </CardOnPurpleBg>
            </Col>
          </Row>
          <div className="pb-md-4 pt-md-4"></div>
        </Container>
      </SectionMainBg>
      <Section>
        <Container className="pb-4 pt-4">
          <h2 className="text-center pt-4">How to get started</h2>
          <div className="pb-md-4 pt-md-4"></div>
          <Row>
            <Col md={4}>
              <CardOnPurpleBg>
                <Card.Header className="text-center bg-white">
                  Step 1
                </Card.Header>
                <Card.Body>
                  Verify your Podcast - we only let real hosts interact with
                  others on the site.
                </Card.Body>
              </CardOnPurpleBg>
            </Col>
            <Col md={4}>
              <CardOnPurpleBg>
                <Card.Header className="text-center bg-white">
                  Step 2 <br></br>
                  <b>For Finding Guests</b>
                </Card.Header>
                <Card.Body>
                  <p className="mb-0">
                    Create a new guest speaking opportunity that other users can
                    apply to. Simply mention what type of topic you want your
                    upcoming episode to cover.
                  </p>
                </Card.Body>
              </CardOnPurpleBg>
            </Col>
            <Col md={4}>
              <CardOnPurpleBg>
                <Card.Header className="text-center bg-white">
                  Step 2 <br></br>
                  <b>For Guest Speaking</b>
                </Card.Header>
                <Card.Body>
                  <p className="mb-0">
                    Update your contact details and apply to open guest speaking
                    opportunities in two clicks. Your details are shared with
                    the host (but nobody else), so they can get in touch with
                    you.
                  </p>
                </Card.Body>
              </CardOnPurpleBg>
            </Col>
          </Row>
          <div className="pb-md-4 pt-md-4"></div>
        </Container>
      </Section>
    </div>
  );
};

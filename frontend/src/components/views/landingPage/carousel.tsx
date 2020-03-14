import React from "react";
import styled from "styled-components";

const CarouselWrapper = styled.div`
  overflow: hidden;
  max-width: 100%;
  min-height: 40vh;
  img {
    height: 200px;
    width: 200px !important;
    margin: 0 2rem;
    border-radius: 2rem;
  }
`;

export default () => {
  return (
    <CarouselWrapper className="d-flex">
      <img
        src="https://yt3.ggpht.com/-Y4tjkwsR774/AAAAAAAAAAI/AAAAAAAAAAA/1kTUglFGXoU/s900-c-k-no-mo-rj-c0xffffff/photo.jpg"
        alt="JRE logo"
      />
      <img
        src="https://blog.snappa.com/wp-content/uploads/2017/03/indie-hackers-artwork-1.png"
        alt="Indie hackers logo"
      />
      <div
        className="bg-light "
        style={{
          minWidth: "200px",
          width: "200px",
          height: "200px",
          margin: "0 2rem",
          borderRadius: "2rem"
        }}
      ></div>
      <img src="https://static.libsyn.com/p/assets/5/5/3/2/5532328095b38e20/ninja-entrepreneur-podcast.png"></img>
      <img src="https://cdn.smartpassiveincome.com/wp-content/uploads/2016/03/AskPat-2-Logo-HighRes.png" />
    </CarouselWrapper>
  );
};

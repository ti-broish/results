import React, { useState } from "react";
import ReactPlayer from "react-player";

import styled from "styled-components";

//import ReactHLS from "react-hls";
//<ReactHLS url={"https://stest.tibroish.bg/hls/0777.m3u8"} />

const Wrapper = styled.div`
  border-collapse: collapse;
  box-shadow: rgb(170 170 170) 0px 0px 10px;
`;

const Message = () => {
  return <>Няма налични видеа в момента.</>;
};

export default function StreamPlayer() {
  const [streams, setStreams] = useState(false);

  return (
    // Render a streaming video player
    <>
      {streams ? (
        <Wrapper>
          <ReactPlayer
            url="https://stest.tibroish.bg/hls/0777.m3u8"
            controls={true}
            width="100%"
            height="100%"
          />
        </Wrapper>
      ) : (
        <Message />
      )}
    </>
  );
}

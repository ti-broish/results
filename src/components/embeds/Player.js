import React, { useEffect, useState } from "react";
import videojs from "video.js";
import axios from "axios";

import "video.js/dist/video-js.css";

import styled from "styled-components";

//videojs.registerPlugin("playlist", videojsPlaylistPlugin);
//videojs.registerPlugin("concat", videojsConcatPlugin);

const Wrapper = styled.div`
  border-collapse: collapse;
  box-shadow: rgb(170 170 170) 0px 0px 10px;
  position: relative;
  padding-top: 56.25%; /* Player ratio: 100 / (1280 / 720) */
`;

const StyledPlayer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const Message = () => {
  return <>Няма налични видеа в момента.</>;
};

class VideoPlayer extends React.Component {
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log("onPlayerReady", this);
    });

    if (this.props.isStreaming != true) {

       this.player.playlist(this.props.playlist);
       this.player.playlist.autoadvance(0);
    }
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <StyledPlayer>
        <div style={{ height: "100%", width: "100%" }}>
          <video
            ref={(node) => (this.videoNode = node)}
            className="video-js"
            style={{ height: "100%", width: "100%" }}
          ></video>
        </div>
      </StyledPlayer>
    );
  }
}

const Player = (props) => {
  const dataURL = process.env.DATA_URL ? process.env.DATA_URL : "";

  const URL = dataURL.replace("/results", "");

  const [chunks, setChunks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [broadcastUrl, setBroadcastUrl] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    axios.get(`${URL}/sections/${props.section}/streams`).then((res) => {

        if (res.data.lenght != 0) {
        res.data.map((entry) => {
          setChunks([...chunks,entry.chunks]);
          setBroadcastUrl(entry.broadcastUrl);
          setIsStreaming(entry.isStreaming); 
          if (entry.chunks.length != 0) {
            const playlist = entry.chunks.map((source) => {
              return { sources: [{ src: source.url, type: "video/mp4" }], poster: "" };
            });
            setPlaylist(playlist);
          } 
        });
      }
    });
  }, []);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    sources: [{
        src: broadcastUrl,
        type: 'application/x-mpegURL'
    }]
  };

  return (
    // Render a streaming video player
    <>
      {playlist.length != 0 || isStreaming ? (
        <Wrapper>
          <VideoPlayer {...videoJsOptions} playlist={playlist} isStreaming={isStreaming}/>
        </Wrapper>
      ) : (
        <Message />
      )}
    </>
  );
};

export default Player;

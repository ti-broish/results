import React, { useEffect, useState } from "react";
import videojs from "video.js";
import "videojs-playlist";
import axios from "axios";

import "video.js/dist/video-js.css";

import styled from "styled-components";

const Wrapper = styled.div`
  height: 70vh;
  border-collapse: collapse;
  box-shadow: rgb(170 170 170) 0px 0px 10px;
  display: flex;
  justify-content: space-around;
`;

const StyledPlayer = styled.div`
  width: 100%;
  height: 100%;
  flex: 4;
`;

const StyledLi = styled.li`
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid white;
  color: white;
  background: #00d5bd;
  ${StyledLi}:hover {
    cursor: pointer;
    background: rgb(204, 204, 204);
    color: black;
  }
`;

const StyledUl = styled.ul`
  list-style-type: none; /* Remove bullets */
  padding: 0;
  margin: 0;
  flex: 1;
  height: 70vh;
  overflow: auto;
`;

const Message = () => {
  return <>Няма налични видеа в момента.</>;
};

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStreaming: this.props.isStreaming,
      playlist: this.props.playlist,
      index: this.props.index,
    };
  }

  componentDidMount() {
    if (this.player) {
      this.player.dispose();
    }
    // instantiate Video.js
    if (this.state.isStreaming) {
      this.player = videojs(
        this.videoNode,
        this.props,
        function onPlayerReady() {
          console.log("onPlayerReady", this);
          console.log("playing stream");
        }
      );
    } else {
      this.player = videojs(
        this.videoNode,
        this.props,
        function onPlayerReady() {
          console.log("onPlayerReady", this);
          console.log("playing video");
        }
      );
      this.player.playlist(this.props.playlist);
      this.player.playlist.autoadvance(0);
    }
  }

  componentWillReceiveProps() {
    if (this.state.isStreaming) {
      this.player.src(this.props.broadcastUrl)
    } else {
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

  const [data, setData] = useState(null);
  const [index, setIndex] = useState(0);
  const [chunks, setChunks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [broadcastUrl, setBroadcastUrl] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    axios.get(`${URL}/sections/${props.section}/streams`).then((res) => {
      setData(res.data);
      setChunks(res.data[index].chunks);
      setBroadcastUrl(res.data[index].broadcastUrl);
      setIsStreaming(res.data[index].isStreaming);
      if (res.data[index].chunks.length != 0) {
        const playlist = res.data[index].chunks.map((source) => {
          return {
            sources: [{ src: source.url, type: "video/mp4" }],
            poster: "",
          };
        });
        setPlaylist(playlist);
      }
    });
  }, [index]);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    sources: [
      {
        src: broadcastUrl,
        type: "application/x-mpegURL",
      },
    ],
  };

  const list = () => {
    return data.map((entry, index) => {
      if (entry.isStreaming === true) {
        return (
          <StyledLi
            onClick={() => {
              setIndex(index);
            }}
          >
            Видео {index + 1} (на живо)
          </StyledLi>
        );
      } else {
        return (
          <StyledLi
            onClick={() => {
              setIndex(index);
            }}
          >
            Видео {index + 1} (на запис)
          </StyledLi>
        );
      }
    });
  };

  if (data) {
    console.log(data[index]);
  }

  return (
    // Render a streaming video player
    <>
      {playlist.length != 0 || isStreaming ? (
        <Wrapper>
          <VideoPlayer
            {...videoJsOptions}
            playlist={playlist}
            isStreaming={isStreaming}
            index={index}
            chunks={chunks}
            broadcastUrl={broadcastUrl}
          />
          {data ? <StyledUl>{list()}</StyledUl> : null}
        </Wrapper>
      ) : (
        <Message />
      )}
    </>
  );
};

export default Player;

import React, { useEffect, useContext, useState } from 'react';

import axios from 'axios';
import videojs from "video.js";
import "videojs-playlist";

import "video.js/dist/video-js.css";

import { Link } from 'react-router-dom';
import LoadingScreen from './layout/LoadingScreen';
import { ElectionContext } from './Election';
import { formatDateTime } from './Util';

import styled from 'styled-components';

import { Fade } from 'react-reveal';

const Wrapper = styled.div`
  height: 70vh;
  border-collapse: collapse;
  box-shadow: rgb(170 170 170) 0px 0px 10px;
  margin-bottom: 20px;
`;

const StyledPlayer = styled.div`
  width: 100%;
  height: 100%;
`;

class VideoPlayer extends React.Component {
    componentDidMount() {
      // instantiate Video.js
      if (this.props.isStreaming) {
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

export default props => {
    const { meta, parties, dataURL } = useContext(ElectionContext);
    const [data, setData] = useState({
        items: null,
        moreToLoad: true,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${dataURL}/streams/feed`).then(res => {
            setData({
                items: res.data,
                moreToLoad: res.data.length >= 50
            });
        });
    }, []);

    const renderStream = (stream, i) => {

        console.log(stream);

        const videoJsOptions = {
            autoplay: false,
            controls: true,
            muted: false,
            sources: [
              {
                src: stream.broadcastUrl,
                type: "application/x-mpegURL",
              },
            ],
        };

        return(
            <Wrapper>
                <VideoPlayer
                    key={i}
                    {...videoJsOptions}
                    playlist={stream.chunks.map((source) => {
                    return {
                        sources: [{ src: source.url, type: "video/mp4" }],
                        poster: "",
                    };
                    })}
                    chunks={stream.chunks}
                    isStreaming={stream.isStreaming}
                    index={i}
                    broadcastUrl={stream.broadcastUrl}
                />
            </Wrapper>
        );
    };

    return(
        <>
            <h1>Видеа</h1>
            {
                !data.items? <LoadingScreen/> :
                    data.items.map(renderStream)
            }
        </>
    );
};
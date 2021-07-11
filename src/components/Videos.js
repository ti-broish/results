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
  height: 35vh;
  border-collapse: collapse;
  box-shadow: rgb(170 170 170) 0px 0px 10px;
  margin-bottom: 20px;
`;

const StyledPlayer = styled.div`
  width: 100%;
  height: 100%;

  .vjs-big-play-button {
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    display: block;
    position: absolute;
  }
`;

const LiveStreams = styled.div`
    max-width: 500px;
    margin: 0 auto;
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

const ShowMoreButton = styled.button`
  cursor: pointer;
  width: 300px;
  margin: 0 auto;
  display: block;
  padding: 13px;
  border: 1px solid #ccc;
  background-color: #999;
  color: white;
  font-size: 17px;
  font-weight: bold;
  border-radius: 10px;
  border-top: 0px;
  border-bottom: 5px solid #666;

  &:hover {
      background-color: #aaa;
  }

  &:disabled {
      background-color: #888;
      color: #bbb;
      border-top: 5px solid white;
      border-bottom: 0px;
  }

  &:active {
      border-top: 5px solid white;
      border-bottom: 0px;
  }
`;

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
                moreToLoad: res.data.length >= 5
            });
        });
    }, []);

    const getMoreStreams = () => {
        setLoading(true);
        const lastViolation = data.items[data.items.length-1].id;
        axios.get(`${dataURL}/streams/feed?after=${lastViolation}`).then(res => {
            setData({
                items: [...data.items, ...res.data],
                moreToLoad: res.data.length >= 5
            });
            setLoading(false);
        });
    };

    const renderStream = (stream, i) => {

        console.log(stream.section);

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
            <>
                <h3 style={{margin: '20px 0 10px 0'}}>
                    <Link to={`/${stream.section.id}`}>Секция {stream.section.id}</Link>, 
                    {' '}
                    МИР {stream.section.electionRegion.code}. {stream.section.electionRegion.name}
                </h3>
                <h5 style={{color: '#666', marginTop: '10px'}}>
                    Град {stream.section.town.name}, {stream.section.place}
                </h5>
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
            </>
        );
    };

    return(
        <LiveStreams>
            <h1 style={{textAlign: 'center'}}>Стриймове от секциите</h1>
            {
                !data.items? <LoadingScreen/> :
                    data.items.map(renderStream)
            }
            {
                !data.moreToLoad? null :
                    <ShowMoreButton disabled={loading} onClick={getMoreStreams}>
                        {loading? 'Зареждане...' : 'Покажи още'}
                    </ShowMoreButton>
            }
        </LiveStreams>
    );
};
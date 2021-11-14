import React, { useEffect, useState } from 'react';
import videojs from 'video.js';
import 'videojs-playlist';
import axios from 'axios';

import 'video.js/dist/video-js.css';

import styled from 'styled-components';

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

const Message = () => {
  return <p>Няма налични видеа в момента.</p>;
};

class VideoPlayer extends React.Component {
  componentDidMount() {
    // instantiate Video.js
    if (this.props.isStreaming) {
      this.player = videojs(
        this.videoNode,
        this.props,
        function onPlayerReady() {
          console.log('onPlayerReady', this);
          console.log('playing stream');
        }
      );
    } else {
      this.player = videojs(
        this.videoNode,
        this.props,
        function onPlayerReady() {
          console.log('onPlayerReady', this);
          console.log('playing video');
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
        <div style={{ height: '100%', width: '100%' }}>
          <video
            ref={(node) => (this.videoNode = node)}
            className="video-js"
            style={{ height: '100%', width: '100%' }}
          ></video>
        </div>
      </StyledPlayer>
    );
  }
}

const Player = (props) => {
  const dataURL = process.env.DATA_URL ? process.env.DATA_URL : '';

  const URL = dataURL.replace('/results', ''); //to be removed on push!!!

  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${URL}/sections/${props.section}/streams`).then((res) => {
      setData(res.data);
    });
  }, []);

  const list = () => {
    return data.map((entry, index) => {
      const videoJsOptions = {
        autoplay: false,
        controls: true,
        muted: false,
        sources: [
          {
            src: entry.broadcastUrl,
            type: 'application/x-mpegURL',
          },
        ],
      };
      return;
      <Wrapper>
        <VideoPlayer
          key={index}
          {...videoJsOptions}
          playlist={entry.chunks.map((source) => {
            return {
              sources: [{ src: source.url, type: 'video/mp4' }],
              poster: '',
            };
          })}
          isStreaming={entry.isStreaming}
          index={index}
          chunks={entry.chunks}
          broadcastUrl={entry.broadcastUrl}
        />
      </Wrapper>;
    });
  };

  return (
    // Render a streaming video player
    <>{data?.length > 0 ? list() : <Message />}</>
  );
};

export default Player;

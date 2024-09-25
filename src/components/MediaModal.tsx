import React, {useState} from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MediaModalProps {
  isVisible: boolean;
  mediaUri: string | null;
  onClose: () => void;
  mediaType: 'image' | 'video' | null;
}

const MediaModal: React.FC<MediaModalProps> = ({
  isVisible,
  mediaUri,
  onClose,
  mediaType,
}) => {
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1.0);
  const togglePlayPause = () => setPaused(!paused);
  const toggleMute = () => setMuted(!muted);
  const toggleVolume = () => setVolume(volume === 1.0 ? 0.5 : 1.0);
  const changeRate = () => {
    const rates = [0.5, 1.0, 1.5, 2.0, 2.5];
    const nextRate = rates[(rates.indexOf(rate) + 1) % rates.length];
    setRate(nextRate);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={1600}
      animationOutTiming={1600}>
      <View
        style={[
          styles.modalContent,
          mediaType === 'video' && styles.modalContentVideo,
        ]}>
        {mediaUri &&
          (mediaType === 'video' ? (
            <Video
              source={{uri: mediaUri}}
              style={styles.modalVideo}
              controls
              resizeMode="contain"
              paused={paused}
              volume={volume}
              muted={muted}
              rate={rate}
              onEnd={() => setPaused(true)}
              onError={error => console.log('Video Error:', error)}
              onBuffer={({isBuffering}) =>
                console.log('Buffering:', isBuffering)
              }
            />
          ) : (
            <Image source={{uri: mediaUri}} style={styles.modalImage} />
          ))}
        {mediaType === 'video' && (
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.controlButton}>
              <Icon
                name={paused ? 'play-arrow' : 'pause'}
                size={30}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
              <Icon
                name={muted ? 'volume-off' : 'volume-up'}
                size={30}
                color="white"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={toggleVolume}
              style={styles.controlButton}>
              <Icon
                name={volume === 1.0 ? 'volume-high' : 'volume-low'}
                size={30}
                color="white"
              />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={changeRate} style={styles.controlButton}>
              <Icon name="speed" size={30} color="white" />
              <Text style={styles.controlButtonText}>{rate}x</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 0,
  },
  modalContent: {
    height: 100,
    backgroundColor: 'pink',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentVideo: {
    height: '50%', // Adjusted height for video
  },
  modalImage: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
  },
  modalVideo: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  controlButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default MediaModal;

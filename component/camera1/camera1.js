import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';

import {RNCamera} from 'react-native-camera';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Ionicons';
import Camera from '../camera/camera';
const PendingView = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignContent: 'center',
      }}>
      <Text>Waiting</Text>
    </View>
  );
};
const Camera1 = (props) => {
  const [videoData, setVideoData] = useState(0);
  const [recording, setRecording] = useState(false);
  const [data, setData] = useState(0);
  const [flashMode, setFlashMode] = useState('');
  const [backCamera, setBackCamera] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [maxDuration, setMaxDuration] = useState(300);
  const [captureAudio, setCaptureAudio] = useState(true);
  const [path, setPath] = useState('/');
  const [uri, setUri] = useState('/');
  let countRecordTime;
  const controFlashMode = () => {
    setFlashMode(!flashMode);
  };

  const recordVideo = async (camera) => {
    if (camera) {
      if (!recording) startRecording(camera);
      else stopRecording(camera);
    }
  };
  useEffect(() => {
    console.log(seconds);
  }, [seconds]);

  const startRecording = async (camera) => {
    setRecording(true);

    countRecordTime = setInterval(() => {
      let value = seconds;
      setSeconds(value + 1);
    }, 1000);
    const cameraConfig = {maxDuration: maxDuration};
    const data = await camera.recordAsync(cameraConfig);
    setRecording(false);
    console.log(data);
    CameraRoll.saveToCameraRoll(data.uri, 'video')
      .then((onfulfilled) => {
        alert(1);
        ToastAndroid.show(`New video path: ${onfulfilled}`, ToastAndroid.SHORT);
      })
      .catch((error) =>
        ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT),
      );
  };

  const stopRecording = (camera) => {
    camera.stopRecording();
    alert(2);
    clearInterval(countRecordTime);
    setSeconds(0);
  };
  const reverseCamera = () => {
    if (recording) {
      clearInterval(countRecordTime);
      setSeconds(0);
    }

    let newbackCamera = !backCamera;
    if (newbackCamera) ToastAndroid.show('Back Camera', ToastAndroid.SHORT);
    else ToastAndroid.show('Front Camera', ToastAndroid.SHORT);
    setBackCamera(newbackCamera);
  };

  const secondsToMMSS = (seconds) => {
    let m = Math.floor(seconds / 60);
    let s = Math.floor(seconds % 60);

    let mDisplay = m < 10 ? `0${m}` : `${m}`;
    let sDisplay = s < 10 ? `0${s}` : `${s}`;
    return `${mDisplay}:${sDisplay}`;
  };

  const takePicture = async (camera) => {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    setUri(data.uri);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={
          flashMode
            ? RNCamera.Constants.FlashMode.on
            : RNCamera.Constants.FlashMode.off
        }
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({camera, status, recordAudioPermissionStatus}) => {
          if (status !== 'READY') return <PendingView />;
          return (
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={controFlashMode}
                style={styles.capture}>
                <Icon
                  type="Entypo"
                  style={styles.icon}
                  size={50}
                  color="black"
                  name={flashMode ? 'ios-flash' : 'ios-flash-off'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  takePicture(camera);
                }}>
                <EntypoIcon
                  style={styles.icon}
                  size={50}
                  color="black"
                  name="camera"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconContainer}
                onPress={reverseCamera}>
                <Icon
                  style={styles.icon}
                  size={60}
                  color="black"
                  name="camera-reverse"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  recordVideo(camera);
                }}
                style={styles.capture}>
                <EntypoIcon
                  style={styles.icon}
                  size={50}
                  color={recording ? 'red' : 'black'}
                  name="video-camera"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.capture}>
                {recording ? (
                  <Text style={{color: 'red'}}>{seconds}</Text>
                ) : (
                  <Text style={{color: 'red'}}>abc</Text>
                )}
              </TouchableOpacity>
              <Text style={{color: 'black', width: 100}}>abc</Text>
            </View>
          );
        }}
      </RNCamera>

      <Image
        style={{
          height: 100,
          width: '100%',
        }}
        source={{uri: uri}}></Image>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  actions: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 15,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
});

export default Camera1;

import React, {FC, useState, useEffect} from 'react';
import style from './style';
import FastImage from 'react-native-fast-image';
import {ImageStyle, View} from 'react-native';
import {IMAGE_LOGO, IMAGE_USER} from '@assets/icons';

interface GTImageProps {
  uri?: any;
  imageContainerStyle?: ImageStyle;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  path?: any;
  customStyle?: ImageStyle | any;
  errorImage?: any;
  onLoad?: () => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: () => void;
  onProgress?: () => void;
  showLoadingIndicator?: boolean;
}

const AppImage: FC<GTImageProps> = ({
  uri,
  imageContainerStyle,
  resizeMode,
  path,
  customStyle,
  errorImage,
  onLoad,
  onLoadStart,
  onLoadEnd,
  onError,
  onProgress,
  showLoadingIndicator = false,
}) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Determine image source based on error state and provided props
  const imageSource = isError
    ? errorImage || IMAGE_LOGO
    : uri
    ? {
        uri,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.web,
      }
    : path
    ? path
    : IMAGE_LOGO;

  // Force calling onLoadEnd after a timeout as a fallback
  useEffect(() => {
    let loadTimeoutId: NodeJS.Timeout | null = null;

    if (isLoading) {
      // Set a timeout to ensure loading state is reset if events don't fire properly
      loadTimeoutId = setTimeout(() => {
        setIsLoading(false);
        if (onLoadEnd) onLoadEnd();
      }, 10000); // 10 seconds timeout as a safety
    }

    return () => {
      if (loadTimeoutId) {
        clearTimeout(loadTimeoutId);
      }
    };
  }, [isLoading, onLoadEnd]);

  // Handle internal loading state and propagate to parent
  const handleLoadStart = () => {
    setIsLoading(true);
    if (onLoadStart) onLoadStart();
  };

  // We won't rely on FastImage's onLoadEnd as it appears unreliable
  const handleLoadEnd = () => {
    setIsLoading(false);
    if (onLoadEnd) onLoadEnd();
  };

  const handleError = () => {
    setIsError(true);
    setIsLoading(false);
    if (onError) onError();
    if (onLoadEnd) onLoadEnd(); // Make sure onLoadEnd is always called
  };

  const handleLoad = () => {
    // Add a small delay before calling onLoadEnd to ensure proper sequencing
    setTimeout(() => {
      setIsLoading(false);
      if (onLoad) onLoad();
      // Call onLoadEnd directly from onLoad since FastImage's onLoadEnd seems unreliable
      if (onLoadEnd) onLoadEnd();
    }, 100);
  };

  return (
    <View style={[style.container, imageContainerStyle]}>
      <FastImage
        style={{...style.imageStyle, ...customStyle}}
        source={imageSource}
        resizeMode={resizeMode ? resizeMode : FastImage.resizeMode.cover}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        // Not using FastImage's onLoadEnd directly as it seems unreliable
        onProgress={onProgress}
      />
    </View>
  );
};

export default AppImage;

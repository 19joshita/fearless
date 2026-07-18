import {View, Text} from 'react-native';
import React from 'react';
import {AppView} from '@global-components';
import WebView from 'react-native-webview';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ResourcesTabRootStackParamList} from '@navigation-utils';
import {RouteNames} from '@utils';
// import Pdf from 'react-native-pdf';

type ResourceViewPropsList = RouteProp<
  ResourcesTabRootStackParamList,
  typeof RouteNames.RESOURCES_VIEW
>;
const ResourceView = () => {
  const route = useRoute<ResourceViewPropsList>();
  const {link, type} = route.params;
  const uri = `https://docs.google.com/gview?embedded=true&url=${link}`;
  // const source = {uri: link};
  const source = {uri: type === 'link' ? link : uri};

  return (
    <AppView customViewStyle={{paddingHorizontal: 0, paddingBottom: 0}}>
      {/* {type === 'pdf' ? (
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={{flex: 1}}
        />
      ) : ( */}
      <WebView
        style={{flex: 1}}
        source={source}
        setDisplayZoomControls={false}
        allowFileAccess={false}
        scalesPageToFit={true}
        startInLoadingState={true}
        allowsLinkPreview={true}
        onShouldStartLoadWithRequest={request => {
          // Allow the initial load
          if (request.url === uri) {
            return true;
          }

          if (request?.url?.startsWith('https://docs.google.com/')) {
            return false;
          }
          // Block all other URL changes
          return true;
        }}
        // javaScriptEnabled={type === 'link'}
      />
      {/* )} */}
    </AppView>
  );
};

export default ResourceView;

import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';

type CatalogueScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Catalogue'
>;

const CatalogueScreen: React.FC = () => {
  const navigation = useNavigation<CatalogueScreenNavigationProp>();
  const webViewRef = useRef<WebView>(null);

  const injectedJavaScript = `
    (function() {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
      document.getElementsByTagName('head')[0].appendChild(meta);
      
      const style = document.createElement('style');
      style.innerHTML = \`
        * {
          -webkit-overflow-scrolling: touch !important;
          overflow-x: auto !important;
        }
        table {
          display: block !important;
          overflow-x: auto !important;
          white-space: nowrap !important;
          max-width: 100% !important;
        }
        body {
          overflow-x: auto !important;
        }
      \`;
      document.head.appendChild(style);
      
      // Function to extract and send PDF URL
      function extractPDFUrl() {
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.src) {
          const pdfUrl = iframe.src;
          const title = document.querySelector('.header-title')?.textContent || 
                       document.querySelector('h1')?.textContent || 
                       document.title || 
                       'Katalog';
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PDF_DETECTED',
            url: pdfUrl,
            title: title.trim()
          }));
        } else {
          setTimeout(extractPDFUrl, 500);
        }
      }
      
      // Try to extract PDF URL after page load
      if (document.readyState === 'complete') {
        setTimeout(extractPDFUrl, 500);
      } else {
        window.addEventListener('load', function() {
          setTimeout(extractPDFUrl, 500);
        });
      }
      
      // Also try on DOMContentLoaded
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(extractPDFUrl, 500);
      });
      
      // Handle PDF links - detect and send to React Native
      document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && target.href) {
          if (target.href.toLowerCase().endsWith('.pdf')) {
            e.preventDefault();
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'PDF_LINK',
              url: target.href,
              title: target.textContent || 'PDF'
            }));
          }
        }
      });
      
      true;
    })();
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'PDF_DETECTED' || data.type === 'PDF_LINK') {
        let pdfUrl = data.url;
        
        // Extract actual PDF URL from Google Docs Viewer URL
        if (pdfUrl.includes('docs.google.com/viewer')) {
          const match = pdfUrl.match(/url=([^&]+)/);
          if (match && match[1]) {
            pdfUrl = decodeURIComponent(match[1]);
          }
        }
        
        // Validate URL before navigating
        if (pdfUrl && pdfUrl.trim() !== '' && pdfUrl.toLowerCase().endsWith('.pdf')) {
          // Navigate to native PDF viewer
          navigation.navigate('CataloguePDF', {
            pdfUrl: pdfUrl,
            title: data.title || 'Katalog'
          });
        }
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={getImage('ic_arrow_back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Catalogue</Text>
          <View style={styles.headerRightSpacer} />
        </View>
      </SafeAreaView>

      <WebView
        ref={webViewRef}
        source={{
          uri: 'https://pmo.menara-agung.com/katalog-motor',
        }}
        style={styles.webview}
        startInLoadingState={true}
        scalesPageToFit={true}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        setBuiltInZoomControls={true}
        setDisplayZoomControls={false}
        nestedScrollEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: colors.black,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.grayText,
  },
  headerRightSpacer: {
    width: 44,
  },
});

export default CatalogueScreen;

import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import { colors } from '../../config/colors';

interface PDFViewerProps {
  pdfUrl: string;
  onLoadComplete?: (numberOfPages: number) => void;
  onError?: (error: any) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  onLoadComplete,
  onError,
}) => {
  return (
    <Pdf
      source={{ uri: pdfUrl, cache: true }}
      style={styles.pdf}
      trustAllCerts={false}
      onLoadComplete={(numberOfPages, _filePath) => {
        onLoadComplete?.(numberOfPages);
      }}
      onPageChanged={(_page, _numberOfPages) => {
      }}
      onError={(error) => {
        onError?.(error);
      }}
      onPressLink={(_uri) => {
      }}
      enablePaging={true}
      horizontal={false}
      spacing={10}
      renderActivityIndicator={() => (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading PDF...</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.grayText,
  },
});

export default PDFViewer;

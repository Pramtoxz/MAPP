import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import { collectionService, InvoiceDetail } from '../../services';
import { InvoiceItemCard } from './components';
import { LoadingOverlay } from '../Home/components';

type InvoiceDetailScreenRouteProp = RouteProp<RootStackParamList, 'InvoiceDetail'>;
type InvoiceDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const InvoiceDetailScreen: React.FC = () => {
  const navigation = useNavigation<InvoiceDetailScreenNavigationProp>();
  const route = useRoute<InvoiceDetailScreenRouteProp>();
  const { noFaktur } = route.params;

  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoiceDetail = async () => {
      setLoading(true);
      try {
        const result = await collectionService.getInvoiceDetail(noFaktur);
        if (result.success && result.data) {
          setInvoice(result.data);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };

    loadInvoiceDetail();
  }, [noFaktur]);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Outstanding':
        return '#FF9800';
      case 'Paid':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Image source={getImage('bg_honda3.png')} style={styles.backgroundImage} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Invoice</Text>
        <View style={styles.headerRight} />
      </View>

      {invoice ? (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <View style={styles.invoiceHeaderLeft}>
                <Text style={styles.invoiceNumber}>{invoice.noFaktur}</Text>
                <Text style={styles.invoiceDate}>{formatDate(invoice.tanggal)}</Text>
              </View>
              <View
                style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) }]}
              >
                <Text style={styles.statusText}>{invoice.status}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>DO</Text>
              <Text style={styles.infoValue}>{invoice.noDo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>SO</Text>
              <Text style={styles.infoValue}>{invoice.noSo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Jenis Pembayaran</Text>
              <Text style={styles.infoValue}>{invoice.jenisPembayaran}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Nilai Gross</Text>
              <Text style={styles.priceValue}>{formatPrice(invoice.nilaiGross)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total Diskon</Text>
              <Text style={[styles.priceValue, { color: colors.error }]}>
                -{formatPrice(invoice.totalDiskon)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabelBold}>Nilai Nett</Text>
              <Text style={styles.priceValueBold}>{formatPrice(invoice.nilaiNett)}</Text>
            </View>

            {invoice.status === 'Outstanding' && (
              <View style={styles.saldoBox}>
                <Text style={styles.saldoLabel}>Sisa Tagihan</Text>
                <Text style={styles.saldoValue}>{formatPrice(invoice.saldo)}</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Item Invoice</Text>

          {invoice.items.map((item, index) => (
            <InvoiceItemCard key={index} item={item} formatPrice={formatPrice} />
          ))}
        </ScrollView>
      ) : null}

      {loading && <LoadingOverlay />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: colors.white,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.white,
    marginLeft: 8,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  invoiceCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGray,
    marginBottom: 24,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invoiceHeaderLeft: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGray,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  infoValue: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  priceValue: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  priceLabelBold: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  priceValueBold: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  saldoBox: {
    backgroundColor: colors.backgroundWarning,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saldoLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.warning,
  },
  saldoValue: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.warning,
  },
  sectionTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 16,
  },
});

export default InvoiceDetailScreen;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import DatePicker from '@amjed-bouhouch/react-native-ui-datepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { getImage } from '../../../assets/images';

dayjs.locale('id');

interface DateRange {
  startDate: string | undefined;
  endDate: string | undefined;
}

interface DateFilterModalProps {
  visible: boolean;
  dateRange: DateRange;
  onClose: () => void;
  onDateRangeChange: (params: any) => void;
  onApply: () => void;
  onClear: () => void;
}

export const DateFilterModal: React.FC<DateFilterModalProps> = ({
  visible,
  dateRange,
  onClose,
  onDateRangeChange,
  onApply,
  onClear,
}) => {
  const formatDateDisplay = (date: string | undefined) => {
    if (!date) return 'Pilih tanggal';
    return dayjs(date).format('DD MMMM YYYY');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Tanggal</Text>
            <TouchableOpacity onPress={onClose}>
              <Image source={getImage('ic_close_popup.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.dateRangeDisplay}>
              <View style={styles.dateRangeItem}>
                <Text style={styles.dateRangeLabel}>Dari:</Text>
                <Text style={styles.dateRangeValue}>
                  {formatDateDisplay(dateRange.startDate)}
                </Text>
              </View>
              <View style={styles.dateRangeSeparator} />
              <View style={styles.dateRangeItem}>
                <Text style={styles.dateRangeLabel}>Sampai:</Text>
                <Text style={styles.dateRangeValue}>
                  {formatDateDisplay(dateRange.endDate)}
                </Text>
              </View>
            </View>

            <DatePicker
              mode="range"
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={onDateRangeChange}
              selectedItemColor={colors.primary}
              selectedTextStyle={{
                fontFamily: fonts.bold,
                color: colors.white,
              }}
              todayContainerStyle={styles.todayContainer}
              headerButtonColor={colors.primary}
              headerTextStyle={{
                fontFamily: fonts.bold,
                fontSize: fonts.sizes.medium,
              }}
              weekDaysTextStyle={{
                fontFamily: fonts.semibold,
                fontSize: fonts.sizes.tiny,
              }}
              calendarTextStyle={{
                fontFamily: fonts.regular,
                fontSize: fonts.sizes.default,
              }}
            />
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={onClear}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={onApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 450,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  closeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  dateRangeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dateRangeItem: {
    flex: 1,
  },
  dateRangeSeparator: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderGray,
    marginHorizontal: 12,
  },
  dateRangeLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  dateRangeValue: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  applyButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  todayContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

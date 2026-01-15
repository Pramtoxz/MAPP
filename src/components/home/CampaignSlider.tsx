import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import CampaignCard from './CampaignCard';
import { Campaign } from '../../services';

interface CampaignSliderProps {
  campaigns: Campaign[];
  onPress: (campaignId: string) => void;
  autoSlide?: boolean;
  interval?: number;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

const CampaignSlider: React.FC<CampaignSliderProps> = ({
  campaigns,
  onPress,
  autoSlide = true,
  interval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!autoSlide || campaigns.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % campaigns.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * CARD_WIDTH,
          animated: true,
        });
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoSlide, campaigns.length, interval]);

  if (campaigns.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
          setCurrentIndex(newIndex);
        }}
        scrollEventThrottle={16}
      >
        {campaigns.map((campaign) => (
          <View key={campaign.id} style={styles.cardContainer}>
            <CampaignCard
              badge={campaign.badge}
              title={campaign.title}
              description={`Ends ${campaign.endDate} • ${campaign.description}`}
              image={campaign.image}
              onPress={() => onPress(campaign.id)}
            />
          </View>
        ))}
      </ScrollView>
      {campaigns.length > 1 && (
        <View style={styles.pagination}>
          {campaigns.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
  },
  activeDot: {
    backgroundColor: '#E61B33',
    width: 24,
  },
});

export default CampaignSlider;

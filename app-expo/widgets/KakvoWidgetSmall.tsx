import React from 'react';
import { FlexWidget, TextWidget, OverlapWidget } from 'react-native-android-widget';
import type { WidgetPick } from '../lib/widgetMeal';

const INK = '#3d2318';

type Props = { meal: WidgetPick };

/** Small square widget: brand label on top, big emoji in the middle, meal name below. */
export function KakvoWidgetSmall({ meal }: Props) {
  return (
    <OverlapWidget
      clickAction="OPEN_APP"
      style={{ height: 'match_parent', width: 'match_parent', borderRadius: 28 }}
    >
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          borderRadius: 28,
          backgroundGradient: { from: '#FBEFE6', to: '#EFC9B2', orientation: 'TL_BR' },
        }}
      />
      <FlexWidget
        style={{
          height: 130,
          width: 130,
          borderRadius: 100,
          marginTop: -38,
          marginLeft: -38,
          backgroundColor: meal.glowSoft,
        }}
      />
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 13,
        }}
      >
        <TextWidget text="КАКВО ДА ЯМ?" style={{ fontSize: 9, fontWeight: '700', color: 'rgba(61, 35, 24, 0.4)' }} />
        <FlexWidget style={{ width: 'match_parent', alignItems: 'center' }}>
          <TextWidget text={meal.emoji} style={{ fontSize: 46 }} />
        </FlexWidget>
        <TextWidget text={meal.name} maxLines={2} style={{ fontSize: 14, fontWeight: '700', color: INK }} />
      </FlexWidget>
    </OverlapWidget>
  );
}

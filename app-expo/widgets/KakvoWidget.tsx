import React from 'react';
import { FlexWidget, TextWidget, OverlapWidget } from 'react-native-android-widget';
import type { WidgetPick } from '../lib/widgetMeal';

const INK = '#3d2318';

type Props = { meal: WidgetPick };

export function KakvoWidget({ meal }: Props) {
  return (
    <OverlapWidget
      clickAction="OPEN_APP"
      style={{ height: 'match_parent', width: 'match_parent', borderRadius: 28 }}
    >
      {/* Warm gradient base */}
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          borderRadius: 28,
          backgroundGradient: { from: '#FBEFE6', to: '#EFC9B2', orientation: 'TL_BR' },
        }}
      />
      {/* Soft mood glow tucked in the top-left corner */}
      <FlexWidget
        style={{
          height: 150,
          width: 150,
          borderRadius: 100,
          marginTop: -40,
          marginLeft: -40,
          backgroundColor: meal.glowSoft,
        }}
      />
      {/* Content */}
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 13,
        }}
      >
        <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 'match_parent' }}>
          <TextWidget text="КАКВО ДА ЯМ?" style={{ fontSize: 10, fontWeight: '700', color: 'rgba(61, 35, 24, 0.4)' }} />
          <TextWidget text={meal.badge} maxLines={1} style={{ fontSize: 13, fontWeight: '700', color: 'rgba(61, 35, 24, 0.6)' }} />
        </FlexWidget>

        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', width: 'match_parent' }}>
          <TextWidget text={meal.emoji} style={{ fontSize: 42, marginRight: 12 }} />
          <FlexWidget style={{ flexDirection: 'column', flex: 1 }}>
            <TextWidget
              text={meal.name}
              maxLines={2}
              style={{ fontSize: 18, fontWeight: '700', color: INK }}
            />
            {meal.reason ? (
              <TextWidget
                text={'„' + meal.reason + '"'}
                maxLines={2}
                style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(61, 35, 24, 0.55)', marginTop: 3 }}
              />
            ) : (
              <FlexWidget style={{ height: 0, width: 0 }} />
            )}
          </FlexWidget>
        </FlexWidget>

        <TextWidget text="Натисни за да отвориш" style={{ fontSize: 10, fontWeight: '600', color: 'rgba(61, 35, 24, 0.3)' }} />
      </FlexWidget>
    </OverlapWidget>
  );
}

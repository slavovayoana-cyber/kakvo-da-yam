import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { KakvoWidget } from './KakvoWidget';
import { KakvoWidgetSmall } from './KakvoWidgetSmall';
import { pickWidgetMeal } from '../lib/widgetMeal';

const WIDGETS = {
  Kakvo: KakvoWidget,
  KakvoSmall: KakvoWidgetSmall,
} as const;

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  const name = props.widgetInfo.widgetName as keyof typeof WIDGETS;
  const Widget = WIDGETS[name];
  if (!Widget) return;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
    case 'WIDGET_CLICK':
      props.renderWidget(<Widget meal={pickWidgetMeal()} />);
      break;
    default:
      break;
  }
}

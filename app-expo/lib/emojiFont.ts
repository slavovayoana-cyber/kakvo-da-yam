import { Platform } from 'react-native';

/**
 * Apple Color Emoji is excellent on iOS, so we leave that platform alone.
 * On Android, the system emoji set varies between vendors and OS versions
 * (older Samsungs in particular look very different from iOS) — so we ship
 * Twemoji-Mozilla, an open-source COLR/CPAL color font that visually matches
 * the iOS round style closely.
 *
 * Only apply this fontFamily to Text components that render PURE emojis
 * (no mixed text), otherwise non-emoji glyphs will fall back to Twemoji's
 * glyph set which doesn't contain Cyrillic, Latin, etc.
 */
export const EMOJI_FONT_FAMILY: string | undefined =
  Platform.OS === 'android' ? 'Twemoji' : undefined;

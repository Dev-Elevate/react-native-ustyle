import type {
  ViewProps,
  TextProps,
  TextInputProps,
  ImageProps,
  ModalProps,
  SwitchProps,
  FlatListProps,
  ScrollViewProps,
  SectionListProps,
  KeyboardAvoidingViewProps,
  RefreshControlProps,
  ImageBackgroundProps,
  ButtonProps,
  PressableProps,
  ModalBaseProps,
  AccessibilityProps,
  VirtualizedListProps,
  TouchableOpacityProps,
  ActivityIndicatorProps,
  TouchableHighlightProps,
  TouchableWithoutFeedbackProps,
  TouchableNativeFeedbackProps,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';

// type AllStyleTypes = ViewStyle | TextStyle | ImageStyle;
type AllStyleTypesMerged = ViewStyle & TextStyle & ImageStyle;

export type ConfigBuilder = {
  [key: string]: keyof AllStyleTypesMerged;
};

export interface ICustomConfig {}

type ExtendedConfigType = {
  [key in keyof ICustomConfig]?: ICustomConfig[key] extends keyof AllStyleTypesMerged
    ? AllStyleTypesMerged[ICustomConfig[key]]
    : never;
};

// make all styles optional
export type ExtendedViewProps = ViewProps & ExtendedConfigType;
export type ExtendedTextProps = TextProps & ExtendedConfigType;
export type ExtendedTextInputProps = TextInputProps & ExtendedConfigType;
export type ExtendedImageProps = ImageProps & ExtendedConfigType;
export type ExtendedModalProps = ModalProps & ExtendedConfigType;
export type ExtendedSwitchProps = SwitchProps & ExtendedConfigType;
export type ExtendedFlatListProps = FlatListProps<any> & ExtendedConfigType;
export type ExtendedScrollViewProps = ScrollViewProps & ExtendedConfigType;
export type ExtendedSectionListProps = SectionListProps<any> &
  ExtendedConfigType;
export type ExtendedKeyboardAvoidingViewProps = KeyboardAvoidingViewProps &
  ExtendedConfigType;
export type ExtendedRefreshControlProps = RefreshControlProps &
  ExtendedConfigType;
export type ExtendedImageBackgroundProps = ImageBackgroundProps &
  ExtendedConfigType;
export type ExtendedButtonProps = ButtonProps & ExtendedConfigType;
export type ExtendedPressableProps = PressableProps & ExtendedConfigType;
export type ExtendedModalBaseProps = ModalBaseProps & ExtendedConfigType;

export type ExtendedAccessibilityProps = AccessibilityProps &
  ExtendedConfigType;
export type ExtendedVirtualizedListProps = VirtualizedListProps<any> &
  ExtendedConfigType;
export type ExtendedTouchableOpacityProps = TouchableOpacityProps &
  ExtendedConfigType;
export type ExtendedActivityIndicatorProps = ActivityIndicatorProps &
  ExtendedConfigType;
export type ExtendedTouchableHighlightProps = TouchableHighlightProps &
  ExtendedConfigType;
export type ExtendedTouchableWithoutFeedbackProps =
  TouchableWithoutFeedbackProps & ExtendedConfigType;
export type ExtendedTouchableNativeFeedbackProps =
  TouchableNativeFeedbackProps & ExtendedConfigType;

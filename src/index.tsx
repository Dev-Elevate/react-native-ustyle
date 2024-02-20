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

type AllStyleTypes = ViewStyle | TextStyle | ImageStyle;

export interface ExtendedComponentProps {}

type ExtendedConfigType = {
  [key in keyof ExtendedComponentProps]: ExtendedComponentProps[key] extends keyof AllStyleTypes
    ? AllStyleTypes[ExtendedComponentProps[key]]
    : never;
};

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

export function View(_props: ExtendedViewProps) {
  return null;
}

export function Text(_props: ExtendedTextProps) {
  return null;
}

export function TextInput(_props: ExtendedTextInputProps) {
  return null;
}

export function Image(_props: ExtendedImageProps) {
  return null;
}

export function Modal(_props: ExtendedModalProps) {
  return null;
}

export function Switch(_props: ExtendedSwitchProps) {
  return null;
}

export function FlatList(_props: ExtendedFlatListProps) {
  return null;
}

export function ScrollView(_props: ExtendedScrollViewProps) {
  return null;
}

export function SectionList(_props: ExtendedSectionListProps) {
  return null;
}

export function KeyboardAvoidingView(
  _props: ExtendedKeyboardAvoidingViewProps
) {
  return null;
}

export function RefreshControl(_props: ExtendedRefreshControlProps) {
  return null;
}

export function ImageBackground(_props: ExtendedImageBackgroundProps) {
  return null;
}

export function Button(_props: ExtendedButtonProps) {
  return null;
}

export function Pressable(_props: ExtendedPressableProps) {
  return null;
}

export function ModalBase(_props: ExtendedModalBaseProps) {
  return null;
}

export function Accessibility(_props: ExtendedAccessibilityProps) {
  return null;
}

export function VirtualizedList(_props: ExtendedVirtualizedListProps) {
  return null;
}

export function TouchableOpacity(_props: ExtendedTouchableOpacityProps) {
  return null;
}

export function ActivityIndicator(_props: ExtendedActivityIndicatorProps) {
  return null;
}

export function TouchableHighlight(_props: ExtendedTouchableHighlightProps) {
  return null;
}

export function TouchableWithoutFeedback(
  _props: ExtendedTouchableWithoutFeedbackProps
) {
  return null;
}

export function TouchableNativeFeedback(
  _props: ExtendedTouchableNativeFeedbackProps
) {
  return null;
}

//

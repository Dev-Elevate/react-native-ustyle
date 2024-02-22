import type {
  ExtendedViewProps,
  ExtendedTextProps,
  ExtendedTextInputProps,
  ExtendedImageProps,
  ExtendedModalProps,
  ExtendedSwitchProps,
  ExtendedFlatListProps,
  ExtendedScrollViewProps,
  ExtendedSectionListProps,
  ExtendedKeyboardAvoidingViewProps,
  ExtendedRefreshControlProps,
  ExtendedImageBackgroundProps,
  ExtendedButtonProps,
  ExtendedPressableProps,
  ExtendedModalBaseProps,
  ExtendedAccessibilityProps,
  ExtendedVirtualizedListProps,
  ExtendedTouchableOpacityProps,
  ExtendedActivityIndicatorProps,
  ExtendedTouchableHighlightProps,
  ExtendedTouchableWithoutFeedbackProps,
  ExtendedTouchableNativeFeedbackProps,
  ConfigBuilder,
} from './types';

export type { ICustomConfig } from './types';

function View(_props: ExtendedViewProps) {
  return null;
}

function Text(_props: ExtendedTextProps) {
  return null;
}

function TextInput(_props: ExtendedTextInputProps) {
  return null;
}

function Image(_props: ExtendedImageProps) {
  return null;
}

function Modal(_props: ExtendedModalProps) {
  return null;
}

function Switch(_props: ExtendedSwitchProps) {
  return null;
}

function FlatList(_props: ExtendedFlatListProps) {
  return null;
}

function ScrollView(_props: ExtendedScrollViewProps) {
  return null;
}

function SectionList(_props: ExtendedSectionListProps) {
  return null;
}

function KeyboardAvoidingView(_props: ExtendedKeyboardAvoidingViewProps) {
  return null;
}

function RefreshControl(_props: ExtendedRefreshControlProps) {
  return null;
}

function ImageBackground(_props: ExtendedImageBackgroundProps) {
  return null;
}

function Button(_props: ExtendedButtonProps) {
  return null;
}

function Pressable(_props: ExtendedPressableProps) {
  return null;
}

function ModalBase(_props: ExtendedModalBaseProps) {
  return null;
}

function Accessibility(_props: ExtendedAccessibilityProps) {
  return null;
}

function VirtualizedList(_props: ExtendedVirtualizedListProps) {
  return null;
}

function TouchableOpacity(_props: ExtendedTouchableOpacityProps) {
  return null;
}

function ActivityIndicator(_props: ExtendedActivityIndicatorProps) {
  return null;
}

function TouchableHighlight(_props: ExtendedTouchableHighlightProps) {
  return null;
}

function TouchableWithoutFeedback(
  _props: ExtendedTouchableWithoutFeedbackProps
) {
  return null;
}

function TouchableNativeFeedback(_props: ExtendedTouchableNativeFeedbackProps) {
  return null;
}

function createConfig<T>(config: T & ConfigBuilder): T {
  return config;
}

export * from 'react-native';

export {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  Switch,
  FlatList,
  ScrollView,
  SectionList,
  KeyboardAvoidingView,
  RefreshControl,
  ImageBackground,
  Button,
  Pressable,
  ModalBase,
  Accessibility,
  VirtualizedList,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  createConfig,
};

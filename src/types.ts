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

// type of array that takes all the keyof AllStyleTypesMerged as a value in the array
type AllStyleTypesArray = Array<keyof AllStyleTypesMerged>;

export type ConfigBuilder = {
  aliases?: {
    [key: string]: keyof AllStyleTypesMerged | AllStyleTypesArray;
  };
  tokens?: {
    [key: string]: {
      [key: string]: string | number;
    };
  };
  components?: {
    [key: string]: {
      tag: string;
      variants?: {
        [key: string]: {
          [variant: string]: {
            [key in keyof AllStyleTypesMerged]?: string | number;
          };
        };
      };
      baseStyle?: {
        [key in keyof AllStyleTypesMerged]?: string | number;
      };
    };
  };
};

// @ts-ignore
export interface ICustomConfig {}
type Test = {
  [key in keyof Omit<
    ICustomConfig['tokens'],
    'global'
  > as `$${key}$${keyof Omit<ICustomConfig['tokens'], 'global'>[key] extends
    | string
    | number
    | undefined
    ? keyof Omit<ICustomConfig['tokens'], 'global'>[key]
    : never}`]: key;
};

type globalTokens = keyof ICustomConfig['tokens']['global'];

type ExtendedConfigType = {
  [key in keyof ICustomConfig['aliases']]?: ICustomConfig['aliases'][key] extends keyof AllStyleTypesMerged
    ? //merge test types
      // support keyof Test prefixed with - or + for negative or positive values


        | (`-${keyof Test}` | keyof Test)
        | (
            | `-${keyof Test}`
            | keyof Test
          ) extends AllStyleTypesMerged[ICustomConfig['aliases'][key]]
      ? (`-${keyof Test}` | keyof Test) | (string & {}) | `$${globalTokens}`
      :
          | `-${keyof Test}`
          | keyof Test
          | `$${globalTokens}`
          | AllStyleTypesMerged[ICustomConfig['aliases'][key]]
    : ICustomConfig['aliases'][key] extends AllStyleTypesArray
    ?
        | (`-${keyof Test}` | keyof Test)
        | (
            | `-${keyof Test}`
            | keyof Test
          ) extends AllStyleTypesMerged[ICustomConfig['aliases'][key][0]]
      ? (`-${keyof Test}` | keyof Test) | (string & {}) | `$${globalTokens}`
      :
          | `-${keyof Test}`
          | keyof Test
          | `$${globalTokens}`
          | AllStyleTypesMerged[ICustomConfig['aliases'][key][0]]
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
// 22
interface VirtualComponentTagType<T> {
  View: React.FC<ExtendedViewProps & T>;
  Text: React.FC<ExtendedTextProps & T>;
  TextInput: React.FC<ExtendedTextInputProps & T>;
  Image: React.FC<ExtendedImageProps & T>;
  Modal: React.FC<ExtendedModalProps & T>;
  Switch: React.FC<ExtendedSwitchProps & T>;
  FlatList: React.FC<ExtendedFlatListProps & T>;
  ScrollView: React.FC<ExtendedScrollViewProps & T>;
  SectionList: React.FC<ExtendedSectionListProps & T>;
  KeyboardAvoidingView: React.FC<ExtendedKeyboardAvoidingViewProps & T>;
  RefreshControl: React.FC<ExtendedRefreshControlProps & T>;
  ImageBackground: React.FC<ExtendedImageBackgroundProps & T>;
  Button: React.FC<ExtendedButtonProps & T>;
  Pressable: React.FC<ExtendedPressableProps & T>;
  ModalBase: React.FC<ExtendedModalBaseProps & T>;
  Accessibility: React.FC<ExtendedAccessibilityProps & T>;
  VirtualizedList: React.FC<ExtendedVirtualizedListProps & T>;
  TouchableOpacity: React.FC<ExtendedTouchableOpacityProps & T>;
  ActivityIndicator: React.FC<ExtendedActivityIndicatorProps & T>;
  TouchableHighlight: React.FC<ExtendedTouchableHighlightProps & T>;
  TouchableWithoutFeedback: React.FC<ExtendedTouchableWithoutFeedbackProps & T>;
  TouchableNativeFeedback: React.FC<ExtendedTouchableNativeFeedbackProps & T>;
}

declare module 'react-native-ustyle' {
  export type VirtualComponentType = {
    [key in keyof ICustomConfig['components']]:
      | VirtualComponentTagType<
          // @ts-ignore
          ICustomConfig['components'][key]['variants'] extends undefined
            ? { helo: 'world' }
            : {
                // @ts-ignore
                [variant in keyof ICustomConfig['components'][key]['variants']]?: keyof ICustomConfig['components'][key]['variants'][variant];
              }
        >[ICustomConfig['components'][key]['tag']];
  };

  export const VC: VirtualComponentType;
}

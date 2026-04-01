import { View, Text, ViewProps, TextProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ContainerProps extends ViewProps {
  className?: string;
  safeHeader?: boolean;
}

export function Container({ className, safeHeader = true, children, ...props }: ContainerProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      style={{
        paddingTop: safeHeader ? Math.max(insets.top, 16) : 0,
        paddingBottom: Math.max(insets.bottom, 16),
      }}
      className={cn("flex-1 bg-white dark:bg-background px-4", className)} 
      {...props}
    >
      {children}
    </View>
  );
}

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'caption';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'black';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export function Typography({ 
  variant = 'body', 
  weight = 'regular', 
  fontSize,
  className, 
  children, 
  ...props 
}: TypographyProps) {
  const variants = {
    h1: 'text-[32px] leading-[40px]',
    h2: 'text-[24px] leading-[32px]',
    h3: 'text-[18px] leading-[24px]',
    h4: 'text-[16px] leading-[22px]',
    body: 'text-[14px] leading-[20px]',
    small: 'text-[12px] leading-[18px]',
    caption: 'text-[10px] uppercase tracking-[1px]',
  };

  const weights = {
    regular: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black',
  };

  const fontSizes = {
    xs: 'text-[12px]',
    sm: 'text-[13px]',
    base: 'text-[14px]',
    lg: 'text-[16px]',
    xl: 'text-[20px]',
    '2xl': 'text-[24px]',
  };

  const families = {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    black: 'Inter_900Black',
  };

  return (
    <Text 
      style={{ fontFamily: families[weight] }}
      className={cn(
        variants[variant], 
        fontSize && fontSizes[fontSize],
        "text-slate-900 dark:text-white", 
        className
      )} 
      {...props}
    >
      {children}
    </Text>
  );
}

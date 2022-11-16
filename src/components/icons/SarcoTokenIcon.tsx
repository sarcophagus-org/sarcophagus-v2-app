import { Icon } from '@chakra-ui/react';

// Icon in the NavBar for the options menu (top right of screen)
export function SarcoTokenIcon(props: any) {
  return (
    <Icon
      viewBox="0 0 20 20"
      width="20px"
      height="20px"
      {...props}
    >
      <path
        d="M19 14.5254L10 19.4754V10.2504M19 14.5254L10 1.02539V10.2504M19 14.5254L10 10.2504"
        stroke="white"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M1 14.5254L10 19.4754V10.2504M1 14.5254L10 1.02539V10.2504M1 14.5254L10 10.2504"
        stroke="white"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

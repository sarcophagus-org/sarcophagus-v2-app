import { Icon } from '@chakra-ui/react';

// Icon in the NavBar for the options menu (top right of screen)
export function DotsMenuIcon(props: any) {
  return (
    <Icon
      viewBox="0 0 17 19"
      width="17"
      height="19"
      {...props}
    >
      <circle
        cx="8.48047"
        cy="5.83398"
        r="1"
        fill="white"
      />
      <circle
        cx="8.48047"
        cy="9.83398"
        r="1"
        fill="white"
      />
      <circle
        cx="8.48047"
        cy="13.834"
        r="1"
        fill="white"
      />
    </Icon>
  );
}

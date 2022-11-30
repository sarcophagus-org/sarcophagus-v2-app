import { Icon } from '@chakra-ui/react';

export function ErrorIcon(props: any) {
  return (
    <Icon
      width="20px"
      height="20px"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 11C9.45 11 9 10.55 9 10V6C9 5.45 9.45 5 10 5C10.55 5 11 5.45 11 6V10C11 10.55 10.55 11 10 11ZM11 15H9V13H11V15Z"
      />
    </Icon>
  );
}

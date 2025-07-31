import { cn } from "@/lib/utils";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  width?: number;
  height?: number;
}

export const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white cursor-pointer"
  >
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

export const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white cursor-pointer"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const ExternalLinkIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
  >
    <path d="M7 17l9.2-9.2M17 17V7H7" />
  </svg>
);

export function ArrowUpRightIcon({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      className={cn(
        "transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
        className
      )}
    >
      <path
        d="M6 18.5L18 6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25 6.5H18V16.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const PersonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M11.9906 6.75C13.4404 6.75 14.6156 5.57475 14.6156 4.125C14.6156 2.67525 13.4404 1.5 11.9906 1.5C10.5409 1.5 9.36563 2.67525 9.36563 4.125C9.36563 5.57475 10.5409 6.75 11.9906 6.75Z"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.4281 12.6281L17.6906 15.1594C17.9063 15.3389 18.1813 15.4313 18.4616 15.4186C18.742 15.4058 19.0074 15.2886 19.2058 15.0902C19.4043 14.8918 19.5214 14.6264 19.5342 14.346C19.547 14.0657 19.4545 13.7907 19.275 13.575L15.5625 8.80313C15.3895 8.62836 15.1836 8.48952 14.9568 8.39459C14.7299 8.29966 14.4865 8.25053 14.2406 8.25H9.74063C9.24151 8.25267 8.76343 8.45131 8.40938 8.80313L4.69688 13.575C4.50357 13.7896 4.40019 14.0703 4.40814 14.359C4.41609 14.6476 4.53476 14.9222 4.73957 15.1258C4.94439 15.3294 5.21966 15.4465 5.50839 15.4527C5.79713 15.459 6.0772 15.3539 6.29063 15.1594L9.55313 12.6281L6.94688 20.8406C6.88409 20.9748 6.84835 21.1201 6.84169 21.2681C6.83504 21.4161 6.8576 21.564 6.90809 21.7032C6.95858 21.8425 7.03602 21.9705 7.13597 22.0799C7.23592 22.1892 7.35643 22.2778 7.49063 22.3406C7.62482 22.4034 7.77007 22.4392 7.91808 22.4458C8.06609 22.4525 8.21395 22.4299 8.35324 22.3794C8.49253 22.3289 8.62051 22.2515 8.72987 22.1515C8.83923 22.0516 8.92784 21.9311 8.99063 21.7969L11.9906 17.0719L14.9906 21.7969C15.0492 21.9369 15.1356 22.0637 15.2445 22.1695C15.3533 22.2753 15.4825 22.3579 15.6242 22.4125C15.7659 22.467 15.9171 22.4924 16.0688 22.4869C16.2206 22.4815 16.3696 22.4453 16.507 22.3808C16.6444 22.3162 16.7673 22.2245 16.8683 22.1111C16.9693 21.9978 17.0464 21.8652 17.0947 21.7213C17.1431 21.5774 17.1619 21.4252 17.1499 21.2738C17.1379 21.1225 17.0954 20.9751 17.025 20.8406L14.4281 12.6281Z"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const OrganizationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M1.5 20.25H22.5"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 20.25V3.75C13.5 3.55109 13.421 3.36032 13.2803 3.21967C13.1397 3.07902 12.9489 3 12.75 3H3.75C3.55109 3 3.36032 3.07902 3.21967 3.21967C3.07902 3.36032 3 3.55109 3 3.75V20.25"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 20.25V9.75C21 9.55109 20.921 9.36032 20.7803 9.21967C20.6397 9.07902 20.4489 9 20.25 9H13.5"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6.75H9"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 12.75H10.5"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 16.5H9"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 16.5H18"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 12.75H18"
      stroke="#FF5B00"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function AtIcon({
  size = 24,
  color = "var(--feature-accent-orange)",
  className = "",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 8.25C14.0711 8.25 15.75 9.92893 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9781 4.4982C15.3076 3.38907 13.3145 2.86959 11.3151 3.02218C9.31572 3.17478 7.42455 3.99071 5.94168 5.3405C4.45881 6.6903 3.46918 8.49665 3.12982 10.4729C2.79046 12.4492 3.12081 14.4822 4.06845 16.2494C5.01608 18.0165 6.52673 19.4166 8.36068 20.2275C10.1946 21.0383 12.2469 21.2135 14.1917 20.7251C16.1365 20.2368 17.8626 19.113 19.096 17.532C20.3294 15.951 20.9995 14.0034 21 11.9982C21 9.92633 20.25 8.2482 18.375 8.2482C16.5 8.2482 15.75 9.92633 15.75 11.9982V15.7482"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.82957 8.8178C3.82957 5.58363 6.46124 2.9528 9.6954 2.9528C12.9287 2.9528 15.5604 5.58363 15.5604 8.8178C15.5604 12.052 12.9287 14.6836 9.6954 14.6836C6.46124 14.6836 3.82957 12.052 3.82957 8.8178ZM19.2421 17.5336L15.4096 13.7111C16.5396 12.3936 17.2271 10.6861 17.2271 8.8178C17.2271 4.6653 13.8479 1.28613 9.6954 1.28613C5.54207 1.28613 2.1629 4.6653 2.1629 8.8178C2.1629 12.9711 5.54207 16.3503 9.6954 16.3503C11.3804 16.3503 12.9329 15.787 14.1887 14.8478L18.0654 18.7136L19.2421 17.5336Z"
      fill="#71727A"
    />
  </svg>
);

export const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M7.24219 16.8749H3.75C3.58424 16.8749 3.42527 16.8091 3.30806 16.6919C3.19085 16.5747 3.125 16.4157 3.125 16.2499V12.7577C3.12472 12.6766 3.14044 12.5962 3.17127 12.5211C3.20211 12.446 3.24744 12.3778 3.30469 12.3202L12.6797 2.94524C12.7378 2.88619 12.8072 2.83929 12.8836 2.80728C12.9601 2.77527 13.0421 2.75879 13.125 2.75879C13.2079 2.75879 13.2899 2.77527 13.3664 2.80728C13.4428 2.83929 13.5122 2.88619 13.5703 2.94524L17.0547 6.42962C17.1137 6.48777 17.1606 6.5571 17.1926 6.63355C17.2247 6.71 17.2411 6.79205 17.2411 6.87493C17.2411 6.95781 17.2247 7.03987 17.1926 7.11632C17.1606 7.19277 17.1137 7.26209 17.0547 7.32024L7.67969 16.6952C7.62216 16.7525 7.5539 16.7978 7.47883 16.8287C7.40376 16.8595 7.32334 16.8752 7.24219 16.8749V16.8749Z"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.625 5L15 9.375"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TicketIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M7.5 4.375V15.625"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.87499 13.0625C1.8742 12.9186 1.92374 12.7789 2.01504 12.6676C2.10635 12.5563 2.23367 12.4805 2.37499 12.4531C2.93712 12.3338 3.4412 12.025 3.80289 11.5784C4.16458 11.1319 4.36194 10.5747 4.36194 10C4.36194 9.42534 4.16458 8.86812 3.80289 8.42157C3.4412 7.97502 2.93712 7.66623 2.37499 7.54687C2.23367 7.51955 2.10635 7.44368 2.01504 7.33241C1.92374 7.22113 1.8742 7.08144 1.87499 6.9375V5C1.87499 4.83424 1.94084 4.67527 2.05805 4.55806C2.17526 4.44085 2.33423 4.375 2.49999 4.375H17.5C17.6658 4.375 17.8247 4.44085 17.9419 4.55806C18.0591 4.67527 18.125 4.83424 18.125 5V6.9375C18.1258 7.08144 18.0763 7.22113 17.9849 7.33241C17.8936 7.44368 17.7663 7.51955 17.625 7.54687C17.0629 7.66623 16.5588 7.97502 16.1971 8.42157C15.8354 8.86812 15.638 9.42534 15.638 10C15.638 10.5747 15.8354 11.1319 16.1971 11.5784C16.5588 12.025 17.0629 12.3338 17.625 12.4531C17.7663 12.4805 17.8936 12.5563 17.9849 12.6676C18.0763 12.7789 18.1258 12.9186 18.125 13.0625V15C18.125 15.1658 18.0591 15.3247 17.9419 15.4419C17.8247 15.5592 17.6658 15.625 17.5 15.625H2.49999C2.33423 15.625 2.17526 15.5592 2.05805 15.4419C1.94084 15.3247 1.87499 15.1658 1.87499 15V13.0625Z"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FolderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M18.125 15C18.125 15.1658 18.0591 15.3247 17.9419 15.4419C17.8247 15.5592 17.6658 15.625 17.5 15.625H2.5C2.33424 15.625 2.17527 15.5592 2.05806 15.4419C1.94085 15.3247 1.875 15.1658 1.875 15V6.25C1.875 6.08424 1.94085 5.92527 2.05806 5.80806C2.17527 5.69085 2.33424 5.625 2.5 5.625H7.1875L8.75 3.75H17.5C17.6658 3.75 17.8247 3.81585 17.9419 3.93306C18.0591 4.05027 18.125 4.20924 18.125 4.375V15Z"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M2.5 17.5H17.5M5 17.5V3.75C5 3.58424 5.06585 3.42527 5.18306 3.30806C5.30027 3.19085 5.45924 3.125 5.625 3.125H14.375C14.5408 3.125 14.6997 3.19085 14.8169 3.30806C14.9342 3.42527 15 3.58424 15 3.75V17.5M7.5 7.5H8.75M7.5 10H8.75M7.5 12.5H8.75M11.25 7.5H12.5M11.25 10H12.5M11.25 12.5H12.5"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <circle
      cx="10"
      cy="10"
      r="8.125"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13.75V10"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 6.25H10.0088"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M7.5 17.5H4.375C4.20924 17.5 4.05027 17.4342 3.93306 17.3169C3.81585 17.1997 3.75 17.0408 3.75 16.875V3.125C3.75 2.95924 3.81585 2.80027 3.93306 2.68306C4.05027 2.56585 4.20924 2.5 4.375 2.5H7.5M13.75 13.75L17.5 10M17.5 10L13.75 6.25M17.5 10H7.5"
      stroke="#71727A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function UploadIcon({
  className = "",
  width = 20,
  height = 21,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
      className={className}
    >
      <path
        d="M13.75 10.5H17.5C17.6658 10.5 17.8247 10.5658 17.9419 10.6831C18.0592 10.8003 18.125 10.9592 18.125 11.125V16.125C18.125 16.2908 18.0592 16.4497 17.9419 16.5669C17.8247 16.6842 17.6658 16.75 17.5 16.75H2.5C2.33424 16.75 2.17527 16.6842 2.05806 16.5669C1.94085 16.4497 1.875 16.2908 1.875 16.125V11.125C1.875 10.9592 1.94085 10.8003 2.05806 10.6831C2.17527 10.5658 2.33424 10.5 2.5 10.5H6.25"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10.5V2.375"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 6.125L10 2.375L13.75 6.125"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6875 14.25C15.0327 14.25 15.3125 13.9702 15.3125 13.625C15.3125 13.2798 15.0327 13 14.6875 13C14.3423 13 14.0625 13.2798 14.0625 13.625C14.0625 13.9702 14.3423 14.25 14.6875 14.25Z"
        fill="black"
      />
    </svg>
  );
}

export function CalendarIcon({
  className = "",
  width = 20,
  height = 21,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
      className={className}
    >
      <path
        d="M16.25 3.625H3.75C3.40482 3.625 3.125 3.90482 3.125 4.25V16.75C3.125 17.0952 3.40482 17.375 3.75 17.375H16.25C16.5952 17.375 16.875 17.0952 16.875 16.75V4.25C16.875 3.90482 16.5952 3.625 16.25 3.625Z"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 2.375V4.875"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 2.375V4.875"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.125 7.375H16.875"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.1875 10.5H9.375L8.125 12.0625C8.33072 12.0621 8.53334 12.1126 8.7149 12.2093C8.89646 12.306 9.05134 12.4461 9.16579 12.617C9.28025 12.788 9.35075 12.9845 9.37104 13.1892C9.39133 13.3939 9.36079 13.6005 9.28211 13.7906C9.20343 13.9806 9.07906 14.1484 8.92002 14.2789C8.76098 14.4093 8.5722 14.4986 8.37041 14.5386C8.16863 14.5786 7.96008 14.5682 7.76327 14.5084C7.56646 14.4485 7.38748 14.341 7.24219 14.1953"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 11.4375L12.5 10.5V14.5625"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({
  className = "",
  width = 20,
  height = 20,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
      className={className}
    >
      <path
        d="M4.375 9.25L10 14.875L15.625 9.25"
        stroke="#1F2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CategoryTagIcon({
  className = "",
  width = 18,
  height = 18,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      className={className}
    >
      <path
        d="M13.6687 13.8094L16.875 9.00002L13.6687 4.19065C13.6179 4.11222 13.548 4.04791 13.4657 4.00366C13.3833 3.95941 13.2911 3.93666 13.1977 3.93752H2.8125C2.66332 3.93752 2.52024 3.99679 2.41475 4.10228C2.30926 4.20777 2.25 4.35084 2.25 4.50002V13.5C2.25 13.6492 2.30926 13.7923 2.41475 13.8978C2.52024 14.0033 2.66332 14.0625 2.8125 14.0625H13.1977C13.2911 14.0634 13.3833 14.0406 13.4657 13.9964C13.548 13.9521 13.6179 13.8878 13.6687 13.8094Z"
        fill="#FF5B00"
      />
    </svg>
  );
}

export function StarIcon({ className = "" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <path
        d="M7.24062 10.4284L9.99687 12.1784C10.3523 12.4026 10.7898 12.0691 10.6859 11.6589L9.8875 8.51984C9.86591 8.43283 9.86934 8.34149 9.8974 8.25634C9.92546 8.1712 9.977 8.09571 10.0461 8.03859L12.518 5.97687C12.8406 5.7089 12.6766 5.16749 12.2555 5.14015L9.0289 4.93234C8.94087 4.92722 8.85623 4.89656 8.78533 4.84411C8.71443 4.79167 8.66035 4.71971 8.62969 4.63703L7.42656 1.60734C7.39471 1.51978 7.33669 1.44415 7.26038 1.39071C7.18407 1.33726 7.09316 1.30859 7 1.30859C6.90683 1.30859 6.81592 1.33726 6.73961 1.39071C6.6633 1.44415 6.60528 1.51978 6.57343 1.60734L5.37031 4.63703C5.33965 4.71971 5.28556 4.79167 5.21466 4.84411C5.14377 4.89656 5.05913 4.92722 4.97109 4.93234L1.74453 5.14015C1.32344 5.16749 1.15937 5.7089 1.48203 5.97687L3.9539 8.03859C4.02299 8.09571 4.07454 8.1712 4.1026 8.25634C4.13065 8.34149 4.13409 8.43283 4.1125 8.51984L3.37422 11.4292C3.24844 11.9214 3.77344 12.3206 4.19453 12.0526L6.75937 10.4284C6.8313 10.3827 6.91476 10.3584 7 10.3584C7.08523 10.3584 7.1687 10.3827 7.24062 10.4284Z"
        fill="url(#paint0_linear_2168_4845)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2168_4845"
          x1="7"
          y1="7"
          x2="1.80616e-07"
          y2="-1"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7DF5B0" />
          <stop offset="0.355769" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LeftArrowIcon({ className = "" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M20.25 12H3.75"
        stroke="#FF5B00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 18.75L3.75 12L10.5 5.25"
        stroke="#FF5B00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RightArrowIcon({ className = "" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3.75 12H20.25"
        stroke="#FF5B00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 18.75L20.25 12L13.5 5.25"
        stroke="#FF5B00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EyeOpenIcon({ width = 20, height = 21, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
      className={className}
    >
      <path
        d="M10 4.875C3.75 4.875 1.25 10.5 1.25 10.5C1.25 10.5 3.75 16.125 10 16.125C16.25 16.125 18.75 10.5 18.75 10.5C18.75 10.5 16.25 4.875 10 4.875Z"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13.625C11.7259 13.625 13.125 12.2259 13.125 10.5C13.125 8.77411 11.7259 7.375 10 7.375C8.27411 7.375 6.875 8.77411 6.875 10.5C6.875 12.2259 8.27411 13.625 10 13.625Z"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EyeClosedIcon({
  width = 20,
  height = 21,
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
      className={className}
    >
      <path
        d="M3.125 3.375L16.875 17.125"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 8.375C8.4375 8.75 8.25 9.25 8.25 9.75C8.25 11.125 9.375 12.25 10.75 12.25C11.25 12.25 11.75 12.0625 12.125 11.75"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 6.25C4.375 7.5 2.5 9.75 2.5 10.5C2.5 10.5 4.375 15.125 10 15.125C11.25 15.125 12.375 14.875 13.375 14.375"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.625 13.125C16.875 11.875 17.5 10.5 17.5 10.5C17.5 10.5 15.625 5.875 10 5.875C9.375 5.875 8.75 6 8.25 6.125"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.4167 10H3.58341"
      stroke="#1F2024"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 16.416V3.58268"
      stroke="#1F2024"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Check Icon Component
export const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.4165 5.91699L8.24984 14.0837L4.1665 10.0003"
      stroke="#15BA6B"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Minus Icon Component
export const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.4167 10H3.58341"
      stroke="#1F2024"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

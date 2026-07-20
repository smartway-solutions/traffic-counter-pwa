import { Box, Link, Stack, Typography } from "@mui/material";

export const BRAND_COMPANY_NAME = "智行股份有限公司";
export const BRAND_URL = "https://www.smartway-solutions-inc.com/";

const companyIconUrl = `${import.meta.env.BASE_URL}company-icon.png`;

export function BrandNotice(): React.JSX.Element {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
      <Box
        component="img"
        src={companyIconUrl}
        alt={`${BRAND_COMPANY_NAME} 標誌`}
        sx={{ width: 28, height: 28, flexShrink: 0, objectFit: "contain" }}
      />
      <Stack spacing={0} sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          智慧財產權標示：{BRAND_COMPANY_NAME}
        </Typography>
        <Link
          href={BRAND_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="caption"
          sx={{ wordBreak: "break-all" }}
        >
          {BRAND_URL}
        </Link>
      </Stack>
    </Stack>
  );
}

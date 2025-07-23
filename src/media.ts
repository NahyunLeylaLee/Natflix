export type Breakpoints = "sm" | "md" | "lg";

export const breakpoints: Record<Breakpoints, string> = {
  sm: '@media (max-width: 640px)',
  md: '@media (min-width: 640px) and (max-width: 1024px)',//1023까지 비슷한 느낌..
  lg: '@media (min-width: 1024px) and (max-width: 1279px)',
  //375 640 1024 1280 ~

  //~639 최소 375 기준으로 만들어라! 375에서 제대로 보이도록.. 
};
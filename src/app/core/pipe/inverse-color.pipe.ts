import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "inverseColor",
})
export class InverseColorPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    const contrastRatio = getContrastRatio(value, "#ffffff");
    if (contrastRatio >= 4.5) {
      return "text-0";
    } else {
      return "text-black";
    }
  }
}

// Function to calculate the contrast ratio between two colors
function getContrastRatio(color1: string, color2: string) {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  const contrastRatio =
    (Math.max(luminance1, luminance2) + 0.05) /
    (Math.min(luminance1, luminance2) + 0.05);
  return contrastRatio;
}

// Function to calculate the relative luminance of a color
function getLuminance(color: string) {
  const rgb = color?.match(/\w\w/g)?.map((val) => parseInt(val, 16)) ?? [];
  const [r, g, b] = rgb.map((val) => {
    const sRGBVal = val / 255;
    return sRGBVal <= 0.03928
      ? sRGBVal / 12.92
      : Math.pow((sRGBVal + 0.055) / 1.055, 2.4);
  });

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance;
}

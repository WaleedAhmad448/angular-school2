import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateago",
})
export class DateAgoPipe implements PipeTransform {
  transform(value: string): string {
    const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
    if (seconds < 60) {
      return "now";
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return minutes + " minutes ago";
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours + " hours ago";
    }
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return days + " days ago";
    }
    const months = Math.floor(days / 30);
    if (months < 12) {
      return months + " months ago";
    }
    const years = Math.floor(months / 12);
    if (!Number.isNaN(years)) return years + " years ago";
    return value;
  }
}

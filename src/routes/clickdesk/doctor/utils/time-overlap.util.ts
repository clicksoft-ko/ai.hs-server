import { TimeRange, TimeValue } from "@/models/desk-doctor";

export class TimeOverlapUtil {
  private static convertToMinutes(tv: TimeValue) {
    return tv.hour * 60 + tv.minute;
  }

  private static isBetween({ target, a, b }: { target: number, a: number, b: number }) {
    return (target >= a && target <= b);
  }
  private static isOverlap(range1: TimeRange, range2: TimeRange) {
    const start1 = this.convertToMinutes(range1.start);
    const end1 = this.convertToMinutes(range1.end);
    const start2 = this.convertToMinutes(range2.start);
    const end2 = this.convertToMinutes(range2.end);

    const checkOverlap = (s1: number, e1: number, s2: number, e2: number): boolean => {
      return (
        this.isBetween({ target: s2, a: s1, b: e1 }) ||
        this.isBetween({ target: e2, a: s1, b: e1 }) ||
        this.isBetween({ target: s1, a: s2, b: e2 }) ||
        this.isBetween({ target: e1, a: s2, b: e2 })
      );
    };

    if (start1 < end1 && start2 < end2) {
      return checkOverlap(start1, end1, start2, end2);
    } else if (start1 > end1 && start2 > end2) {
      return (
        checkOverlap(start1, 1440, start2, 1440) ||
        checkOverlap(0, end1, 0, end2)
      );
    } else if (start1 > end1) {
      return (
        checkOverlap(start1, 1440, start2, end2) ||
        checkOverlap(0, end1, start2, end2)
      );
    } else {
      return (
        checkOverlap(start2, 1440, start1, end1) ||
        checkOverlap(0, end2, start1, end1)
      );
    }
  }

  static hasOverlappingRanges(ranges: TimeRange[]): boolean {
    for (let i = 0; i < ranges.length; i++) {
      for (let j = i + 1; j < ranges.length; j++) {
        if (this.isOverlap(ranges[i], ranges[j])) {
          return true;
        }
      }
    }
    return false;
  }

}
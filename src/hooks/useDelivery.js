import { useMemo } from "react";

export function useDelivery(deliveryConfig) {
  return useMemo(() => {
    if (!deliveryConfig) return { nextDelivery: null, cutoff: null, slots: [] };

    const {
      frequency = "monthly",
      preferred_day = 6,
      preferred_week = 1,
      cutoff_days_before = 2,
      cutoff_hour = 20,
      override_delivery = null,
      override_cutoff = null,
      slots = ["10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"],
    } = deliveryConfig;

    let nextDelivery;
    let cutoff;

    if (override_delivery) {
      nextDelivery = new Date(override_delivery);
    } else {
      nextDelivery = calcNextDelivery(frequency, preferred_day, preferred_week);
    }

    // MEDIU FIX #8: guard against null nextDelivery (calcMonthlyDelivery can return null)
    if (!nextDelivery) {
      return { nextDelivery: null, cutoff: null, slots };
    }

    if (override_cutoff) {
      cutoff = new Date(override_cutoff);
    } else {
      cutoff = new Date(nextDelivery);
      cutoff.setDate(cutoff.getDate() - cutoff_days_before);
      cutoff.setHours(cutoff_hour, 0, 0, 0);
    }

    return { nextDelivery, cutoff, slots };
  }, [deliveryConfig]);
}

function calcNextDelivery(frequency, preferred_day, preferred_week) {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Bucharest" })
  );
  if (frequency === "weekly") {
    const d = new Date(now);
    let diff = (preferred_day - d.getDay() + 7) % 7;
    if (diff === 0) diff = 7;
    d.setDate(d.getDate() + diff);
    d.setHours(10, 0, 0, 0);
    return d;
  }

  if (frequency === "biweekly") {
    const d = new Date(now);
    let diff = (preferred_day - d.getDay() + 7) % 7;
    if (diff === 0) diff = 14;
    if (diff < 7) diff += 7;
    d.setDate(d.getDate() + diff);
    d.setHours(10, 0, 0, 0);
    return d;
  }

  return calcMonthlyDelivery(now, preferred_day, preferred_week);
}

function calcMonthlyDelivery(now, preferred_day, preferred_week) {
  const tryMonth = (year, month) => {
    if (preferred_week === -1) {
      const lastDay = new Date(year, month + 1, 0);
      let d = new Date(lastDay);
      while (d.getDay() !== preferred_day) d.setDate(d.getDate() - 1);
      return d;
    }
    let count = 0;
    let d = new Date(year, month, 1);
    while (d.getMonth() === month) {
      if (d.getDay() === preferred_day) {
        count++;
        if (count === preferred_week) return new Date(d);
      }
      d.setDate(d.getDate() + 1);
    }
    return null;
  };

  let result = tryMonth(now.getFullYear(), now.getMonth());
  if (!result || result <= now) {
    const next =
      now.getMonth() === 11
        ? { y: now.getFullYear() + 1, m: 0 }
        : { y: now.getFullYear(), m: now.getMonth() + 1 };
    result = tryMonth(next.y, next.m);
  }

  if (result) result.setHours(10, 0, 0, 0);
  return result;
}

export function formatCountdown(targetDate) {
  if (!targetDate) return "";
  const ms = targetDate - new Date();
  if (ms <= 0) return "Închis";
  const dy = Math.floor(ms / 86400000);
  const hr = Math.floor((ms % 86400000) / 3600000);
  const mn = Math.floor((ms % 3600000) / 60000);
  return dy > 0
    ? `${dy}z ${hr}h ${mn}m`
    : hr > 0
    ? `${hr}h ${mn}m`
    : `${mn} min`;
}

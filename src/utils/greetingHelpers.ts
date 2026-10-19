export interface GreetingInfo {
  salutation: string;
  subtext: string;
  badge: string;
}

export function getTimeBasedGreeting(firstName?: string): GreetingInfo {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  const hour = now.getHours(); // 0 - 23

  const name = firstName?.trim() ? `, ${firstName.trim()}` : "";

  // 1. Friday
  if (day === 5) {
    if (hour < 12) {
      return {
        salutation: `Good Morning & Happy Friday${name}`,
        subtext: "Wrapping up the week's custom builds? Here are your recently inspected stones ready for final selection.",
        badge: "Happy Friday",
      };
    }
    if (hour < 17) {
      return {
        salutation: `Happy Friday${name}`,
        subtext: "Heading into the weekend with brilliance. Pick up right where you left off with your shortlisted gems.",
        badge: "Friday Atelier",
      };
    }
    return {
      salutation: `Good Evening & Happy Friday${name}`,
      subtext: "Closing out the week in style. Your saved stone inspections are right here for easy review.",
      badge: "Weekend Ahead",
    };
  }

  // 2. Weekend (Saturday & Sunday)
  if (day === 0 || day === 6) {
    if (hour < 12) {
      return {
        salutation: `Good Morning & Happy Weekend${name}`,
        subtext: "Quiet weekend curation at your own pace. Here are the gemstones you recently inspected.",
        badge: "Weekend Vault",
      };
    }
    if (hour < 18) {
      return {
        salutation: `Happy Weekend${name}`,
        subtext: "Savor the search for exceptional gems. Continue right where you left off.",
        badge: "Weekend Atelier",
      };
    }
    return {
      salutation: `Good Evening & Happy Weekend${name}`,
      subtext: "Preparing for a sparkling week ahead. Review your curated shortlist of recently viewed parcels.",
      badge: "Weekend Curation",
    };
  }

  // 3. Monday
  if (day === 1) {
    if (hour < 12) {
      return {
        salutation: `Good Morning & Happy Monday${name}`,
        subtext: "Starting the new week with precision. Pick up right where you left off in your search.",
        badge: "Fresh Week Sourcing",
      };
    }
    if (hour < 17) {
      return {
        salutation: `Happy Monday${name}`,
        subtext: "Setting the standard for the week's creations. Here are your recently viewed stones.",
        badge: "Monday Sourcing",
      };
    }
    return {
      salutation: `Good Evening & Happy Monday${name}`,
      subtext: "Wrapping up day one of the trade week. Your saved gemstones are ready whenever you are.",
      badge: "Evening Vault",
    };
  }

  // 4. Midweek (Wednesday)
  if (day === 3 && hour >= 11 && hour < 17) {
    return {
      salutation: `Happy Midweek${name}`,
      subtext: "Halfway through the week. Continue refining your fine gemstone shortlists.",
      badge: "Midweek Atelier",
    };
  }

  // 5. General Weekdays (Tuesday, Wednesday other times, Thursday)
  if (hour >= 5 && hour < 12) {
    return {
      salutation: `Good Morning${name}`,
      subtext: "Ready to source for today's orders? Here are the precision-cut stones you recently inspected.",
      badge: "Morning Atelier",
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      salutation: `Good Afternoon${name}`,
      subtext: "Continuing your gemstone selections? Pick up right where you left off.",
      badge: "Trade Shortlist",
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      salutation: `Good Evening${name}`,
      subtext: "Reviewing parcels for tomorrow's bench? Your recently viewed gemstones are saved below.",
      badge: "Evening Curation",
    };
  }

  // Late night (22:00 - 04:59)
  return {
    salutation: `Burning the Midnight Oil${name}?`,
    subtext: "Dedicated to the craft at all hours. Your recently inspected stones are right here.",
    badge: "Midnight Vault",
  };
}

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  const now = Date.now();
  const past = new Date(dateString).getTime();
  if (Number.isNaN(past)) return "Recently";
  const diffMinutes = Math.floor((now - past) / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return "Recently";
}

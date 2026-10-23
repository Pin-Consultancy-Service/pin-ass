"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { mockUpcomingEvents } from "@/lib/mockAdminData";

export default function CalendarWidget() {
  const [currentDate] = useState(new Date());

  // Get next 7 days
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return mockUpcomingEvents.filter(event => event.date === dateStr);
  };

  // Get next 5 upcoming events
  const upcomingEvents = mockUpcomingEvents.slice(0, 5);

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "class":
        return { backgroundColor: "var(--navy-50)", color: "var(--navy)" };
      case "exam":
        return { backgroundColor: "#FEE2E2", color: "#DC2626" };
      case "meeting":
        return { backgroundColor: "var(--gold-50)", color: "#92600A" };
      default:
        return { backgroundColor: "var(--surface)", color: "var(--ink-muted)" };
    }
  };

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--rule)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" style={{ color: "var(--navy)" }} />
          <h3 className="font-bold text-lg" style={{ color: "var(--ink)" }}>
            Upcoming Schedule
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            className="p-1 rounded-lg transition-colors"
            style={{ color: "var(--ink-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded-lg transition-colors"
            style={{ color: "var(--ink-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid - Next 7 Days */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {next7Days.map((date, index) => {
          const events = getEventsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className="p-2 rounded-lg text-center transition-all cursor-pointer"
              style={{
                backgroundColor: isToday ? "var(--gold)" : "var(--bg)",
                borderWidth: isToday ? "2px" : "1px",
                borderStyle: "solid",
                borderColor: isToday ? "var(--gold-dark)" : "var(--rule)",
              }}
            >
              <div
                className="text-xs font-medium mb-1"
                style={{ color: isToday ? "var(--navy-dark)" : "var(--ink-muted)" }}
              >
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className="text-lg font-bold mb-1"
                style={{ color: isToday ? "var(--navy-dark)" : "var(--ink)" }}
              >
                {date.getDate()}
              </div>
              {events.length > 0 && (
                <div
                  className="w-1.5 h-1.5 rounded-full mx-auto"
                  style={{ backgroundColor: isToday ? "var(--navy-dark)" : "var(--navy)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming This Week */}
      <div>
        <h4
          className="text-xs font-semibold mb-3 uppercase tracking-wide"
          style={{ color: "var(--ink-muted)" }}
        >
          Upcoming This Week
        </h4>
        <div className="space-y-2">
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: "var(--ink-muted)" }}>
              No upcoming events
            </p>
          ) : (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg border transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: "var(--bg)",
                  borderColor: "var(--rule)",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-semibold text-sm flex-1" style={{ color: "var(--ink)" }}>
                    {event.title}
                  </p>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0"
                    style={getTypeBadgeStyle(event.type)}
                  >
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--ink-muted)" }}>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {event.startTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{event.instructor}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

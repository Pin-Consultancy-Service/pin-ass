"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Clock, Play, Calendar } from "lucide-react";
import Link from "next/link";
import { mockClasses, type ClassData } from "@/lib/mockClassData";

// Calculate minutes until class starts
function getMinutesUntilClass(scheduledDate: string, scheduledTime: string): number {
  const [hours, minutes] = scheduledTime.split(':').map(Number);
  const classDateTime = new Date(scheduledDate);
  classDateTime.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  const diff = classDateTime.getTime() - now.getTime();
  
  return Math.floor(diff / (1000 * 60));
}

// Get notification message based on time remaining
function getNotificationMessage(minutesUntil: number): string {
  if (minutesUntil <= 0) return "Class is starting now!";
  if (minutesUntil <= 5) return `Class starts in ${minutesUntil} minute${minutesUntil > 1 ? 's' : ''}!`;
  if (minutesUntil <= 15) return `Class starts in ${minutesUntil} minutes`;
  if (minutesUntil <= 60) return `Class starts in ${Math.floor(minutesUntil / 60)} hour${Math.floor(minutesUntil / 60) > 1 ? 's' : ''}`;
  return `Upcoming class today`;
}

interface ClassNotificationsProps {
  // Optional: can pass classes as prop or component fetches them itself
  upcomingClasses?: ClassData[];
}

export default function ClassNotifications({ upcomingClasses: propClasses }: ClassNotificationsProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  // Use prop classes if provided, otherwise use mock data
  const upcomingClasses = propClasses || mockClasses.filter(cls => cls.status === "scheduled");

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
      
      if (Notification.permission === "default") {
        // Auto-request permission after 5 seconds
        const timeout = setTimeout(() => {
          Notification.requestPermission().then(permission => {
            setNotificationPermission(permission);
          });
        }, 5000);
        
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  // Check for upcoming classes and send notifications
  useEffect(() => {
    upcomingClasses.forEach(classItem => {
      const minutesUntil = getMinutesUntilClass(classItem.scheduledDate, classItem.scheduledTime);
      
      // Show banner for classes starting within 30 minutes
      if (minutesUntil > 0 && minutesUntil <= 30) {
        setShowBanner(true);
      }

      // Send browser notification at specific times
      if ("Notification" in window && Notification.permission === "granted") {
        // Notify 30 minutes before
        if (minutesUntil === 30) {
          new Notification("Class Starting Soon!", {
            body: `${classItem.subject} - ${classItem.topic} starts in 30 minutes`,
            icon: "/images/pin-logo.png",
            badge: "/images/pin-logo.png",
            tag: `class-${classItem.id}-30min`,
            requireInteraction: false,
          });
        }
        
        // Notify 5 minutes before
        if (minutesUntil === 5) {
          new Notification("Class Starting in 5 Minutes!", {
            body: `${classItem.subject} - ${classItem.topic}`,
            icon: "/images/pin-logo.png",
            badge: "/images/pin-logo.png",
            tag: `class-${classItem.id}-5min`,
            requireInteraction: true,
          });
        }

        // Notify when class starts
        if (minutesUntil === 0) {
          new Notification("Class is Live Now! 🔴", {
            body: `Join ${classItem.subject} now!`,
            icon: "/images/pin-logo.png",
            badge: "/images/pin-logo.png",
            tag: `class-${classItem.id}-now`,
            requireInteraction: true,
          });
        }
      }
    });
  }, [currentTime, upcomingClasses]);

  // Filter classes that need notifications (within next 24 hours)
  const notifiableClasses = upcomingClasses.filter(classItem => {
    const minutesUntil = getMinutesUntilClass(classItem.scheduledDate, classItem.scheduledTime);
    return minutesUntil > 0 && minutesUntil <= 1440; // Next 24 hours
  });

  // Get most urgent class (soonest)
  const mostUrgentClass = notifiableClasses.sort((a, b) => {
    const aMinutes = getMinutesUntilClass(a.scheduledDate, a.scheduledTime);
    const bMinutes = getMinutesUntilClass(b.scheduledDate, b.scheduledTime);
    return aMinutes - bMinutes;
  })[0];

  const urgentMinutes = mostUrgentClass ? getMinutesUntilClass(mostUrgentClass.scheduledDate, mostUrgentClass.scheduledTime) : null;
  const isVeryUrgent = urgentMinutes !== null && urgentMinutes <= 15;

  return (
    <>
      {/* Top Banner Notification - Shows when class is starting soon */}
      <AnimatePresence>
        {showBanner && mostUrgentClass && urgentMinutes !== null && urgentMinutes <= 30 && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-16 left-0 right-0 z-40"
            style={{
              backgroundColor: urgentMinutes <= 5 ? '#DC2626' : urgentMinutes <= 15 ? '#F59E0B' : 'var(--navy)',
              color: 'white',
              padding: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <div className="content-container flex items-center justify-between">
              <div className="flex items-center gap-4">
                {urgentMinutes <= 5 ? (
                  <div className="flex items-center gap-2 animate-pulse">
                    <Play className="w-6 h-6" fill="white" />
                    <span className="font-bold text-lg">CLASS STARTING NOW!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold">{getNotificationMessage(urgentMinutes)}</span>
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-sm opacity-90">
                    {mostUrgentClass.subject} - {mostUrgentClass.topic}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Link
                  href="/portal/student/classes"
                  className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'white',
                    color: urgentMinutes <= 5 ? '#DC2626' : urgentMinutes <= 15 ? '#F59E0B' : 'var(--navy)'
                  }}
                >
                  {urgentMinutes <= 5 ? 'Join Now' : 'View Class'}
                </Link>
                <button
                  onClick={() => setShowBanner(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Bell Icon - Shows in dashboard header */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative p-2 rounded-xl transition-all hover:bg-gray-100"
          style={{ color: 'var(--ink-muted)' }}
        >
          <Bell className="w-5 h-5" />
          
          {/* Badge count */}
          {notifiableClasses.length > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
              style={{ 
                backgroundColor: isVeryUrgent ? '#DC2626' : 'var(--gold)',
                animation: isVeryUrgent ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
              }}
            >
              {notifiableClasses.length}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-96 rounded-2xl border shadow-2xl overflow-hidden z-50"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              {/* Header */}
              <div className="p-4 border-b" style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
                    Class Notifications
                  </h3>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifiableClasses.length > 0 ? (
                  <div className="divide-y" style={{ borderColor: 'var(--rule)' }}>
                    {notifiableClasses.map(classItem => {
                      const minutesUntil = getMinutesUntilClass(classItem.scheduledDate, classItem.scheduledTime);
                      const isUrgent = minutesUntil <= 15;
                      
                      return (
                        <Link
                          key={classItem.id}
                          href="/portal/student/classes"
                          onClick={() => setShowDropdown(false)}
                          className="block p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ 
                                backgroundColor: isUrgent ? '#FEE2E2' : 'var(--navy-50)',
                                color: isUrgent ? '#DC2626' : 'var(--navy)'
                              }}
                            >
                              {isUrgent ? <Play className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>
                                {classItem.subject}
                              </p>
                              <p className="text-sm mb-1" style={{ color: 'var(--ink-muted)' }}>
                                {classItem.topic}
                              </p>
                              <div className="flex items-center gap-2 text-xs" style={{ color: isUrgent ? '#DC2626' : 'var(--ink-faint)' }}>
                                <Calendar className="w-3 h-3" />
                                <span className={isUrgent ? 'font-bold' : ''}>
                                  {getNotificationMessage(minutesUntil)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'var(--ink-muted)' }} />
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink-muted)' }}>
                      No upcoming classes
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                      Check your schedule for future classes
                    </p>
                  </div>
                )}
              </div>

              {/* Footer with browser notifications status */}
              {notificationPermission !== "granted" && (
                <div className="p-3 border-t bg-yellow-50" style={{ borderColor: 'var(--rule)' }}>
                  <button
                    onClick={() => {
                      Notification.requestPermission().then(permission => {
                        setNotificationPermission(permission);
                      });
                    }}
                    className="w-full text-xs text-center py-2 px-3 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: 'var(--gold)', color: 'white' }}
                  >
                    Enable Browser Notifications
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

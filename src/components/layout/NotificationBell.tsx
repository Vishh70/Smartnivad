"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  // In a real implementation, this would fetch from /api/notifications using SWR or React Query
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Price Drop Alert!",
      message: "Sony WH-1000XM5 just dropped below ₹25,000.",
      link: "/deals/sony-wh-1000xm5",
      read: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 relative text-slate-600 hover:text-slate-900 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            <button className="text-xs text-blue-600 hover:underline">
              Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No new notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${notif.read ? "opacity-60" : ""}`}
                >
                  <Link
                    href={notif.link || "#"}
                    className="block"
                    onClick={() => setIsOpen(false)}
                  >
                    <p className="font-semibold text-sm text-slate-800">
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

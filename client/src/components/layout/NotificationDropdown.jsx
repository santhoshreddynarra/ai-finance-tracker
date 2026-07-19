import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSelector } from "react-redux";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Persist read state in localStorage
  const [readState, setReadState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("readNotifications")) || {};
    } catch {
      return {};
    }
  });

  const { user } = useSelector((state) => state.auth);
  const { data: budgetData } = useSelector((state) => state.budget);
  const { items: transactions } = useSelector((state) => state.transactions);
  const { data: dashboardData } = useSelector((state) => state.dashboard);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Save read state
  useEffect(() => {
    localStorage.setItem("readNotifications", JSON.stringify(readState));
  }, [readState]);

  // Generate notifications
  const rawNotifications = useMemo(() => {
    let notifs = [];
    const now = new Date().toISOString();

    // 1. Welcome
    if (user) {
      notifs.push({
        id: `welcome-${user.id || user._id || "user"}`,
        title: "Welcome to AI Finance Tracker",
        description: "Start managing your finances effectively.",
        type: "info",
        createdAt: user.createdAt || now,
      });
    }

    // 2. Budget status
    if (budgetData?.monthlyBudget > 0) {
      notifs.push({
        id: "budget-active",
        title: "New budget created",
        description: `Your monthly budget is set to $${budgetData.monthlyBudget}.`,
        type: "success",
        createdAt: budgetData.updatedAt || now,
      });
    } else {
      notifs.push({
        id: "no-budget",
        title: "No budgets created yet",
        description: "Set up a budget to start tracking your expenses.",
        type: "info",
        createdAt: now,
      });
    }

    // 3. Budget thresholds
    if (budgetData?.categoryBudgets?.length > 0) {
      budgetData.categoryBudgets.forEach((cat) => {
        if (cat.limit > 0) {
          const ratio = cat.spent / cat.limit;
          if (ratio >= 1) {
            notifs.push({
              id: `budget-exceeded-${cat.category}`,
              title: "Budget exceeded",
              description: `Budget for "${cat.category}" exceeded.`,
              type: "warning",
              createdAt: now,
            });
          } else if (ratio >= 0.9) {
            notifs.push({
              id: `budget-90-${cat.category}`,
              title: "Budget usage reached 90%",
              description: `Budget for "${cat.category}" is almost depleted.`,
              type: "warning",
              createdAt: now,
            });
          }
        }
      });
    }

    // 4. Monthly report
    if (dashboardData?.summary) {
      notifs.push({
        id: "monthly-report",
        title: "Monthly report available",
        description: "Check out your spending summary for this month.",
        type: "info",
        createdAt: now,
      });
    }

    // 5. Transactions
    if (transactions && transactions.length > 0) {
      const latest = transactions[0]; // Assuming sorted by date descending
      notifs.push({
        id: `tx-added-${latest._id}`,
        title: "Transaction added",
        description: `Added: ${latest.description || latest.title || "New transaction"}`,
        type: "success",
        createdAt: latest.date || latest.createdAt || now,
      });
    } else {
      notifs.push({
        id: "no-transactions",
        title: "No transactions available",
        description: "Start adding transactions to receive updates.",
        type: "info",
        createdAt: now,
      });
    }

    return notifs;
  }, [user, budgetData, transactions, dashboardData]);

  // Combine with read state and sort
  const notifications = useMemo(() => {
    return rawNotifications
      .map((n) => ({
        ...n,
        read: !!readState[n.id],
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [rawNotifications, readState]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const handleMarkAsRead = useCallback((id) => {
    setReadState((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleClearAll = useCallback(() => {
    const newState = { ...readState };
    notifications.forEach((n) => {
      newState[n.id] = true;
    });
    setReadState(newState);
  }, [notifications, readState]);

  const getIconForType = (type) => {
    switch (type) {
      case "success":
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        );
      case "warning":
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
        );
      case "info":
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0a0a14]" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#13131f]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50 transform origin-top-right transition-all duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-violet-500/20 text-violet-300 text-xs py-0.5 px-2 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {notifications.length > 0 ? (
              <div className="divide-y divide-white/5">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`flex items-start gap-3 p-4 hover:bg-white/[0.04] transition-colors cursor-pointer ${
                      !notif.read ? "bg-white/[0.02]" : "opacity-75"
                    }`}
                  >
                    {getIconForType(notif.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm font-medium truncate pr-2 ${!notif.read ? "text-white" : "text-slate-300"}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-500 flex-shrink-0 mt-0.5">
                          {formatDate(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {notif.description}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-300">No notifications yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Start adding transactions and budgets to receive updates.
                </p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 border-t border-white/5 bg-white/[0.02]">
              <button
                onClick={handleClearAll}
                className="w-full py-2 px-4 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-center"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

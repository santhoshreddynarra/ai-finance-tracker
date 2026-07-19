import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSelector } from "react-redux";

const NotificationItem = ({ notification, onMarkAsRead, getIcon }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div
      onClick={() => onMarkAsRead(notification.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onMarkAsRead(notification.id);
        }
      }}
      role="button"
      tabIndex={0}
      className="flex items-start gap-3 p-3 mx-2 my-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus:bg-white/5 group"
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon(notification.type, notification.read)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <p className="text-sm font-medium truncate pr-2 text-white">
            {notification.title}
          </p>
          <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">
            {formatDate(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm line-clamp-2 text-slate-300">
          {notification.description}
        </p>
      </div>
      {!notification.read && (
        <div className="flex-shrink-0 ml-2 mt-1.5">
          <div className="w-2 h-2 rounded-full bg-violet-500" />
        </div>
      )}
    </div>
  );
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Save read state
  useEffect(() => {
    localStorage.setItem("readNotifications", JSON.stringify(readState));
  }, [readState]);

  const rawNotifications = useMemo(() => {
    let notifs = [];
    const now = new Date().toISOString();

    if (user) {
      notifs.push({
        id: `welcome-${user.id || user._id || "user"}`,
        title: "Welcome to AI Finance Tracker",
        description: "Start managing your finances effectively.",
        type: "info",
        createdAt: user.createdAt || now,
      });
    }

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

    if (dashboardData?.summary) {
      notifs.push({
        id: "monthly-report",
        title: "Monthly report available",
        description: "Check out your spending summary for this month.",
        type: "info",
        createdAt: now,
      });
    }

    if (transactions && transactions.length > 0) {
      const latest = transactions[0];
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

  const getIconForType = (type, isRead) => {
    const baseClasses = "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors";
    
    switch (type) {
      case "success":
        return (
          <div className={`${baseClasses} ${isRead ? "bg-emerald-500/5" : "bg-emerald-500/10"}`}>
            <svg className={`w-4 h-4 ${isRead ? "text-emerald-500/50" : "text-emerald-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
        );
      case "warning":
        return (
          <div className={`${baseClasses} ${isRead ? "bg-amber-500/5" : "bg-amber-500/10"}`}>
            <svg className={`w-4 h-4 ${isRead ? "text-amber-500/50" : "text-amber-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
        );
      case "info":
      default:
        return (
          <div className={`${baseClasses} ${isRead ? "bg-blue-500/5" : "bg-blue-500/10"}`}>
            <svg className={`w-4 h-4 ${isRead ? "text-blue-500/50" : "text-blue-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      <button 
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-2 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
          isOpen ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-violet-500 rounded-full border-2 border-[#0a0a14]" />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div 
            ref={dropdownRef}
            className="absolute right-0 sm:-right-2 mt-2 w-[95vw] sm:w-[380px] bg-[#1A1B26] backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 z-[9999] flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
              <h3 className="text-base font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-violet-500/20 text-violet-400 text-xs font-medium py-1 px-2.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="overflow-y-auto max-h-[340px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent py-1 relative z-[10000]">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={handleMarkAsRead}
                    getIcon={getIconForType}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="text-4xl mb-4 opacity-80">🔔</div>
                  <p className="text-sm font-medium text-white mb-1">No notifications yet</p>
                  <p className="text-sm text-slate-400">Start adding transactions and budgets.</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-2 border-t border-white/10 shrink-0 relative z-[10000]">
                <button
                  onClick={handleClearAll}
                  className="w-full py-2.5 px-4 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-center focus:outline-none focus:bg-white/5"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;

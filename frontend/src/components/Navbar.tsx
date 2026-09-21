import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import {
  ShoppingBag,
  History,
  Store,
  Menu,
  LogOut,
  ShieldAlert,
  X,
  PhoneCall,
  LayoutDashboard,
  UserCog,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/context/cartContext";
import logo from "@/assets/Logo.png";
import { createPortal } from "react-dom";

export default function Navbar() {
  const { user, profile, role, loading, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Pure React states for dropdowns and drawers to eliminate library context crashes
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { name: "Catalog", path: "/catalog", icon: Store },
    { name: "Orders", path: "/orders", icon: History },
    { name: "Contact", path: "/contact", icon: PhoneCall },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (profile?.displayName) {
      return profile.displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#faf8f4]/95 backdrop-blur-md border-b border-gray-100 shadow-sm font-sans antialiased">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* BRAND LOGO AREA */}
          <div className="flex items-center gap-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#faf8f4] rounded-xl flex items-center justify-center shadow-md shadow-[#4c6a46]/10 transition-transform group-hover:scale-105">
                <span className="text-white font-serif text-xl font-bold">
                  <img src={logo} alt="Oong Boys logo" />
                </span>
              </div>
              <span className="font-serif font-bold text-xl text-[#2d4029] tracking-wide transition-colors group-hover:text-[#4c6a46]">
                Oong Boys
              </span>
            </Link>

            {/* DESKTOP ROUTING LINKS */}
            <div className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#4c6a46]/10 text-[#4c6a46]"
                          : "text-gray-600 hover:bg-gray-100 hover:text-[#2d4029]"
                      }
                    `}
                  >
                    <Icon className="w-6 h-6" />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* UTILITY MODULE & AUTH STATES */}
          <div className="hidden md:flex items-center gap-4">
            {/* Shopping Cart Trigger */}
            <NavLink
              to="/cart"
              className={({ isActive }) => `
                relative p-4.5 rounded-full transition-all duration-200 group
                ${
                  isActive
                    ? "bg-[#4c6a46]/10 text-[#4c6a46]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#2d4029]"
                }
              `}
            >
              <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-105" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#4c6a46] text-[10px] font-mono font-bold text-white ring-2 ring-[#faf8f4]">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <div className="h-6 w-px bg-gray-200 mx-1" />

            {/* Auth Conditionals */}
            {loading ? (
              <div className="w-9 h-9 bg-gray-100 rounded-full animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 bg-white hover:border-gray-300 shadow-sm transition-all focus:outline-none"
                >
                  <Avatar className="w-8 h-8 border border-gray-100">
                    <AvatarImage src={profile?.photoURL || ""} alt="Profile" />
                    <AvatarFallback className="bg-[#e3d7c3] text-[#2d4029] text-xs font-bold font-mono">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-25cate text-xs font-semibold text-gray-700">
                    {profile?.displayName || user.email?.split("@")[0]}
                  </span>
                </button>

                {/* Custom Native Dropdown Panel */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-50 transform origin-top-right transition-all">
                    <div className="px-3 py-2 select-none">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Account Role
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-sm font-bold text-[#2d4029] truncate capitalize">
                          {role || "Customer"}
                        </p>
                        {role === "admin" && (
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 my-1.5" />

                    {role === "admin" ? (
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/admin/dashboard");
                        }}
                        className="w-full text-left rounded-xl hover:bg-gray-50 text-gray-700 font-medium px-3 py-2 flex items-center gap-2.5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-400" />
                        Dashboard
                      </button>
                    ) : (
                      ""
                    )}

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left rounded-xl hover:bg-gray-50 text-gray-700 font-medium px-3 py-2 flex items-center gap-2.5 transition-colors"
                    >
                      <UserCog className="w-4 h-4 text-gray-400" />
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/orders");
                      }}
                      className="w-full text-left rounded-xl hover:bg-gray-50 text-gray-700 font-medium px-3 py-2 flex items-center gap-2.5 transition-colors"
                    >
                      <History className="w-4 h-4 text-gray-400" />
                      Order History
                    </button>

                    <div className="h-px bg-gray-100 my-1.5" />

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full text-left rounded-xl hover:bg-red-50 text-red-600 font-semibold px-3 py-2 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-full text-gray-600 font-semibold hover:bg-gray-100 text-sm px-4 py-2 transition-colors inline-flex items-center justify-center h-10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-[#4c6a46] hover:bg-[#3d5538] text-white font-semibold text-sm px-5 transition-colors shadow-md shadow-[#4c6a46]/10 inline-flex items-center justify-center h-10"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE NAVIGATION PORTAL PANEL */}
          <div className="flex items-center md:hidden gap-3">
            <NavLink to="/cart" className="relative p-2 text-gray-600">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#4c6a46] text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-gray-600 rounded-xl hover:bg-gray-100 flex items-center justify-center h-10 w-10 focus:outline-none transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Custom Safe Mobile Side Drawer */}
            {isMobileOpen &&
              createPortal(
                <div className="fixed inset-0 z-9999 isolate md:hidden">
                  <div
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                  />

                  <div className="fixed inset-y-0 right-0 z-10 flex w-80 flex-col justify-between border-l border-gray-200 bg-[#faf8f4]! p-6 font-sans opacity-100 shadow-2xl">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="font-serif font-bold text-xl text-[#2d4029] flex items-center gap-2.5">
                          <div className="w-10 h-10 bg-[#faf8f4] rounded-xl flex items-center justify-center shadow-md shadow-[#4c6a46]/10 transition-transform group-hover:scale-105">
                            <span className="text-white font-serif text-xl font-bold">
                              <img src={logo} alt="Oong Boys logo" />
                            </span>
                          </div>
                          Oong Boys
                        </div>
                        <button
                          onClick={() => setIsMobileOpen(false)}
                          className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Profile Section inside Drawer — tap to open profile */}
                      {user && (
                        <button
                          onClick={() => {
                            setIsMobileOpen(false);
                            navigate("/profile");
                          }}
                          className="w-full flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-left hover:border-gray-200 transition-colors"
                        >
                          <Avatar className="w-10 h-10 border border-gray-100">
                            <AvatarImage
                              src={profile?.photoURL || ""}
                              alt="Profile"
                            />
                            <AvatarFallback className="bg-[#e3d7c3] text-[#2d4029] text-sm font-bold font-mono">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-[#2d4029] truncate">
                              {profile?.displayName ||
                                user.email?.split("@")[0]}
                            </p>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                              {role || "Customer"}
                            </p>
                          </div>
                          <UserCog className="w-4 h-4 text-gray-400 shrink-0" />
                        </button>
                      )}

                      {/* Mobile Links Stack */}
                      <div className="space-y-2">
                        {navigationItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsMobileOpen(false)}
                              className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all
                                ${
                                  isActive
                                    ? "bg-[#4c6a46]/10 text-[#4c6a46]"
                                    : "text-gray-600 hover:bg-gray-50"
                                }
                              `}
                            >
                              <Icon className="w-5 h-5" />
                              {item.name}
                            </NavLink>
                          );
                        })}

                        {user && (
                          <NavLink
                            to="/profile"
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all
                                ${
                                  isActive
                                    ? "bg-[#4c6a46]/10 text-[#4c6a46]"
                                    : "text-gray-600 hover:bg-gray-50"
                                }
                              `}
                          >
                            <UserCog className="w-5 h-5" />
                            My Profile
                          </NavLink>
                        )}
                      </div>
                    </div>

                    {/* Mobile Drawer Auth Call-To-Actions Footer */}
                    <div className="pt-4 border-t border-gray-200/60">
                      {user ? (
                        <button
                          onClick={() => {
                            setIsMobileOpen(false);
                            logout();
                          }}
                          className="w-full h-12 rounded-full font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 flex items-center justify-center gap-2 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            to="/login"
                            onClick={() => setIsMobileOpen(false)}
                            className="h-12 rounded-full border border-gray-200 font-semibold text-gray-600 text-sm bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setIsMobileOpen(false)}
                            className="h-12 rounded-full bg-[#4c6a46] hover:bg-[#3d5538] text-white font-semibold text-sm shadow-md shadow-[#4c6a46]/10 flex items-center justify-center transition-colors"
                          >
                            Register
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>,
                document.body,
              )}
          </div>
        </div>
      </div>
    </nav>
  );
}

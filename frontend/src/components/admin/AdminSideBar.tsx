import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  LogOut,
  ShieldCheck,
  Sprout,
  PackageSearch,
  SendToBack,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  onNavItemClick?: () => void;
}

// Kept unexported to maintain Fast Refresh HMR compatibility
const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: PackageSearch },
  { label: "Inventory Log", path: "/admin/inventory", icon: Package },
  { label: "Orders", path: "/admin/orders", icon: ClipboardList },
];

export function AdminSidebar({ onNavItemClick }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const ToCustomer = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#e5dfd3] text-[#2d4029]">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#e5dfd3]">
        <div className="w-9 h-9 rounded-xl bg-[#e2ebe0] border border-[#c3d6c0] flex items-center justify-center text-[#4c6a46] shrink-0 shadow-sm">
          <Sprout className="w-5 h-5" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-serif font-bold text-base tracking-tight text-[#2d4029] truncate">
            Oong Boys
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#4c6a46]">
            Control Panel
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Overview & Operations
        </p>
        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavItemClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                    isActive
                      ? "bg-[#4c6a46] text-white shadow-sm font-bold"
                      : "text-stone-600 hover:text-[#2d4029] hover:bg-[#f4efe6]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-stone-400 group-hover:text-[#4c6a46]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Admin User / Logout Footer */}
      <div className="p-3 border-t border-[#e5dfd3] bg-[#faf8f4]">
        <div className="p-3 rounded-2xl bg-white border border-[#e5dfd3] shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#e2ebe0] border border-[#c3d6c0] flex items-center justify-center text-[#2d4029] font-bold text-xs shrink-0">
              {user?.displayName?.[0]?.toUpperCase() || (
                <ShieldCheck className="w-4 h-4 text-[#4c6a46]" />
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-[#2d4029] truncate">
                {user?.displayName || "Administrator"}
              </span>
              <span className="text-[10px] text-stone-400 truncate font-medium">
                {user?.email || "admin@store.internal"}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={ToCustomer}
            className="w-full h-8 justify-start gap-2.5 text-xs text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-2.5 transition-colors font-semibold"
          >
            <SendToBack className="w-3.5 h-3.5" />
            <span>Customer</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={logout}
            className="w-full h-8 justify-start gap-2.5 text-xs text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-2.5 transition-colors font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

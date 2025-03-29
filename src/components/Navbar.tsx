
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, BarChart2, Repeat, Vote } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", href: "/", icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { label: "Analytics", href: "/analytics", icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { label: "Swap", href: "/swap", icon: <Repeat className="h-4 w-4 mr-2" /> },
    { label: "Governance", href: "/governance", icon: <Vote className="h-4 w-4 mr-2" /> }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Raven DMM
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map(item => (
              <Link 
                key={item.href}
                to={item.href}
                className={`transition-colors flex items-center ${
                  isActive(item.href) 
                    ? "text-foreground font-semibold" 
                    : "text-foreground/60 hover:text-foreground/80"
                }`}
              >
                {item.icon}
                {item.label}
                {isActive(item.href) && (
                  <div className="h-1 w-full bg-primary absolute bottom-0 left-0 rounded-t-md"></div>
                )}
              </Link>
            ))}
          </nav>
          <WalletConnect />
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center p-2 rounded-md ${
                      isActive(item.href)
                        ? "bg-secondary text-foreground"
                        : "text-foreground/80 hover:bg-secondary/50"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6">
                <WalletConnect />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

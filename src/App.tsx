import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SiteNavbar } from "./components/layout/SiteNavbar";
import { ToastProvider } from "./components/shared/ToastProvider";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ComponentDetail = lazy(() => import("./pages/ComponentDetail"));
const Components = lazy(() => import("./pages/Components"));
const Home = lazy(() => import("./pages/Home"));

export default function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(124,89,255,.28),transparent_32%),radial-gradient(circle_at_85%_12%,rgba(69,217,244,.18),transparent_26%),linear-gradient(180deg,#07070a_0%,#020203_100%)]" />
        <SiteNavbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <Suspense
              fallback={
                <div className="mx-auto min-h-screen max-w-7xl px-4 py-12 text-sm text-zinc-500">
                  Loading AnimateUI...
                </div>
              }
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/components" element={<Components />} />
                <Route path="/components/:slug" element={<ComponentDetail />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Suspense>
          </motion.main>
        </AnimatePresence>
        <SiteFooter />
      </div>
    </ToastProvider>
  );
}

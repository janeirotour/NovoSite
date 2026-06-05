import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout/MainLayout";
import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartSidebar } from "@/components/ui/CartSidebar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ToursPage from "@/pages/tours";
import DestinationsPage from "@/pages/destinations";
import TourDetailPage from "@/pages/tour-detail";
import DestinationDetailPage from "@/pages/destination-detail";
import BlogPage from "@/pages/blog";
import BlogDetailPage from "@/pages/blog-detail";
import FaqPage from "@/pages/faq";
import ContactPage from "@/pages/contact";
import AboutPage from "@/pages/about";
import OurStoryPage from "@/pages/our-story";
import ReviewsPage from "@/pages/reviews";
import TransfersPage from "@/pages/transfers";
import PrivateToursPage from "@/pages/private-tours";
import PackagesPage from "@/pages/packages";
import PackageDetailPage from "@/pages/package-detail";
import AdminLoginPage from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import CheckoutSuccessPage from "@/pages/checkout-success";
import CheckoutCancelPage from "@/pages/checkout-cancel";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboard} />

      {/* Public Routes */}
      <Route path="/">
        <MainLayout><Home /></MainLayout>
      </Route>
      <Route path="/tours">
        <MainLayout><ToursPage /></MainLayout>
      </Route>
      <Route path="/tours/:id">
        <TourDetailPage />
      </Route>
      <Route path="/destinations">
        <MainLayout><DestinationsPage /></MainLayout>
      </Route>
      <Route path="/destinations/:id">
        <DestinationDetailPage />
      </Route>
      <Route path="/blog">
        <MainLayout><BlogPage /></MainLayout>
      </Route>
      <Route path="/blog/:id">
        <BlogDetailPage />
      </Route>
      <Route path="/faq">
        <MainLayout><FaqPage /></MainLayout>
      </Route>
      <Route path="/contact">
        <MainLayout><ContactPage /></MainLayout>
      </Route>
      <Route path="/about">
        <MainLayout><AboutPage /></MainLayout>
      </Route>
      <Route path="/our-story">
        <MainLayout><OurStoryPage /></MainLayout>
      </Route>
      <Route path="/reviews">
        <MainLayout><ReviewsPage /></MainLayout>
      </Route>
      <Route path="/transfers">
        <MainLayout><TransfersPage /></MainLayout>
      </Route>
      <Route path="/private-tours">
        <MainLayout><PrivateToursPage /></MainLayout>
      </Route>
      <Route path="/packages">
        <MainLayout><PackagesPage /></MainLayout>
      </Route>
      <Route path="/packages/:slug" component={PackageDetailPage} />

      {/* Checkout Routes */}
      <Route path="/checkout/success" component={CheckoutSuccessPage} />
      <Route path="/checkout/cancel" component={CheckoutCancelPage} />

      {/* Catch all */}
      <Route>
        <MainLayout><NotFound /></MainLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
        <CurrencyProvider>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
              <CartSidebar />
            </WouterRouter>
            <Toaster />
          </CartProvider>
        </CurrencyProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

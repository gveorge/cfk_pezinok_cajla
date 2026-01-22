import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CategoryDetail from "./pages/CategoryDetail";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import TrainerDashboard from "./pages/TrainerDashboard";
import TrainerPlayers from "./pages/TrainerPlayers";
import TrainerTrainings from "./pages/TrainerTrainings";
import TrainerAttendance from "./pages/TrainerAttendance";
import TrainerNews from "./pages/TrainerNews";
import TrainerGallery from "./pages/TrainerGallery";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/category/:id"} component={CategoryDetail} />
      <Route path={"/404"} component={NotFound} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/trainer"} component={TrainerDashboard} />
      <Route path={"/trainer/players"} component={TrainerPlayers} />
      <Route path={"/trainer/trainings"} component={TrainerTrainings} />
      <Route path={"/trainer/attendance"} component={TrainerAttendance} />
      <Route path={"/trainer/news"} component={TrainerNews} />
      <Route path={"/trainer/gallery"} component={TrainerGallery} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

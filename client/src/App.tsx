import { Route, Switch } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/home";
import Articles from "@/pages/articles";
import Article from "@/pages/article";
import Playground from "@/pages/playground";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/articles" component={Articles} />
          <Route path="/articles/:slug" component={Article} />
          <Route path="/playground" component={Playground} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;

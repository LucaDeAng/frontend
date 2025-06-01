import { Route, Switch } from 'wouter';
import Home from './pages/home';
import Articles from './pages/articles';
import Article from './pages/article';
import ArticleEditor from './pages/admin/ArticleEditor';
import Newsletter from './pages/admin/Newsletter';
import About from './pages/about';
import BuildInPublic from './pages/build-in-public';
import VotablePromptPage from './pages/playground';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/articles" component={Articles} />
      <Route path="/article/:slug" component={Article} />
      <Route path="/admin/articles/:slug" component={ArticleEditor} />
      <Route path="/admin/newsletter" component={Newsletter} />
      <Route path="/about" component={About} />
      <Route path="/build-in-public" component={BuildInPublic} />
      <Route path="/prompts" component={VotablePromptPage} />
    </Switch>
  );
} 
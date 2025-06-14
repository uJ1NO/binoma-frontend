import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer, ErrorBoundary } from './components';
import { 
  HomePage, 
  WalletPage, 
  TransactionsPage, 
  AdminPage, 
  PurchasePage, 
  WithdrawPage, 
  // StatsPage, 
  FounderPage,
  StakingPage,
  LoyaltyPage 
} from './pages';
import { ApiProvider, WalletProvider, NotificationProvider } from './contexts';

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <ApiProvider>
          <WalletProvider>
            <Router>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/purchase" element={<PurchasePage />} />
                    <Route path="/withdraw" element={<WithdrawPage />} />
                    {/* <Route path="/stats" element={<StatsPage />} /> */}
                    <Route path="/staking" element={<StakingPage />} />
                    <Route path="/loyalty" element={<LoyaltyPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/founder" element={<FounderPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </WalletProvider>
        </ApiProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;

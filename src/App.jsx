import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ProgressBar from './components/ProgressBar'
import ChatBot from './components/ChatBot'
import Home from './pages/Home'
import BooksPage from './pages/BooksPage'
import CyberPage from './pages/CyberPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import DictionaryPage from './pages/DictionaryPage'
import ExamPage from './pages/ExamPage'
import LeaderboardPage from './pages/LeaderboardPage'
import './App.css'

export default function App() {
  return (
    <>
      <ProgressBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/cybersecurity" element={<CyberPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
      <ChatBot />
      <BackToTop />
      <Footer />
    </>
  )
}

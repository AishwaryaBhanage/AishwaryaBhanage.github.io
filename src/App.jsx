import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CommandPalette from './components/CommandPalette'
import Home from './pages/Home'
import ExperiencePage from './pages/ExperiencePage'
import ProjectsPage from './pages/ProjectsPage'
import SkillsPage from './pages/SkillsPage'
import AboutPage from './pages/AboutPage'
import CreativePage from './pages/CreativePage'
import ContactPage from './pages/ContactPage'
import ResumePage from './pages/ResumePage'
import NotFound from './pages/NotFound'

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)

  return (
    <Layout onOpenPalette={() => setPaletteOpen(true)}>
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/creative" element={<CreativePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

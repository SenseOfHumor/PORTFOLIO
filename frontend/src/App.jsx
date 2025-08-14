import { useState } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import SplitText from "./components/SplitText"
import Lanyard from './components/Lanyard'
import MagicBento from './components/MagicBento'

function App() {
  const [count, setCount] = useState(0)

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

  return (
    <>
      <Navbar />
      
      <main>
        <section id="home" className="section">
          <div
            className="w-screen h-screen flex justify-center items-center"
            style={{ margin: 0, padding: 0 }}
          >
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
          </div>
        </section>

        <section id="projects" className="section">
          <MagicBento 
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={120}
            glowColor="132, 0, 255"
          />
        </section>

        <section id="contact" className="section">
          <div className="section-content">
            <h1>Contact</h1>
            <p>Get in touch with me...</p>
            <div className="contact-info">
              <p>Email: your.email@example.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default App

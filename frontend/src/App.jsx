import { useState } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import Lanyard from './components/Lanyard'
import ScrambledText from './components/ScrambledText'
import LetterGlitch from './components/LetterGlitch'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import InfiniteSkill from './components/InfiniteSkill'
import SkillsMarquee from './components/SkillsMarquee'

function App() {
  const [count, setCount] = useState(0)

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <main className="w-full overflow-x-hidden">

        <section id="home" className="section">
          <div>
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
          </div>
        </section>

        <section id="about" className="section">
          <div className="section-content">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
              {/* Heading aligns with grid because it's inside the same container */}
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight py-2 mb-15">
                Hi there 👋
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-y-0 lg:gap-x-16 items-start lg:items-center w-full">
                <div className="lg:col-span-6">
                  <div className="max-w-xl w-full">
                    <ScrambledText
                      className="scrambled-text-demo text-left text-base md:text-lg leading-snug"
                      radius={100}
                      duration={1.2}
                      speed={0.5}
                      scrambleChars=".:"
                    >
                      I'm Swapnil, a senior CS student at NJIT building fast, scalable, and impactful software.
                      From Automation pipelines and DevOps integrations to AI-powered apps, I turn complex ideas into reliable products.
                      I focus on performance, automation, and clean design that delivers real-world results.
                    </ScrambledText>
                  </div>
                </div>
                <div className="lg:col-span-6 w-full">
                  <div className="relative w-full max-w-2xl lg:max-w-none overflow-hidden">
                    {/* choose ONE sizing approach; aspect keeps it neat */}
                    <div className="aspect-[16/10] md:aspect-[16/9] w-full">
                      <LetterGlitch
                        glitchSpeed={50}
                        centerVignette={true}
                        outerVignette={false}
                        smooth={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <SkillsMarquee />
          </div>
        </section>

        <section id="projects" className="section">
          <Projects />
        </section>

        <section id="contact" className="section">
          <Contact /> 
        </section>
        
          <Footer
            name="Swapnil Deb"
            githubUrl="https://github.com/SenseOfHumor"
            linkedinUrl="https://www.linkedin.com/in/swapnil-deb-3096b2207/"
            email="swa2314@gmail.com"
          musicProvider="apple"
          musicUrl="https://music.apple.com/in/playlist/blume/pl.u-e98lGdEuadG46JX"
        />

    </main>
  </div>
)
}

export default App


